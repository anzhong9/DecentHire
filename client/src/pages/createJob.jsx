// import React, { useState } from 'react';
// import { useStateContext } from '../context/stateContext';
// import { ethers } from 'ethers';

// const CreateJob = () => {
//   const { createJob, createMilestone } = useStateContext();
//   const [title, setTitle] = useState('');
//   const [reward, setReward] = useState('');
//   const [milestoneDescription, setMilestoneDescription] = useState('');
//   const [milestoneAmount, setMilestoneAmount] = useState('');
//   const [isCreatingJob, setIsCreatingJob] = useState(false);
//   const [isCreatingMilestone, setIsCreatingMilestone] = useState(false);
//   const [jobCreated, setJobCreated] = useState(null); // Store job info after creation

//   const handleCreateJob = async () => {
//     if (!title) {
//       alert('Please provide a job title.');
//       return;
//     }
//     if (!reward || isNaN(reward) || parseFloat(reward) <= 0) {
//       alert('Please provide a valid job funding amount (in ETH).');
//       return;
//     }

//     try {
//       setIsCreatingJob(true);

//       // Call createJob function from context (this only requires title and reward)
//       const tx = await createJob(title, reward);

//       if (!tx) {
//         console.error('Transaction not found.');
//         return;
//       }

//       // Wait for the transaction to be mined
//       await tx.wait();

//       setIsCreatingJob(false);

//       // After the job is created, you can access job details (you can extend this with the jobId if needed)
//       setJobCreated({ title, reward });

//       alert('Job created successfully!');
//     } catch (err) {
//       console.error('Error creating job:', err);
//       setIsCreatingJob(false);
//       alert('An error occurred while creating the job. Please check the console for details.');
//     }
//   };

//   const handleCreateMilestone = async () => {
//     if (!milestoneDescription || !milestoneAmount) {
//       alert('Please provide both milestone description and reward amount.');
//       return;
//     }

//     if (isNaN(milestoneAmount) || parseFloat(milestoneAmount) <= 0) {
//       alert('Please provide a valid milestone reward (in ETH).');
//       return;
//     }

//     try {
//       setIsCreatingMilestone(true);

//       // Call createMilestone function (this requires jobId, description, and milestone amount)
//       const tx = await createMilestone(
//         jobCreated.jobId,
//         milestoneDescription,
//         ethers.utils.parseUnits(milestoneAmount, 'ether')
//       );

//       if (!tx) {
//         console.error('Transaction not found.');
//         return;
//       }

//       // Wait for the milestone transaction to be mined
//       await tx.wait();

//       setIsCreatingMilestone(false);
//       alert('Milestone created successfully!');
//     } catch (err) {
//       console.error('Error creating milestone:', err);
//       setIsCreatingMilestone(false);
//       alert('An error occurred while creating the milestone. Please check the console for details.');
//     }
//   };

//   return (
//     <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
//       <h2 className="text-2xl text-white">Create Job</h2>
//       <div className="mt-4">
//         <input
//           type="text"
//           placeholder="Job Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full p-3 bg-[#1a1a1a] text-white rounded mb-4"
//         />
//         <input
//           type="number"
//           placeholder="Job Funding (ETH)"
//           value={reward}
//           onChange={(e) => setReward(e.target.value)}
//           className="w-full p-3 bg-[#1a1a1a] text-white rounded mb-4"
//         />
//         <button
//           className="bg-blue-500 text-white px-6 py-2 rounded"
//           onClick={handleCreateJob}
//           disabled={isCreatingJob}
//         >
//           {isCreatingJob ? 'Creating Job...' : 'Create Job'}
//         </button>
//       </div>

//       {jobCreated && (
//         <div className="mt-6">
//           <h3 className="text-xl text-white">Create Milestone</h3>
//           <div className="mt-4">
//             <textarea
//               placeholder="Milestone Description"
//               value={milestoneDescription}
//               onChange={(e) => setMilestoneDescription(e.target.value)}
//               className="w-full p-3 bg-[#1a1a1a] text-white rounded mb-4"
//             />
//             <input
//               type="number"
//               placeholder="Milestone Reward (ETH)"
//               value={milestoneAmount}
//               onChange={(e) => setMilestoneAmount(e.target.value)}
//               className="w-full p-3 bg-[#1a1a1a] text-white rounded mb-4"
//             />
//             <button
//               className="bg-green-500 text-white px-6 py-2 rounded"
//               onClick={handleCreateMilestone}
//               disabled={isCreatingMilestone}
//             >
//               {isCreatingMilestone ? 'Creating Milestone...' : 'Create Milestone'}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateJob;

import React, { useState } from 'react';
import { ethers } from 'ethers';

const CreateJob = () => {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState('');
  const [reward, setReward] = useState('');
  const [milestoneDescription, setMilestoneDescription] = useState('');
  const [milestoneAmount, setMilestoneAmount] = useState('');
  const [jobCreated, setJobCreated] = useState(null); // Currently created job

  const handleCreateJob = () => {
    if (!title) {
      alert('Please provide a job title.');
      return;
    }

    if (!reward || isNaN(reward) || parseFloat(reward) <= 0) {
      alert('Please provide a valid job funding amount (in ETH).');
      return;
    }

    const newJob = {
      id: Date.now(), // fake jobId
      title,
      budget: reward,
      description: 'Job created locally.',
      owner: '0xFakeOwnerAddress',
      milestones: []
    };

    setJobs((prev) => [...prev, newJob]);
    setJobCreated(newJob);

    alert('Job created successfully!');
  };

  const handleCreateMilestone = () => {
    if (!milestoneDescription || !milestoneAmount) {
      alert('Please provide both milestone description and reward amount.');
      return;
    }

    if (isNaN(milestoneAmount) || parseFloat(milestoneAmount) <= 0) {
      alert('Please provide a valid milestone reward (in ETH).');
      return;
    }

    const newMilestone = {
      id: Date.now(),
      description: milestoneDescription,
      amount: ethers.parseUnits(milestoneAmount, 'ether').toString(),
      status: 0
    };

    const updatedJob = {
      ...jobCreated,
      milestones: [...jobCreated.milestones, newMilestone]
    };

    setJobCreated(updatedJob);
    setJobs((prev) =>
      prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );

    setMilestoneDescription('');
    setMilestoneAmount('');
    alert('Milestone added!');
  };

  const handleResetForm = () => {
    setTitle('');
    setReward('');
    setMilestoneDescription('');
    setMilestoneAmount('');
    setJobCreated(null);
  };

  return (
    <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl text-white mb-4">Create Job (Static)</h2>

      <input
        type="text"
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 bg-[#1a1a1a] text-white rounded mb-4"
      />
      <input
        type="number"
        placeholder="Job Funding (ETH)"
        value={reward}
        onChange={(e) => setReward(e.target.value)}
        className="w-full p-3 bg-[#1a1a1a] text-white rounded mb-4"
      />
      {!jobCreated && (
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded mb-6"
          onClick={handleCreateJob}
        >
          Create Job
        </button>
      )}

      {/* Milestone Creation */}
      {jobCreated && (
        <div>
          <h3 className="text-xl text-white mb-2">Add Milestone to "{jobCreated.title}"</h3>
          <textarea
            placeholder="Milestone Description"
            value={milestoneDescription}
            onChange={(e) => setMilestoneDescription(e.target.value)}
            className="w-full p-3 bg-[#1a1a1a] text-white rounded mb-4"
          />
          <input
            type="number"
            placeholder="Milestone Reward (ETH)"
            value={milestoneAmount}
            onChange={(e) => setMilestoneAmount(e.target.value)}
            className="w-full p-3 bg-[#1a1a1a] text-white rounded mb-4"
          />
          <button
            className="bg-green-500 text-white px-6 py-2 rounded mr-3"
            onClick={handleCreateMilestone}
          >
            Add Milestone
          </button>

          <button
            className="bg-gray-500 text-white px-6 py-2 rounded mt-4"
            onClick={handleResetForm}
          >
            Create Another Job
          </button>

          {/* Milestone List */}
          {jobCreated.milestones.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg text-white mb-2">Milestones:</h4>
              {jobCreated.milestones.map((m) => (
                <div
                  key={m.id}
                  className="bg-[#1a1a1a] text-white p-3 rounded mb-2"
                >
                  <p>Description: {m.description}</p>
                  <p>Amount: {ethers.formatUnits(m.amount, 'ether')} ETH</p>
                  <p>Status: {m.status === 0 ? 'Pending' : 'Paid'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateJob;
