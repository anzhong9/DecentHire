import React, { useEffect, useState } from "react";
import { useStateContext } from "../context/stateContext";
import { ethers } from "ethers";

const JobMilestones = ({ jobId, clientAddress }) => {
  const {
    address,
    contracts,
    createMilestone,
    payMilestone,
    // isLoading
  } = useStateContext();

  const [milestones, setMilestones] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const isClient = address?.toLowerCase() === clientAddress?.toLowerCase();

  // Fetch milestones for the job
  const fetchMilestones = React.useCallback(async () => {
    if (!contracts?.milestoneContract) return;
    try {
      const total = await contracts.milestoneContract.milestoneCounter();
      const items = [];
      for (let i = 0; i < total; i++) {
        const m = await contracts.milestoneContract.milestones(i);
        if (m.jobId.toString() === jobId.toString()) {
          items.push(m);
        }
      }
      setMilestones(items);
    } catch (err) {
      console.error("Error fetching milestones", err);
    }
  }, [contracts, jobId]);

  useEffect(() => {
    fetchMilestones();
  }, [jobId, contracts, fetchMilestones]);

  const handleCreateMilestone = async () => {
    try {
      await createMilestone(jobId, description, amount);
      setDescription("");
      setAmount("");
      fetchMilestones();
    } catch (err) {
      console.error("Create milestone error", err);
    }
  };

  const handlePay = async (id, value) => {
    try {
      await payMilestone(id, { value }); // Pay with ETH value
      fetchMilestones();
    } catch (err) {
      console.error("Pay milestone error", err);
    }
  };

  return (
    <div className="mt-4 bg-zinc-900 p-4 rounded-xl">
      <h3 className="text-lg font-semibold text-white mb-3">Milestones</h3>

      {milestones.length === 0 && (
        <p className="text-gray-400">No milestones yet.</p>
      )}

      {milestones.map((m, i) => (
        <div
          key={i}
          className="bg-zinc-800 p-3 rounded mb-2 flex justify-between items-center"
        >
          <div>
            <p className="text-white font-medium">{m.description}</p>
            <p className="text-sm text-gray-400">
              Amount: {ethers.formatEther(m.amount)} ETH
            </p>
            <p className="text-sm text-gray-400">
              Status: {m.status == 1 ? "Paid" : "Pending"}
            </p>
          </div>
          {isClient && m.status == 0 && (
            <button
              onClick={() => handlePay(m.id, m.amount)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
            >
              Pay
            </button>
          )}
        </div>
      ))}

      {isClient && (
        <div className="mt-4">
          <h4 className="text-white font-semibold mb-2">Add Milestone</h4>
          <input
            type="text"
            placeholder="Description"
            className="block mb-2 px-3 py-1 rounded bg-zinc-700 text-white w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount (ETH)"
            className="block mb-2 px-3 py-1 rounded bg-zinc-700 text-white w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            onClick={handleCreateMilestone}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Create
          </button>
        </div>
      )}
    </div>
  );
};

export default JobMilestones;
