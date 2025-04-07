import React, { useState } from "react";
import { useStateContext } from "../context/stateContext";
import { Link } from "react-router-dom";

const navlinks = [
  { name: "Home", href: "/" },
  { name: "Profile", href: "/profile" },
  { name: "Projects", href: "/projects" },
];

const Navbar = () => {
  const { address, connectWallet, disconnectWallet } = useStateContext();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDisconnect = () => {
    setShowConfirm(true);
  };

  const confirmDisconnect = () => {
    disconnectWallet();
    setShowConfirm(false);
  };

  const cancelDisconnect = () => {
    setShowConfirm(false);
  };

  return (
    <div className="w-full px-6 py-4 flex justify-between items-center bg-black text-white shadow-md relative">
      <Link to="/" className="text-3xl font-bold">
        DecentHire
      </Link>

      <div className="flex gap-4">
        {navlinks.map((link, i) => (
          <Link
            key={i}
            to={link.href}
            className="hover:bg-[#751051] px-4 py-2 rounded-md transition"
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div>
        {address ? (
          <>
            <button
              onClick={handleDisconnect}
              className="bg-[#CB1C8D] hover:bg-[#a0126d] px-4 py-2 rounded-xl text-white transition"
            >
              {address.slice(0, 6)}...{address.slice(-4)}
            </button>

            {/* Popup Confirm */}
            {showConfirm && (
              <div className="absolute top-20 right-6 bg-white text-black p-4 rounded shadow-lg z-50">
                <p className="mb-3">Disconnect wallet?</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={confirmDisconnect}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Yes
                  </button>
                  <button
                    onClick={cancelDisconnect}
                    className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-[#CB1C8D] hover:bg-[#a0126d] px-4 py-2 rounded-xl text-white transition"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
