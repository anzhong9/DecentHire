import React, { useState } from 'react';
import Loader from './Loader';
import { useStateContext } from '../context/stateContext';

const ProposalCard = ({ proposer, description, amount, isApproved, isRejected, projectId, index, onActionComplete }) => {
  const [loading, setLoading] = useState(false);
  const { address, contract, approveProposal, rejectProposal } = useStateContext();
  const isOwner = proposer.toLowerCase() === address.toLowerCase();

  const handleAction = async (type) => {
    if (!contract) return;
    setLoading(true);
    const action = type === 'approve' ? approveProposal : rejectProposal;
    const result = await action(projectId, index);
    setLoading(false);
    if (onActionComplete) onActionComplete();
  };

  const renderStatus = () => {
    if (isApproved) return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md">Approved</span>;
    if (isRejected) return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md">Rejected</span>;
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md">Pending</span>;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 border">
      <div className="mb-2">
        <p className="font-semibold">Proposer:</p>
        <p className="text-sm text-gray-600 break-words">{proposer}</p>
      </div>

      <div className="mb-2">
        <p className="font-semibold">Description:</p>
        <p className="text-gray-700">{description}</p>
      </div>

      <div className="mb-2">
        <p className="font-semibold">Amount:</p>
        <p className="text-gray-700">{amount} ETH</p>
      </div>

      <div className="mb-4">{renderStatus()}</div>

      {!isApproved && !isRejected && address === projectId.owner && (
        <div className="flex gap-4">
          <button
            onClick={() => handleAction('approve')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? <Loader /> : 'Approve'}
          </button>
          <button
            onClick={() => handleAction('reject')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? <Loader /> : 'Reject'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProposalCard;
