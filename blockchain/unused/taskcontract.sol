// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./DisputeContract.sol";

contract TaskContract {
    enum TaskStatus { Pending, InProgress, Completed, Disputed }
    
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
    
    uint256 private taskCounter;
    mapping(uint256 => Task) public tasks;
    mapping(uint256 => uint256[]) public jobTasks;
    
    DisputeContract public disputeContract;
    
    event TaskCreated(uint256 indexed jobId, uint256 indexed taskId, string description, uint256 amount);
    event TaskStarted(uint256 indexed taskId);
    event TaskCompleted(uint256 indexed taskId);
    event PaymentReleased(uint256 indexed taskId, address indexed to, uint256 amount);
    
    constructor(address _disputeContractAddress) {
        disputeContract = DisputeContract(_disputeContractAddress);
    }
    
    function createTask(uint256 _jobId, string memory _description, uint256 _amount, uint256 _deadline) external {
        // Implementation...
    }
    
    function startTask(uint256 _taskId) external {
        // Implementation...
    }
    
    function completeTask(uint256 _taskId) external {
        // Implementation...
    }
    
    function approveTask(uint256 _taskId) external {
        // Implementation...
    }
    
    function areAllTasksCompleted(uint256 _jobId) external view returns (bool) {
        uint256[] memory taskIds = jobTasks[_jobId];
        for (uint i = 0; i < taskIds.length; i++) {
            if (tasks[taskIds[i]].status != TaskStatus.Completed) {
                return false;
            }
        }
        return true;
    }
}