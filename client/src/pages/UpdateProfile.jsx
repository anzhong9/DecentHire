import React, { useState } from 'react';
import { useStateContext } from '../context/stateContext';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const { updateProfile, address, contractsReady } = useStateContext(); // 👈 added contractsReady
  const [form, setForm] = useState({
    name: '',
    image: '',
    about: '',
    email: '',
    twitter: '',
    github: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.image || !form.about) {
      alert("Please fill in all required fields (name, image, about)");
      return;
    }

    if (!contractsReady) {
      alert("Contracts not ready. Please try again shortly.");
      return;
    }

    try {
      setLoading(true);
      await updateProfile({
        title: form.name,
        description: form.about,
        image: form.image,
        mail: form.email,
        twitter: form.twitter,
        github: form.github,
      });
      navigate('/profile');
    } catch (err) {
      console.error("Update profile failed:", err);
      alert("Something went wrong updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-[#791355] text-white rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Update Profile</h2>

      {!address && <p className="text-center text-white mb-4">Please connect your wallet to update profile.</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          className="w-full px-4 py-2 bg-white text-black rounded"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Profile image URL"
          className="w-full px-4 py-2 bg-white text-black rounded"
          value={form.image}
          onChange={handleChange}
        />
        <textarea
          name="about"
          placeholder="About you"
          className="w-full px-4 py-2 bg-white text-black rounded"
          rows={4}
          value={form.about}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 bg-white text-black rounded"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="twitter"
          placeholder="Twitter URL"
          className="w-full px-4 py-2 bg-white text-black rounded"
          value={form.twitter}
          onChange={handleChange}
        />
        <input
          type="text"
          name="github"
          placeholder="GitHub URL"
          className="w-full px-4 py-2 bg-white text-black rounded"
          value={form.github}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-[#CB1C8D] hover:bg-white hover:text-[#CB1C8D] text-white font-bold py-2 px-4 rounded w-full"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
