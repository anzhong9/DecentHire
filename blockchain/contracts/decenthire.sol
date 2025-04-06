// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract DecentHire {
    struct Proposal {
        string description;
        uint256 amount;
        bool isAccepted;
        bool isRejected;
    }

    struct Project {
        address owner;
        string title;
        string description;
        uint256 budget;
        uint256 deadline;
        string image;
        address freelancer;
        string[] updates;
        bool isApproved;
        address[] proposals;
        bool status;
        mapping(address => Proposal) proposalMap;
    }

    struct ProjectData {
        address owner;
        string title;
        string description;
        uint256 budget;
        uint256 deadline;
        string image;
        address freelancer;
        string[] updates;
        bool isApproved;
        address[] proposals;
        bool status;
    }

    mapping(uint256 => Project) private projects;
    uint256 public numberOfProjects = 0;

    event ProjectPosted(uint256 indexed projectId, address indexed owner);
    event ProposalSubmitted(uint256 indexed projectId, address indexed proposer);
    event ProposalApproved(uint256 indexed projectId, address indexed freelancer);
    event ProposalRejected(uint256 indexed projectId, address indexed freelancer);
    event PaymentSent(uint256 indexed projectId, address indexed freelancer, uint256 amount);
    event UpdateAdded(uint256 indexed projectId, string update);

    function postProject(
        string memory _title,
        string memory _description,
        uint256 _budget,
        uint256 _deadline,
        string memory _image
    ) external returns (uint256) {
        Project storage project = projects[numberOfProjects];
        project.owner = msg.sender;
        project.title = _title;
        project.description = _description;
        project.budget = _budget;
        project.deadline = _deadline;
        project.image = _image;
        project.isApproved = false;
        project.status = false;

        emit ProjectPosted(numberOfProjects, msg.sender);
        numberOfProjects++;
        return numberOfProjects - 1;
    }

    function postProposal(
        uint256 _projectId,
        string memory _description,
        uint256 _amount
    ) external {
        require(_projectId < numberOfProjects, "Invalid project ID");
        Project storage project = projects[_projectId];
        require(msg.sender != project.owner, "Owner cannot propose");
        require(!project.isApproved, "Already approved");

        Proposal storage proposal = project.proposalMap[msg.sender];
        require(!proposal.isAccepted, "Already accepted");

        proposal.description = _description;
        proposal.amount = _amount;
        proposal.isAccepted = false;
        proposal.isRejected = false;

        project.proposals.push(msg.sender);
        emit ProposalSubmitted(_projectId, msg.sender);
    }

    function approveProposal(uint256 _projectId, address _proposalOwner) external {
        require(_projectId < numberOfProjects, "Invalid project ID");
        Project storage project = projects[_projectId];
        require(msg.sender == project.owner, "Not project owner");

        Proposal storage proposal = project.proposalMap[_proposalOwner];
        require(!proposal.isAccepted, "Already accepted");

        project.freelancer = _proposalOwner;
        project.budget = proposal.amount;
        project.isApproved = true;
        proposal.isAccepted = true;

        emit ProposalApproved(_projectId, _proposalOwner);
    }

    function rejectProposal(uint256 _projectId, address _proposalOwner) external {
        require(_projectId < numberOfProjects, "Invalid project ID");
        Project storage project = projects[_projectId];
        require(msg.sender == project.owner, "Not project owner");

        Proposal storage proposal = project.proposalMap[_proposalOwner];
        proposal.isRejected = true;

        emit ProposalRejected(_projectId, _proposalOwner);
    }

    function acceptProject(uint256 _projectId) external payable {
        require(_projectId < numberOfProjects, "Invalid project ID");
        Project storage project = projects[_projectId];
        require(project.isApproved, "Not approved");

        Proposal storage proposal = project.proposalMap[project.freelancer];
        require(proposal.isAccepted, "Proposal not accepted");

        require(msg.value == proposal.amount, "Incorrect payment amount");

        (bool sent, ) = payable(project.freelancer).call{value: msg.value}("");
        require(sent, "Payment failed");

        project.status = true;

        emit PaymentSent(_projectId, project.freelancer, msg.value);
    }

    function addUpdate(uint256 _projectId, string memory _update) external {
        require(_projectId < numberOfProjects, "Invalid project ID");
        Project storage project = projects[_projectId];
        require(msg.sender == project.freelancer, "Only freelancer can update");

        project.updates.push(_update);
        emit UpdateAdded(_projectId, _update);
    }

    function getUpdates(uint256 _projectId) external view returns (string[] memory) {
        require(_projectId < numberOfProjects, "Invalid project ID");
        return projects[_projectId].updates;
    }

    function getProjects() external view returns (ProjectData[] memory) {
        ProjectData[] memory allProjects = new ProjectData[](numberOfProjects);
        for (uint256 i = 0; i < numberOfProjects; i++) {
            Project storage p = projects[i];
            allProjects[i] = ProjectData(
                p.owner,
                p.title,
                p.description,
                p.budget,
                p.deadline,
                p.image,
                p.freelancer,
                p.updates,
                p.isApproved,
                p.proposals,
                p.status
            );
        }
        return allProjects;
    }

    function getProposals(uint256 _projectId) external view returns (Proposal[] memory) {
        require(_projectId < numberOfProjects, "Invalid project ID");
        Project storage project = projects[_projectId];
        Proposal[] memory proposals = new Proposal[](project.proposals.length);
        for (uint256 i = 0; i < project.proposals.length; i++) {
            proposals[i] = project.proposalMap[project.proposals[i]];
        }
        return proposals;
    }
}
