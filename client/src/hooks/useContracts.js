import { useMemo } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import DecentHireABI from '../contracts/decentHire-abi.json';
import DecentHireAddress from '../contracts/decentHire-address.json';
import UserProfileABI from '../contracts/userProfile-abi.json';
import UserProfileAddress from '../contracts/userProfile-address.json';

export const useContracts = () => {
  const contracts = useMemo(() => {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.warn('MetaMask not detected');
      return {};
    }

    const provider = new BrowserProvider(window.ethereum);

    const getContracts = async () => {
      const signer = await provider.getSigner();

      const decentHire = new Contract(
        DecentHireAddress.address,
        DecentHireABI,
        signer
      );

      const userProfile = new Contract(
        UserProfileAddress.address,
        UserProfileABI,
        signer
      );

      return { provider, signer, decentHire, userProfile };
    };

    return getContracts(); // This returns a Promise
  }, []);

  return contracts; // Now returns a Promise
};
