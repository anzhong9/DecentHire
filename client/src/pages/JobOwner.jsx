import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import staticJobs from '../context/staticJobs.json';

const JobOwner = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    const loadJobAndMilestones = () => {
      const foundJob = staticJobs.find((j) => j.id.toString() === id);
      if (!foundJob) {
        console.error(`Job with id ${id} not found.`);
        return;
      }

      const storedMilestoneStatus = localStorage.getItem('milestoneStatus');
      let milestonesToUse = (foundJob.milestones || []).map((m) => ({
        ...m,
        requested: false,
        status: m.status || 0,
      }));

      if (storedMilestoneStatus) {
        const stored = JSON.parse(storedMilestoneStatus);
        milestonesToUse = milestonesToUse.map((m) => {
          const match = stored.find((s) => s.id === m.id);
          return match ? { ...m, requested: match.requested, status: match.status } : m;
        });
      }

      setJob(foundJob);
      setMilestones(milestonesToUse);
      console.log('Updated milestones from localStorage:', milestonesToUse);
    };

    loadJobAndMilestones();

    // Listen for updates from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'milestoneStatus') {
        console.log('Detected milestoneStatus change via storage event.');
        loadJobAndMilestones();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [id]);

  const handleDecision = (milestoneId, accepted) => {
    const updatedMilestones = milestones.map((m) =>
      m.id === milestoneId
        ? { ...m, requested: false, status: accepted ? 1 : 0 }
        : m
    );
    setMilestones(updatedMilestones);
    localStorage.setItem('milestoneStatus', JSON.stringify(updatedMilestones));
  };

  if (!job) {
    return <p className="text-white p-6">Job not found with ID: {id}</p>;
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
      <h2 className="text-3xl font-bold mb-2">Owner View: {job.title}</h2>
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
                Status: {m.status === 1 ? 'Approved' : 'Pending'}
              </p>

              {m.status === 0 && m.requested && (
                <div className="flex gap-2 mt-3">
                  <button
                    className="bg-green-500 hover:bg-green-400 text-white px-4 py-1 rounded"
                    onClick={() => handleDecision(m.id, true)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-400 text-white px-4 py-1 rounded"
                    onClick={() => handleDecision(m.id, false)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobOwner;
