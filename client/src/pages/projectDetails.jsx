import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import ProposalCard from '../components/ProposalCard';
import Loader from '../components/Loader';
import AcceptProject from '../components/AcceptProject';
import { useStateContext } from '../context/stateContext';
import { daysLeft } from '../utils';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createProposal, address, getProposalsFromContract, contract } = useStateContext();

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      const data = await getProposalsFromContract(project.pId);
      setProposals(data || []);
    } catch (err) {
      console.error('Failed to fetch proposals:', err);
      setProposals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem(`project-${id}`);
    if (stored) {
      setProject(JSON.parse(stored));
    } else {
      console.error("Project not found in localStorage");
      navigate('/');
    }
  }, [id]);

  useEffect(() => {
    if (contract && project) {
      fetchProposals();
    }
  }, [address, contract, project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    try {
      setButtonLoading(true);
      const proposalData = {
        id: project.pId,
        description,
        amount: amount,
      };
      await createProposal(proposalData);
      navigate('/');
    } catch (err) {
      console.error('Failed to submit proposal:', err);
    } finally {
      setButtonLoading(false);
    }
  };

  if (!project) return <Loader />;

  const isOwner = address === project.owner;
  const isStarted = project.isAccepted;
  const statusLabel = project.isApproved
    ? project.status
      ? 'completed'
      : 'ongoing'
    : 'new';

  return (
    <div className="px-12 bg-black">
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col  gap-[30px]">
        <div className="flex-1 mt-10 flex-col">
          <img src={project.image} alt="project" className="w-full h-[310px] object-cover rounded-xl" />
        </div>
      </div>

      <div className="mt-5 flex lg:flex-row flex-col gap-5">
        {/* Left Panel */}
        <div className="flex-[2] flex flex-col gap-[30px] text-white">
          <section>
            <h4 className="font-semibold text-[18px] uppercase">Owner</h4>
            <div className="mt-5">
              <p className="break-all">{project.owner}</p>
              <p className="text-sm text-[#808191]">2 Projects</p>
              <p className="mt-2 inline-block bg-green-600 px-3 py-1 rounded-md text-sm capitalize">{statusLabel}</p>
              {isOwner && project.isApproved && <AcceptProject />}
            </div>

            {project.freelancer && (
              <div className="mt-4">
                <h5 className="text-sm text-[#999]">Assigned to:</h5>
                <p className="break-all">{project.freelancer}</p>
              </div>
            )}
          </section>

          <section>
            <h4 className="font-semibold text-[18px] uppercase">Description</h4>
            <p className="mt-4 text-[#808191] leading-[26px]">{project.description}</p>
          </section>

          <section>
            <h4 className="font-semibold text-[18px] uppercase">Budget</h4>
            <p className="mt-4 text-[#808191]">{project.budget} ETH</p>
          </section>

          <section>
            <h4 className="font-semibold text-[18px] uppercase">Proposals</h4>
            <div className="mt-4 flex flex-col gap-4">
              {proposals.length > 0 ? (
                proposals.map((item, index) => (
                  <ProposalCard
                    key={index}
                    profilePic={item}
                    description={item.description}
                    amount={item.amount}
                    owner={item.freelancer}
                    stateOwner={project.owner}
                    index={index}
                    isApproved={project.isApproved}
                    isRejected={item.isRejected}
                  />
                ))
              ) : (
                <p className="text-[#808191]">No proposals yet. Be the first!</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Panel */}
        <div className="flex-1">
          <h4 className="font-semibold text-[18px] text-white uppercase">Post Proposal</h4>
          <form
            onSubmit={handleSubmit}
            className="mt-5 flex flex-col p-4 bg-[#1c1c24] rounded-[10px] gap-4"
          >
            <textarea
              placeholder="Proposal Description"
              className="border rounded w-full p-3 text-white bg-transparent"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Amount (MATIC)"
              className="border rounded w-full p-3 text-white bg-transparent"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            {!isStarted ? (
              !isOwner ? (
                <button
                  type="submit"
                  className="bg-[#CB1C8D] hover:bg-white hover:text-[#CB1C8D] text-white font-bold py-2 px-4 rounded"
                  disabled={buttonLoading}
                >
                  {buttonLoading ? 'Submitting...' : 'Post Proposal'}
                </button>
              ) : (
                <p className="text-[#CB1C8D]">Owner can't post proposals</p>
              )
            ) : (
              <p className="text-[#CB1C8D]">Project already started</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
