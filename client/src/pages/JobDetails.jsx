import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import staticJobs from '../context/staticJobs.json';
import { useStateContext } from '../context/stateContext';
const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simulated wallet address (replace with actual wallet logic if needed)
  const address = useStateContext((state) => state.address);

  useEffect(() => {
    setLoading(true);

    const foundJob = staticJobs.find((j) => j.id.toString() === id);
    setJob(foundJob);

    setLoading(false);
  }, [id]);

    const handleAccept = () => {
        if (!address) {
          alert("Please connect your wallet to accept the job.");
          return;
        }
      
        alert(`You have accepted job ${id} as ${address}`);
        navigate(`/myjob/${id}`);
      };

  if (loading || !job) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
      <h2 className="text-3xl font-bold mb-2">{job.title}</h2>
      <p className="text-lg">{job.description}</p>
      <p className="mt-4 text-pink-500">Budget: {job.budget} ETH</p>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold mb-2">Milestones</h3>
        {job.milestones?.length === 0 ? (
          <p>No milestones added for this job.</p>
        ) : (
          job.milestones.map((m) => (
            <div key={m.id} className="bg-[#2a2a2a] p-4 rounded mb-2">
              <p><strong>Description:</strong> {m.description}</p>
              <p><strong>Amount:</strong> {ethers.formatUnits(m.amount, 'ether')} ETH</p>
              <p className={`${m.status === 1 ? 'text-green-400' : 'text-red-400'}`}>
                Status: {m.status === 1 ? 'Paid' : 'Pending'}
              </p>
            </div>
          ))
        )}
      </div>

      {address !== job.owner && (
        <button
          onClick={handleAccept}
          className="mt-6 bg-[#CB1C8D] hover:bg-white hover:text-[#CB1C8D] text-white font-bold py-2 px-4 rounded"
        >
          Accept Job
        </button>
      )}
    </div>
  );
};

export default JobDetails;
