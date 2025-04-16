// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract SimpleMilestoneContract {
    enum MilestoneStatus { Pending, Paid }
    
    struct Milestone {
        uint256 id;
        uint256 jobId;
        string description;
        uint256 amount;
        MilestoneStatus status;
    }
    
    uint256 public milestoneCounter;
    mapping(uint256 => Milestone) public milestones;
    
    event MilestoneCreated(uint256 indexed milestoneId);
    event MilestonePaid(uint256 indexed milestoneId);
    
    function createMilestone(
        uint256 _jobId,
        string memory _description,
        uint256 _amount
    ) external {
        milestoneCounter++;
        milestones[milestoneCounter] = Milestone({
            id: milestoneCounter,
            jobId: _jobId,
            description: _description,
            amount: _amount,
            status: MilestoneStatus.Pending
        });
        
        emit MilestoneCreated(milestoneCounter);
    }
    
    function payMilestone(uint256 _milestoneId) external payable {
        Milestone storage milestone = milestones[_milestoneId];
        require(milestone.status == MilestoneStatus.Pending, "Already paid");
        require(msg.value >= milestone.amount, "Insufficient payment");
        
        milestone.status = MilestoneStatus.Paid;
        emit MilestonePaid(_milestoneId);
    }
}