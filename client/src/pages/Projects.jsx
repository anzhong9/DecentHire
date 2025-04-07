import React, { useState, useEffect } from 'react';
import DisplayProjects from '../components/DisplayProjects';
import { useStateContext } from '../context/stateContext';

const Projects = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const { address, getProjects, decentHire } = useStateContext();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const data = await getProjects();
      setProjects(data);
      setIsLoading(false);
    };

    if (decentHire) fetchProjects();
  }, [address, decentHire]);

  console.log('Projects:', projects);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <DisplayProjects title="All Projects" isLoading={isLoading} projects={projects} />
    </div>
  );
};

export default Projects;
