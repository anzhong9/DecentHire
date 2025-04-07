import React, { useState, useEffect } from 'react';
import { useStateContext } from "../context/stateContext";
import Loader from '../components/Loader';
import img from '../assets/wallet.png';

const Profile = () => {
  const { address, getProfile, contractsReady } = useStateContext();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = async () => {
    console.log("[Profile] fetchProfile called");
    if (!contractsReady || !address) {
      console.warn("[Profile] Contracts not ready or no address. Skipping fetch.");
      return;
    }

    try {
      setIsLoading(true);
      const data = await getProfile();
      console.log("[Profile] Retrieved profile:", data);
      if (data) setProfile(data);
    } catch (err) {
      console.error("[Profile] Failed to fetch profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("[Profile] useEffect triggered");
    console.log("[Profile] address:", address);
    console.log("[Profile] contractsReady:", contractsReady);

    if (contractsReady && address) {
      fetchProfile();
    }
  }, [address, contractsReady]);

  if (isLoading) return <Loader />;

  if (!address) {
    return (
      <div className='mt-10 text-4xl text-white bg-[#791355] px-28 py-20 md:flex'>
        <div className='my-auto'>
          Connect your <span className='font-bold'>wallet</span> to see your profile.
          <p className='mt-10 text-lg'>Try reconnecting if your profile isn't showing — we're working on it 😄</p>
        </div>
        <img src={img} alt="wallet prompt" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-white text-center mt-20">
        <p className="text-lg">Profile not found. Try updating your profile.</p>
      </div>
    );
  }

  const [name, imageUrl, about, email, twitter, github] = profile;

  return (
    <div className="max-w-md mx-auto bg-[#791355] text-white shadow-lg rounded-lg overflow-hidden mt-20">
      <p className='text-center text-3xl mt-6'>Profile</p>
      <div className="px-6 py-6">
        <div className="flex justify-center">
          <img
            className="h-28 w-28 rounded-full object-cover"
            src={imageUrl === "www.link.com" || !imageUrl
              ? "https://w0.peakpx.com/wallpaper/979/89/HD-wallpaper-purple-smile-design-eye-smily-profile-pic-face.jpg"
              : imageUrl}
            alt="profile avatar"
          />
        </div>

        <h1 className="text-xl text-center mt-4">{name || "Unnamed User"}</h1>
        <p className="text-sm text-center mt-2">{address}</p>
        <p className="text-sm text-center mt-1">{email || "No email provided"}</p>

        <div className="mt-6 text-center">
          <h2 className='text-lg mb-1'>About</h2>
          <p className="text-sm">{about || "This user hasn't added anything yet."}</p>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          {twitter && (
            <a href={twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <i className="fab fa-twitter text-xl"></i>
            </a>
          )}
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
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
