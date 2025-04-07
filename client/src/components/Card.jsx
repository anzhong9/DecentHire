import React from 'react';
import { daysLeft } from '../utils';

const Card = ({
  owner,
  title,
  description,
  budget,
  deadline,
  image,
  isApproved,
  status,
  handleClick
}) => {
  const remainingDays = daysLeft(deadline);

  const statusLabel = isApproved && !status
    ? 'Ongoing'
    : status
    ? 'Completed'
    : 'New';

  return (
    <div
      className="sm:w-[288px] w-full rounded-xl bg-[#731a54] hover:bg-[#8a2d66] transition-colors cursor-pointer shadow-md"
      onClick={handleClick}
    >
      <img
        src={image}
        alt="project cover"
        className="w-full h-40 object-cover rounded-t-xl"
      />

      <div className="flex flex-col p-4">
        <div className="mb-3">
          <p className="inline-block text-xs bg-green-600 text-white px-2 py-0.5 rounded-md">
            {statusLabel}
          </p>
        </div>

        <h3 className="text-white text-lg font-semibold truncate">{title}</h3>
        <p className="text-[#ccc] text-sm mt-1 truncate">{description}</p>

        <div className="flex justify-between mt-4">
          <span className="text-[#b2b3bd] text-sm font-medium">{budget} ETH</span>
          <span className="text-[#808191] text-sm">{remainingDays} Days Left</span>
        </div>

        <div className="mt-4 text-sm text-[#808191] truncate">
          by <span className="text-[#b2b3bd]">{owner}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
