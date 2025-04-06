import { ethers } from 'ethers';
import DecentHireABI from '../contracts/decentHire-abi.json';
import DecentHireAddress from '../contracts/decentHire-address.json';
import UserProfileABI from '../contracts/userProfile-abi.json';
import UserProfileAddress from '../contracts/userProfile-address.json';

export const useContracts = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const decentHire = new ethers.Contract(
    DecentHireAddress.address,
    DecentHireABI,
    signer
  );

  const userProfile = new ethers.Contract(
    UserProfileAddress.address,
    UserProfileABI,
    signer
  );

  return { decentHire, userProfile, provider, signer };
};
