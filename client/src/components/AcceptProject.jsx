import React, { useState } from 'react';
import { useStateContext } from '../context/stateContext';
import Loader from './Loader';

const AcceptProject = () => {
  const { acceptProject, contract } = useStateContext();
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    try {
      setLoading(true);
      // Accept the current project. Logic assumes current project context is already stored globally or passed down.
      await acceptProject();
    } catch (err) {
      console.error('Failed to accept project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAccept}
      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      disabled={loading}
    >
      {loading ? <Loader /> : 'Accept Project'}
    </button>
  );
};

export default AcceptProject;
