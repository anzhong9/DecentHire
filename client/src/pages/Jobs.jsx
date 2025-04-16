import React, { useState, useEffect } from 'react';
import DisplayJobs from '../components/DisplayJobs'; // Assuming this is the component that displays the job list

const Jobs = () => {
  // Simulate static data for jobs
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

  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = () => {
      setIsLoading(true);
      // Here we're using the static data instead of fetching from a contract
      setJobs(staticJobs);
      setIsLoading(false);
    };

    fetchJobs(); // Fetch jobs immediately on mount
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <DisplayJobs title="Available Jobs" isLoading={isLoading} jobs={jobs} />
    </div>
  );
};

export default Jobs;
