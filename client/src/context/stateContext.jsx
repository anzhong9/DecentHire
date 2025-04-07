import React, { createContext, useContext, useState, useEffect } from "react";
import {
  BrowserProvider,
  Contract,
  parseEther,
  formatEther,
  ethers,
} from "ethers";

import DecentHireAbi from "../contracts/decentHire-abi.json";
import UserProfileAbi from "../contracts/userProfile-abi.json";
import addresses from "../contracts/contract-addresses.json";

// Make sure these match your latest deployed contract addresses
const DECENT_HIRE_ADDRESS = addresses.decentHire;
const USER_PROFILE_ADDRESS = addresses.userProfile;

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [decentHire, setDecentHire] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Connect Wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const _provider = new BrowserProvider(window.ethereum);
      const _signer = await _provider.getSigner();

      setAddress(accounts[0]);
      setProvider(_provider);
      setSigner(_signer);

      console.log("[connectWallet] Connected:", accounts[0]);
    } catch (err) {
      console.error("[connectWallet] Failed:", err);
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    setAddress("");
    setProvider(null);
    setSigner(null);
    setDecentHire(null);
    setUserProfile(null);
    console.log("[disconnectWallet] Wallet disconnected");
  };

  // Initialize Contracts
  useEffect(() => {
    if (!signer) return;

    const hire = new Contract(DECENT_HIRE_ADDRESS, DecentHireAbi, signer);
    const profile = new Contract(USER_PROFILE_ADDRESS, UserProfileAbi, signer);

    setDecentHire(hire);
    setUserProfile(profile);

    console.log("[Contracts] DecentHire @", DECENT_HIRE_ADDRESS);
    console.log("[Contracts] UserProfile @", USER_PROFILE_ADDRESS);
  }, [signer]);

  // Optional sanity check
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const test = await decentHire.getProjects();
        console.log("[pingContract] getProjects call succeeded:", test.length);
      } catch (err) {
        console.error("[pingContract] Failed to fetch projects:", err);
      }
    };

    if (decentHire) {
      fetchProjects();
    }
  }, [decentHire]);

  // Profile Methods
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
      console.log("✅ Profile updated");
    } catch (err) {
      console.error("[updateProfile] Failed:", err);
    }
  };

  const getProfile = async () => {
    try {
      if (!userProfile || !address) return null;
      const profile = await userProfile.getUserProfile(address);
      console.log("[getProfile] Data:", profile);
      return profile;
    } catch (err) {
      console.error("[getProfile] Failed:", err);
      return null;
    }
  };

  // Project Methods
  const createProject = async (form) => {
    try {
      const tx = await decentHire.postProject(
        form.title,
        form.description,
        ethers.parseEther(form.budget),
        Math.floor(new Date(form.deadline).getTime() / 1000),
        form.image
      );
      const receipt = await tx.wait(); // this will throw if reverted
      console.log("✅ Project created", receipt);
    } catch (err) {
      console.error("❌ Project creation failed:", err);
  
      if (err?.error?.message) {
        console.error("Error reason:", err.error.message);
      } else if (err?.data?.message) {
        console.error("Error reason:", err.data.message);
      } else if (err?.reason) {
        console.error("Error reason:", err.reason);
      }
    }
  };
  

  const getProjects = async () => {
    try {
      const projects = await decentHire.getProjects();
      return projects.map((p, i) => ({
        owner: p.owner,
        title: p.title,
        description: p.description,
        budget: formatEther(p.budget),
        deadline: Number(p.deadline),
        image: p.image,
        freelancer: p.freelancer,
        updates: p.updates,
        isApproved: p.isApproved,
        proposals: p.proposals,
        status: p.status,
        pId: i,
      }));
    } catch (err) {
      console.error("[getProjects] Failed:", err);
      return [];
    }
  };

  // Proposal Methods
  const createProposal = async (form) => {
    try {
      const tx = await decentHire.postProposal(
        form.id,
        form.description,
        parseEther(form.amount)
      );
      await tx.wait();
      console.log("✅ Proposal created");
    } catch (err) {
      console.error("[createProposal] Failed:", err);
    }
  };

  const getProposalsFromContract = async (_projectId) => {
    try {
      const proposals = await decentHire.getProposals(_projectId);
      return proposals.map((p, i) => ({
        description: p.description,
        amount: formatEther(p.amount),
        isAccepted: p.isAccepted,
        isRejected: p.isRejected,
        pId: i,
      }));
    } catch (err) {
      console.error("[getProposals] Failed:", err);
      return [];
    }
  };

  // Owner Actions
  const approve = async (_projectId, _proposalOwner) => {
    try {
      const tx = await decentHire.approveProposal(_projectId, _proposalOwner);
      await tx.wait();
      console.log("✅ Proposal approved");
    } catch (err) {
      console.error("[approveProposal] Failed:", err);
    }
  };

  const reject = async (_projectId, _proposalOwner) => {
    try {
      const tx = await decentHire.rejectProposal(_projectId, _proposalOwner);
      await tx.wait();
      console.log("✅ Proposal rejected");
    } catch (err) {
      console.error("[rejectProposal] Failed:", err);
    }
  };

  // Freelancer Accepts Project
  const acceptProject = async (_projectId, amount) => {
    try {
      const tx = await decentHire.AcceptProject(_projectId, {
        value: parseEther(amount),
      });
      await tx.wait();
      console.log("✅ Project accepted");
    } catch (err) {
      console.error("[acceptProject] Failed:", err);
    }
  };

  const contractsReady = Boolean(decentHire && userProfile);

  return (
    <StateContext.Provider
      value={{
        address,
        connectWallet,
        disconnectWallet,
        createProject,
        getProjects,
        updateProfile,
        getProfile,
        createProposal,
        getProposalsFromContract,
        approve,
        reject,
        acceptProject,
        contractsReady,
        contractAddress: DECENT_HIRE_ADDRESS,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
