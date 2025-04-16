import React from 'react';

const AcceptJob = ({ jobId, acceptJob }) => {
  const handleAccept = async () => {
    try {
      await acceptJob(jobId);
      alert('Job accepted successfully!');
    } catch (err) {
      console.error('Failed to accept job:', err);
      alert('Failed to accept job.');
    }
  };

  return (
    <button
      onClick={handleAccept}
      className="bg-green-600 text-white py-2 px-4 rounded"
    >
      Accept Job
    </button>
  );
};

export default AcceptJob;
