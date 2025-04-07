import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';

const DisplayProjects = ({ title, isLoading, projects }) => {
  const navigate = useNavigate();

  const handleNavigate = (project) => {
    // Save full project data to localStorage to avoid relying on location.state
    localStorage.setItem(`project-${project.pId}`, JSON.stringify(project));
    navigate(`/projectdetails/${project.pId}`);
  };

  return (
    <div className="px-8 py-10">
      <h1 className="text-white text-2xl font-semibold mb-6">
        {title} ({projects.length})
      </h1>

      {isLoading ? (
        <p className="text-[#aaa]">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-[#aaa]">No projects yet!</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {projects.map((project) => (
            <Card
              key={project.pId}
              {...project}
              handleClick={() => handleNavigate(project)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayProjects;
