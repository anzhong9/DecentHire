import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/stateContext";

const CreateProject = () => {
  const { createProject, address } = useStateContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const isFormValid = () => {
    return Object.values(form).every((field) => field.trim() !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await createProject(form); // ✅ Send only form, no wrapping
      setForm({
        title: "",
        description: "",
        budget: "",
        deadline: "",
        image: "",
      });
      navigate("/");
    } catch (err) {
      console.error("Failed to create project:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-20 text-3xl text-center p-10 text-white">
        {!address && <p>Please connect your wallet</p>}
        Create your own <span className="text-[#CB1C8D]">Project</span>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto text-white">
        {/* Title */}
        <div className="mb-4">
          <input
            type="text"
            id="title"
            placeholder="Project Title"
            className="w-full p-3 rounded border bg-white text-black"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <textarea
            id="description"
            placeholder="Project Description"
            className="w-full p-3 rounded border bg-white text-black"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* Budget */}
        <div className="mb-4">
          <input
            type="number"
            id="budget"
            placeholder="Budget (in MATIC)"
            className="w-full p-3 rounded border bg-white text-black"
            value={form.budget}
            onChange={handleChange}
          />
        </div>

        {/* Deadline */}
        <div className="mb-4">
          <input
            type="date"
            id="deadline"
            className="w-full p-3 rounded border bg-white text-black"
            value={form.deadline}
            onChange={handleChange}
          />
        </div>

        {/* Image */}
        <div className="mb-4">
          <input
            type="text"
            id="image"
            placeholder="Image URL"
            className="w-full p-3 rounded border bg-white text-black"
            value={form.image}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#CB1C8D] hover:bg-white hover:text-[#CB1C8D] text-white font-bold py-2 px-6 rounded"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateProject;
