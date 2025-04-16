import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import staticJobs from '../context/staticJobs.json';

const MyJob = () => {
  const { id } = useParams(); // Get the job ID from the URL params
  const [job, setJob] = useState(null);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    // Log the job ID and check for debugging
    console.log('Job ID from URL:', id);

    // Find job from staticJobs based on the ID from URL
    const foundJob = staticJobs.find((j) => j.id.toString() === id);
    console.log('Found Job:', foundJob); // Debugging

    if (foundJob) {
      setJob(foundJob);
      const updatedMilestones = (foundJob.milestones || []).map((m) => ({
        ...m,
        requested: false, // initially, no request
        status: m.status || 0
      }));
      setMilestones(updatedMilestones);
    } else {
      console.error(`Job with id ${id} not found.`);
    }
  }, [id]);

  const handleRequestCompletion = (milestoneId) => {
    setMilestones((prev) => {
      const updated = prev.map((m) =>
        m.id === milestoneId ? { ...m, requested: true } : m
      );
  
      // Save to localStorage for sync
      localStorage.setItem('milestoneStatus', JSON.stringify(updated));
      console.log('Milestone requested:', milestoneId);
      return updated;
    });
  };
  

  // Check if job is null and handle gracefully
  if (!job) {
    return <p className="text-white p-6">Job not found with ID: {id}</p>;
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
      <h2 className="text-3xl font-bold mb-2">Your Accepted Job: {job.title}</h2>
      <p className="text-lg">{job.description}</p>
      <p className="mt-4 text-pink-500">Budget: {job.budget} ETH</p>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold mb-2">Milestones</h3>
        {milestones.length === 0 ? (
          <p>No milestones defined.</p>
        ) : (
          milestones.map((m) => (
            <div key={m.id} className="bg-[#2a2a2a] p-4 rounded mb-2">
              <p><strong>Description:</strong> {m.description}</p>
              <p><strong>Amount:</strong> {ethers.formatUnits(m.amount, 'ether')} ETH</p>
              <p className={`${m.status === 1 ? 'text-green-400' : 'text-red-400'}`}>
                Status: {m.status === 1 ? 'Paid' : 'Pending'}
              </p>

              {m.status === 0 && !m.requested && (
                <button
                  className="mt-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-1 px-3 rounded"
                  onClick={() => handleRequestCompletion(m.id)}
                >
                  Request Completion
                </button>
              )}

              {m.status === 0 && m.requested && (
                <p className="text-blue-400 mt-2">Completion Requested</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyJob;