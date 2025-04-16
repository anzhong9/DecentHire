import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard'; // Assuming JobCard is a component to display individual job details
import { useNavigate } from 'react-router-dom';

const DisplayJobs = () => {
  // Static jobs data
  const staticJobs = [
    {
      id: 1,
      title: "Frontend Developer Needed",
      reward: 5,
      status: "Open",
      client: "0x1234...abcd",
      freelancer: "",
    },
    {
      id: 2,
      title: "Smart Contract Developer",
      reward: 3,
      status: "Assigned",
      client: "0x5678...efgh",
      freelancer: "0x9876...ijkl",
    },
    {
      id: 3,
      title: "UI/UX Designer for Website",
      reward: 2.5,
      status: "Completed",
      client: "0x1234...abcd",
      freelancer: "0x5678...efgh",
    },
  ];

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = () => {
      setIsLoading(true);
      // Static jobs data is now directly assigned to jobs state
      setJobs(staticJobs);
      setIsLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/createjob')}
          className="bg-pink-600 hover:bg-pink-500 text-white px-5 py-2 rounded-xl shadow-md transform transition-transform hover:scale-105"
        >
          + Create Job
        </button>
      </div>

      {isLoading ? (
        <p className="text-white text-center">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-white text-center">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayJobs;
