// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract SimpleJobContract {
    enum JobStatus { Open, Assigned, Completed }
    
    struct Job {
        uint256 id;
        address client;
        address freelancer;
        string title;
        uint256 budget;
        JobStatus status;
    }
    
    uint256 public jobCounter;
    mapping(uint256 => Job) public jobs;
    
    event JobCreated(uint256 indexed jobId, address indexed client);
    event JobAssigned(uint256 indexed jobId, address indexed freelancer);
    
    function createJob(string memory _title) external payable {
        require(msg.value > 0, "Need to fund the job");
        
        jobCounter++;
        jobs[jobCounter] = Job({
            id: jobCounter,
            client: msg.sender,
            freelancer: address(0),
            title: _title,
            budget: msg.value,
            status: JobStatus.Open
        });
        
        emit JobCreated(jobCounter, msg.sender);
    }
    
    function assignJob(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Open, "Job not available");
        require(msg.sender != job.client, "Client can't be freelancer");
        
        job.freelancer = msg.sender;
        job.status = JobStatus.Assigned;
        emit JobAssigned(_jobId, msg.sender);
    }
    
    function completeJob(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Assigned, "Job not in progress");
        require(msg.sender == job.client, "Only client can complete");
        
        job.status = JobStatus.Completed;
        payable(job.freelancer).transfer(job.budget);
    }
}