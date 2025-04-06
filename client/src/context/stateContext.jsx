import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

import DecentHire from "../contracts/DecentHire.json";
import UserProfile from "../contracts/UserProfile.json";

// Replace these with your actual local contract addresses
const DECENT_HIRE_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; 
const USER_PROFILE_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"; 

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [decentHire, setDecentHire] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Connect wallet and initialize provider + signer
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAddress(accounts[0]);
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    const _signer = _provider.getSigner();
    setProvider(_provider);
    setSigner(_signer);
  };

  // Initialize contracts when signer changes
  useEffect(() => {
    if (!signer) return;
    const hire = new ethers.Contract(DECENT_HIRE_ADDRESS, DecentHire.abi, signer);
    const profile = new ethers.Contract(USER_PROFILE_ADDRESS, UserProfile.abi, signer);
    setDecentHire(hire);
    setUserProfile(profile);
  }, [signer]);

  // User Profile
  const updateProfile = async (form) => {
    try {
      const tx = await userProfile.updateUserProfile(
        form.title,
        form.description,
        form.image,
        form.mail,
        form.twitter,
        form.github
      );
      await tx.wait();
      console.log("Profile updated!");
    } catch (err) {
      console.error("updateProfile failed:", err);
    }
  };

  const getProfile = async () => {
    try {
      const profile = await userProfile.getUserProfile(address);
      console.log("Profile fetched:", profile);
      return profile;
    } catch (err) {
      console.error("getProfile failed:", err);
    }
  };

  // Projects
  const createProject = async (form) => {
    try {
      const tx = await decentHire.postProject(
        form.title,
        form.description,
        ethers.utils.parseEther(form.budget),
        new Date(form.deadline).getTime(),
        form.image
      );
      await tx.wait();
      console.log("Project created!");
    } catch (err) {
      console.error("createProject failed:", err);
    }
  };

  const getProjects = async () => {
    try {
      const projects = await decentHire.getProjects();
      return projects.map((p, i) => ({
        owner: p.owner,
        title: p.title,
        description: p.description,
        budget: ethers.utils.formatEther(p.budget),
        deadline: p.deadline.toNumber(),
        image: p.image,
        freelancer: p.freelancer,
        updates: p.updates,
        isApproved: p.isApproved,
        proposals: p.proposals,
        status: p.status,
        pId: i
      }));
    } catch (err) {
      console.error("getProjects failed:", err);
    }
  };

  // Proposals
  const createProposal = async (form) => {
    try {
      const tx = await decentHire.postProposal(
        form.id,
        form.description,
        ethers.utils.parseEther(form.amount)
      );
      await tx.wait();
      console.log("Proposal created!");
    } catch (err) {
      console.error("createProposal failed:", err);
    }
  };

  const getProposalsFromContract = async (_projectId) => {
    try {
      const proposals = await decentHire.getProposals(_projectId);
      return proposals.map((p, i) => ({
        description: p.description,
        amount: ethers.utils.formatEther(p.amount),
        isAccepted: p.isAccepted,
        isRejected: p.isRejected,
        pId: i
      }));
    } catch (err) {
      console.error("getProposals failed:", err);
    }
  };

  // Project Actions
  const approve = async (_projectId, _proposalOwner) => {
    try {
      const tx = await decentHire.approveProposal(_projectId, _proposalOwner);
      await tx.wait();
    } catch (err) {
      console.error("approveProposal failed:", err);
    }
  };

  const reject = async (_projectId, _proposalOwner) => {
    try {
      const tx = await decentHire.rejectProposal(_projectId, _proposalOwner);
      await tx.wait();
    } catch (err) {
      console.error("rejectProposal failed:", err);
    }
  };

  const acceptProject = async (_projectId, amount) => {
    try {
      const tx = await decentHire.AcceptProject(_projectId, {
        value: ethers.utils.parseEther(amount)
      });
      await tx.wait();
    } catch (err) {
      console.error("acceptProject failed:", err);
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        connectWallet,
        createProject,
        getProjects,
        updateProfile,
        getProfile,
        createProposal,
        getProposalsFromContract,
        approve,
        reject,
        acceptProject
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);