import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  // Static milestone data for simulation
  const staticMilestones = [
    {
      id: 1,
      jobId: 1,
      description: 'Initial UI Design',
      amount: ethers.parseUnits('1', 'ether'),
      status: 0,
    },
    {
      id: 2,
      jobId: 1,
      description: 'Backend API Integration',
      amount: ethers.parseUnits('2', 'ether'),
      status: 1,
    },
    {
      id: 3,
      jobId: 2,
      description: 'Smart Contract Logic',
      amount: ethers.parseUnits('3', 'ether'),
      status: 0,
    },
  ];

  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    // Filter milestones for this job
    const jobMilestones = staticMilestones.filter(
      (milestone) => milestone.jobId === job.id
    );
    setMilestones(jobMilestones);
  }, [job.id]);

  return (
    <div
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="cursor-pointer bg-[#2a2a2a] p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col "
    >
      <h2 className="text-xl text-white font-semibold">{job.title}</h2>
      <p className="text-gray-400 mb-4">{job.description}</p>

    <div className='flex flex-col h-full justify-between' >

      <h3 className="text-lg text-white mb-2">Milestones</h3>
      {milestones.length === 0 ? (
          <p className="text-gray-400">No milestones yet for this job.</p>
      ) : (
        milestones.map((milestone) => (
          <div
            key={milestone.id}
            className="bg-[#1e1e1e] p-3 rounded mb-2 text-sm"
          >
            <p className="text-white">
              <strong>Description:</strong> {milestone.description}
            </p>
            <p className="text-white">
              <strong>Amount:</strong>{' '}
              {ethers.formatUnits(milestone.amount, 'ether')} ETH
            </p>
            <p
              className={`${
                milestone.status === 1 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              Status: {milestone.status === 1 ? 'Paid' : 'Pending'}
            </p>
          </div>
        ))
    )}
      <p className='text-pink-500 mt-4'> 
      {job.status}</p>
    </div>
    </div>
  );
};

export default JobCard;
