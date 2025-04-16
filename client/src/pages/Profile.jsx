// components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useStateContext } from "../context/stateContext";
import Loader from '../components/Loader';
import img from '../assets/wallet.png';

const Profile = () => {
  const { 
    address, 
    connectWallet, 
    getProfile, 
    isLoading 
  } = useStateContext();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const fetchProfile = async () => {
    if (!address) return;
    
    try {
      setLoadingProfile(true);
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [address]);

  if (isLoading || loadingProfile) return <Loader />;

  if (!address) {
    return (
      <div className='mt-10 text-4xl text-white bg-[#791355] px-28 py-20 md:flex'>
        <div className='my-auto'>
          Connect your <span className='font-bold'>wallet</span> to see your profile.
          <button 
            onClick={connectWallet}
            className='mt-10 text-lg bg-white text-[#791355] px-4 py-2 rounded-md hover:bg-gray-100 transition'
          >
            Connect Wallet
          </button>
        </div>
        <img src={img} alt="wallet prompt" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-white text-center mt-20">
        <p className="text-lg">Profile not found. Try updating your profile.</p>
        <a
          href="/updateprofile"
          className='mt-4 inline-block bg-white text-[#CB1C8D] rounded-md px-4 py-2 font-semibold hover:bg-gray-100 transition'
        >
          Create Profile
        </a>
      </div>
    );
  }

  const { name, image, about, mail, twitter, github } = profile;

  return (
    <div className="max-w-md mx-auto bg-[#791355] text-white shadow-lg rounded-lg overflow-hidden mt-20">
      <p className='text-center text-3xl mt-6'>Profile</p>
      <div className="px-6 py-6">
        <div className="flex justify-center">
          <img
            className="h-28 w-28 rounded-full object-cover"
            src={image || "https://w0.peakpx.com/wallpaper/979/89/HD-wallpaper-purple-smile-design-eye-smily-profile-pic-face.jpg"}
            alt="profile avatar"
          />
        </div>

        <h1 className="text-xl text-center mt-4">{name || "Unnamed User"}</h1>
        <p className="text-sm text-center mt-2">{address}</p>
        <p className="text-sm text-center mt-1">{mail || "No email provided"}</p>

        <div className="mt-6 text-center">
          <h2 className='text-lg mb-1'>About</h2>
          <p className="text-sm">{about || "This user hasn't added anything yet."}</p>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          {twitter && (
            <a 
              href={`https://twitter.com/${twitter}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-500"
            >
              <i className="fab fa-twitter text-xl"></i>
            </a>
          )}
          {github && (
            <a 
              href={`https://github.com/${github}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gray-300"
            >
              <i className="fab fa-github text-xl"></i>
            </a>
          )}
        </div>

        <div className='text-center mt-6'>
          <a
            href="/updateprofile"
            className='bg-white text-[#CB1C8D] rounded-md px-4 py-2 font-semibold hover:bg-gray-100 transition'
          >
            Update Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;