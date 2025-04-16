import React, { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';
import { useContracts } from '../hooks/useContracts'; // Assuming this hook handles the contract logic

const StateContext = createContext();

export const useStateContext = () => {
  return useContext(StateContext);
};

export const StateContextProvider = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [contracts, setContracts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contractsReady, setContractsReady] = useState(false);
  const { getContracts } = useContracts(); // Custom hook to fetch contract instances
  
  // Connect wallet logic
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      if (!window.ethereum) throw new Error('MetaMask not installed');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);  // Request the user to connect their wallet
      const signer = provider.getSigner();  // Get the signer
      const address = await (await signer).getAddress();  // Use signer to get the address
      setAddress(address);
      
      const contracts = await getContracts(signer);  // Pass signer to contract hooks
      setContracts(contracts);
      setContractsReady(true);
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Disconnect wallet logic
  const disconnectWallet = () => {
    setAddress(null);
    setContracts(null);
    setContractsReady(false);  // Reset contracts when disconnected
  };

  // Profile management logic (interacting with the userProfile contract)
  const updateProfile = async ({ name, about, image, mail, twitter, github }) => {
    if (!contracts?.userProfile) {
      throw new Error("User profile contract not available.");
    }
  
    try {
      const tx = await contracts.userProfile.updateUserProfile(name, about, image, mail, twitter, github);
      await tx.wait();
      console.log('Profile updated successfully');
    } catch (err) {
      console.error("Error updating profile:", err);
      throw new Error("Error updating profile: " + err.message);
    }
  };
  
  const getProfile = async () => {
    if (!contracts?.userProfile || !address) return null;

    try {
      const profile = await contracts.userProfile.getUserProfile(address);
      console.log('Profile fetched successfully:', profile);
      return {
        name: profile[0],
        image: profile[1],
        about: profile[2],
        mail: profile[3],
        twitter: profile[4],
        github: profile[5],
      };
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  // Get contract readiness state
  const checkContractsReady = () => contractsReady;

  return (
    <StateContext.Provider value={{
      address,
      contracts,
      isLoading,
      contractsReady,
      connectWallet,
      disconnectWallet,
      updateProfile,
      getProfile,
      checkContractsReady,
    }}>
      {children}
    </StateContext.Provider>
  );
};
