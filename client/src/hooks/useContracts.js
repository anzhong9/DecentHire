import { useMemo } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import UserProfileABI from '../contracts/userProfile-abi.json';
import SimpleJobContractABI from '../contracts/SimpleJobContract-abi.json';
import SimpleMilestoneContractABI from '../contracts/SimpleMilestoneContract-abi.json';
import contractAddresses from '../contracts/contract-addresses.json';

export const useContracts = () => {
  return useMemo(() => {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.warn('Ethereum provider not found');
      return null;
    }

    const provider = new BrowserProvider(window.ethereum);

    return {
      getContracts: async () => {
        try {
          const signer = await provider.getSigner();
          
          return {
            userProfile: new Contract(
              contractAddresses.userProfile,
              UserProfileABI,
              signer
            ),
            jobContract: new Contract(
              contractAddresses.jobContract,
              SimpleJobContractABI,
              signer
            ),
            milestoneContract: new Contract(
              contractAddresses.milestoneContract,
              SimpleMilestoneContractABI,
              signer
            ),
            provider,
            signer
          };
        } catch (error) {
          console.error('Error getting contracts:', error);
          throw error;
        }
      }
    };
  }, []);
};