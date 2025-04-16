// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract DecentHire {
    enum JobStatus { Open, Assigned, Completed, Cancelled, Disputed }
    enum TaskStatus { Pending, InProgress, Completed, Disputed, Resolved }
    enum DisputeOutcome { Pending, ClientWins, FreelancerWins, Split }
    
    struct Job {
        uint256 id;
        address payable client;
        address payable freelancer;
        string title;
        string description;
        uint256 budget;
        uint256 stakeAmount;
        uint256 createdAt;
        JobStatus status;
        uint256[] taskIds;
    }
    
    struct Task {
        uint256 id;
        uint256 jobId;
        string description;
        uint256 amount;
        uint256 deadline;
        TaskStatus status;
        bool clientApproved;
        bool freelancerApproved;
    }
    
    struct Dispute {
        uint256 id;
        uint256 taskId;
        address initiator;
        string reason;
        uint256 createdAt;
        DisputeOutcome outcome;
        address arbitrator;
        uint256 arbitratorFee;
        bool isResolved;
    }
    
    uint256 private jobCounter;
    uint256 private taskCounter;
    uint256 private disputeCounter;
    
    mapping(uint256 => Job) public jobs;
    mapping(uint256 => Task) public tasks;
    mapping(uint256 => Dispute) public disputes;
    mapping(address => uint256[]) public clientJobs;
    mapping(address => uint256[]) public freelancerJobs;
    mapping(address => bool) public arbitrators;
    mapping(uint256 => uint256) public taskToDispute; // taskId => disputeId
    
    uint256 public constant ARBITRATION_FEE = 0.01 ether;
    uint256 public constant DISPUTE_TIMEOUT = 7 days;
    
    event JobCreated(uint256 indexed jobId, address indexed client, string title, uint256 budget, uint256 stakeAmount);
    event JobAssigned(uint256 indexed jobId, address indexed freelancer);
    event JobCompleted(uint256 indexed jobId);
    event JobCancelled(uint256 indexed jobId);
    event TaskCreated(uint256 indexed jobId, uint256 indexed taskId, string description, uint256 amount);
    event TaskStarted(uint256 indexed taskId);
    event TaskCompleted(uint256 indexed taskId);
    event TaskDisputed(uint256 indexed taskId, uint256 indexed disputeId);
    event DisputeResolved(uint256 indexed disputeId, DisputeOutcome outcome);
    event PaymentReleased(uint256 indexed taskId, address indexed to, uint256 amount);
    event ArbitratorAdded(address indexed arbitrator);
    event ArbitratorRemoved(address indexed arbitrator);
    
    modifier onlyClient(uint256 _jobId) {
        require(jobs[_jobId].client == msg.sender, "Only the client can perform this action");
        _;
    }
    
    modifier onlyFreelancer(uint256 _jobId) {
        require(jobs[_jobId].freelancer == msg.sender, "Only the freelancer can perform this action");
        _;
    }
    
    modifier jobExists(uint256 _jobId) {
        require(_jobId > 0 && _jobId <= jobCounter, "Job does not exist");
        _;
    }
    
    modifier taskExists(uint256 _taskId) {
        require(_taskId > 0 && _taskId <= taskCounter, "Task does not exist");
        _;
    }
    
    modifier disputeExists(uint256 _disputeId) {
        require(_disputeId > 0 && _disputeId <= disputeCounter, "Dispute does not exist");
        _;
    }
    
    modifier onlyArbitrator() {
        require(arbitrators[msg.sender], "Only arbitrators can perform this action");
        _;
    }
    
    constructor() {
        arbitrators[msg.sender] = true;
    }

    // ============ JOB FUNCTIONS ============
    
    function createJob(string memory _title, string memory _description, uint256 _stakeAmount) external payable {
        require(msg.value > _stakeAmount, "Budget must be greater than stake amount");
        
        jobCounter++;
        uint256 jobId = jobCounter;
        
        jobs[jobId] = Job({
            id: jobId,
            client: payable(msg.sender),
            freelancer: payable(address(0)),
            title: _title,
            description: _description,
            budget: msg.value - _stakeAmount,
            stakeAmount: _stakeAmount,
            createdAt: block.timestamp,
            status: JobStatus.Open,
            taskIds: new uint256[](0)
        });
        
        clientJobs[msg.sender].push(jobId);
        emit JobCreated(jobId, msg.sender, _title, msg.value - _stakeAmount, _stakeAmount);
    }
    
    function applyForJob(uint256 _jobId) external payable jobExists(_jobId) {
        Job storage job = jobs[_jobId];
        
        require(job.status == JobStatus.Open, "Job is not open for applications");
        require(msg.sender != job.client, "Client cannot apply for own job");
        require(msg.value >= job.stakeAmount, "Insufficient stake amount");
        
        job.freelancer = payable(msg.sender);
        job.status = JobStatus.Assigned;
        freelancerJobs[msg.sender].push(_jobId);
        
        emit JobAssigned(_jobId, msg.sender);
    }
    
    function completeJob(uint256 _jobId) external jobExists(_jobId) onlyClient(_jobId) {
        Job storage job = jobs[_jobId];
        
        require(job.status == JobStatus.Assigned || job.status == JobStatus.Disputed, 
            "Job must be in assigned or disputed state");
        
        bool allTasksFinalized = true;
        for (uint i = 0; i < job.taskIds.length; i++) {
            TaskStatus status = tasks[job.taskIds[i]].status;
            if (status != TaskStatus.Completed && status != TaskStatus.Resolved) {
                allTasksFinalized = false;
                break;
            }
        }
        
        require(allTasksFinalized, "All tasks must be completed or resolved");
        
        job.status = JobStatus.Completed;
        
        job.client.transfer(job.stakeAmount);
        job.freelancer.transfer(job.stakeAmount);
        
        if (job.budget > 0) {
            job.client.transfer(job.budget);
        }
        
        emit JobCompleted(_jobId);
    }
    
    function cancelJob(uint256 _jobId) external jobExists(_jobId) onlyClient(_jobId) {
        Job storage job = jobs[_jobId];
        
        require(job.status == JobStatus.Open, "Job must be in open state to cancel");
        job.status = JobStatus.Cancelled;
        job.client.transfer(job.budget + job.stakeAmount);
        
        emit JobCancelled(_jobId);
    }

    // ============ TASK FUNCTIONS ============
    
    function createTask(uint256 _jobId, string memory _description, uint256 _amount, uint256 _deadline) 
        external 
        jobExists(_jobId) 
        onlyClient(_jobId) 
    {
        Job storage job = jobs[_jobId];
        
        require(job.status == JobStatus.Assigned, "Job must be assigned to create tasks");
        require(_amount <= job.budget, "Task amount exceeds job budget");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        
        taskCounter++;
        uint256 taskId = taskCounter;
        
        tasks[taskId] = Task({
            id: taskId,
            jobId: _jobId,
            description: _description,
            amount: _amount,
            deadline: _deadline,
            status: TaskStatus.Pending,
            clientApproved: false,
            freelancerApproved: false
        });
        
        job.taskIds.push(taskId);
        job.budget -= _amount;
        
        emit TaskCreated(_jobId, taskId, _description, _amount);
    }
    
    function startTask(uint256 _taskId) external taskExists(_taskId) {
        Task storage task = tasks[_taskId];
        Job storage job = jobs[task.jobId];
        
        require(msg.sender == job.freelancer, "Only the assigned freelancer can start the task");
        require(task.status == TaskStatus.Pending, "Task is not in pending state");
        
        task.status = TaskStatus.InProgress;
        emit TaskStarted(_taskId);
    }
    
    function completeTask(uint256 _taskId) external taskExists(_taskId) {
        Task storage task = tasks[_taskId];
        Job storage job = jobs[task.jobId];
        
        require(msg.sender == job.freelancer, "Only the assigned freelancer can complete the task");
        require(task.status == TaskStatus.InProgress, "Task must be in progress");
        
        task.status = TaskStatus.Completed;
        task.freelancerApproved = true;
        
        emit TaskCompleted(_taskId);
        
        if (task.clientApproved) {
            _releasePayment(task.id);
        }
    }
    
    function approveTask(uint256 _taskId) external taskExists(_taskId) {
        Task storage task = tasks[_taskId];
        Job storage job = jobs[task.jobId];
        
        require(msg.sender == job.client, "Only the client can approve the task");
        require(task.status == TaskStatus.Completed || task.status == TaskStatus.InProgress, 
            "Task must be completed or in progress");
        
        task.clientApproved = true;
        
        if (task.freelancerApproved) {
            _releasePayment(task.id);
        }
    }

    // ============ DISPUTE FUNCTIONS ============
    
    function raiseDispute(uint256 _taskId, string memory _reason) 
        external 
        payable 
        taskExists(_taskId) 
    {
        Task storage task = tasks[_taskId];
        Job storage job = jobs[task.jobId];
        
        require(msg.sender == job.client || msg.sender == job.freelancer, 
            "Only client or freelancer can raise dispute");
        require(task.status == TaskStatus.InProgress || task.status == TaskStatus.Completed, 
            "Task must be in progress or completed");
        require(msg.value >= ARBITRATION_FEE, "Insufficient arbitration fee");
        
        disputeCounter++;
        uint256 disputeId = disputeCounter;
        
        disputes[disputeId] = Dispute({
            id: disputeId,
            taskId: _taskId,
            initiator: msg.sender,
            reason: _reason,
            createdAt: block.timestamp,
            outcome: DisputeOutcome.Pending,
            arbitrator: address(0),
            arbitratorFee: ARBITRATION_FEE,
            isResolved: false
        });
        
        taskToDispute[_taskId] = disputeId;
        task.status = TaskStatus.Disputed;
        job.status = JobStatus.Disputed;
        
        emit TaskDisputed(_taskId, disputeId);
    }
    
    function assignArbitrator(uint256 _disputeId) 
        external 
        onlyArbitrator 
        disputeExists(_disputeId) 
    {
        Dispute storage dispute = disputes[_disputeId];
        require(dispute.arbitrator == address(0), "Arbitrator already assigned");
        
        dispute.arbitrator = msg.sender;
        payable(msg.sender).transfer(dispute.arbitratorFee);
    }
    
    function resolveDispute(
        uint256 _disputeId, 
        DisputeOutcome _outcome,
        uint256 _clientSharePercent
    ) 
        public 
        onlyArbitrator 
        disputeExists(_disputeId) 
    {
        Dispute storage dispute = disputes[_disputeId];
        require(dispute.arbitrator == msg.sender, "Only assigned arbitrator can resolve");
        require(!dispute.isResolved, "Dispute already resolved");
        require(_outcome != DisputeOutcome.Pending, "Invalid outcome");
        
        Task storage task = tasks[dispute.taskId];
        Job storage job = jobs[task.jobId];
        
        dispute.outcome = _outcome;
        dispute.isResolved = true;
        task.status = TaskStatus.Resolved;
        job.status = JobStatus.Assigned;
        
        if (_outcome == DisputeOutcome.ClientWins) {
            job.client.transfer(task.amount);
        } 
        else if (_outcome == DisputeOutcome.FreelancerWins) {
            job.freelancer.transfer(task.amount);
        }
        else if (_outcome == DisputeOutcome.Split) {
            require(_clientSharePercent <= 100, "Invalid percentage");
            uint256 clientShare = (task.amount * _clientSharePercent) / 100;
            uint256 freelancerShare = task.amount - clientShare;
            
            job.client.transfer(clientShare);
            job.freelancer.transfer(freelancerShare);
        }
        
        emit DisputeResolved(_disputeId, _outcome);
    }
    
    function timeoutDisputeResolution(uint256 _disputeId) 
        external 
        disputeExists(_disputeId) 
    {
        Dispute storage dispute = disputes[_disputeId];
        require(!dispute.isResolved, "Dispute already resolved");
        require(block.timestamp > dispute.createdAt + DISPUTE_TIMEOUT, "Timeout not reached");
        
        resolveDispute(_disputeId, DisputeOutcome.Split, 50);
    }
    
    function slashStake(uint256 _jobId) 
        external 
        onlyArbitrator 
        jobExists(_jobId) 
    {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Disputed, "Job must be in disputed state");
        
        uint256[] memory taskIds = job.taskIds;
        uint256 disputeId;
        
        for (uint i = 0; i < taskIds.length; i++) {
            if (tasks[taskIds[i]].status == TaskStatus.Disputed) {
                disputeId = taskToDispute[taskIds[i]];
                break;
            }
        }
        
        require(disputeId != 0, "No active dispute found");
        Dispute storage dispute = disputes[disputeId];
        
        if (dispute.initiator == job.client) {
            job.freelancer.transfer(job.stakeAmount / 2);
            job.client.transfer(job.stakeAmount + (job.stakeAmount / 2));
        } else {
            job.client.transfer(job.stakeAmount / 2);
            job.freelancer.transfer(job.stakeAmount + (job.stakeAmount / 2));
        }
    }

    // ============ VIEW FUNCTIONS ============
    
    function getJob(uint256 _jobId) external view jobExists(_jobId) returns (
        uint256, address, address, string memory, string memory, uint256, uint256, uint256, JobStatus, uint256[] memory
    ) {
        Job storage job = jobs[_jobId];
        return (
            job.id,
            job.client,
            job.freelancer,
            job.title,
            job.description,
            job.budget,
            job.stakeAmount,
            job.createdAt,
            job.status,
            job.taskIds
        );
    }
    
    function getTask(uint256 _taskId) external view taskExists(_taskId) returns (
        uint256, uint256, string memory, uint256, uint256, TaskStatus, bool, bool
    ) {
        Task storage task = tasks[_taskId];
        return (
            task.id,
            task.jobId,
            task.description,
            task.amount,
            task.deadline,
            task.status,
            task.clientApproved,
            task.freelancerApproved
        );
    }
    
    function getDispute(uint256 _disputeId) external view disputeExists(_disputeId) returns (
        uint256, uint256, address, string memory, uint256, DisputeOutcome, address, uint256, bool
    ) {
        Dispute storage dispute = disputes[_disputeId];
        return (
            dispute.id,
            dispute.taskId,
            dispute.initiator,
            dispute.reason,
            dispute.createdAt,
            dispute.outcome,
            dispute.arbitrator,
            dispute.arbitratorFee,
            dispute.isResolved
        );
    }
    
    function getClientJobs(address _client) external view returns (uint256[] memory) {
        return clientJobs[_client];
    }
    
    function getFreelancerJobs(address _freelancer) external view returns (uint256[] memory) {
        return freelancerJobs[_freelancer];
    }
    
    function getJobTasks(uint256 _jobId) external view jobExists(_jobId) returns (uint256[] memory) {
        return jobs[_jobId].taskIds;
    }

    // ============ INTERNAL FUNCTIONS ============
    
    function _releasePayment(uint256 _taskId) internal {
        Task storage task = tasks[_taskId];
        Job storage job = jobs[task.jobId];
        
        require(task.clientApproved && task.freelancerApproved, "Both parties must approve");
        
        if (task.status != TaskStatus.Completed) {
            task.status = TaskStatus.Completed;
            emit TaskCompleted(_taskId);
        }
        
        job.freelancer.transfer(task.amount);
        emit PaymentReleased(_taskId, job.freelancer, task.amount);
    }
    
    function addArbitrator(address _arbitrator) external onlyArbitrator {
        require(!arbitrators[_arbitrator], "Address is already an arbitrator");
        arbitrators[_arbitrator] = true;
        emit ArbitratorAdded(_arbitrator);
    }
    
    function removeArbitrator(address _arbitrator) external onlyArbitrator {
        require(arbitrators[_arbitrator], "Address is not an arbitrator");
        arbitrators[_arbitrator] = false;
        emit ArbitratorRemoved(_arbitrator);
    }
}