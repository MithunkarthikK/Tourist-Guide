import React from "react";

const ShimmerCard = () => {
  return (
    <div className="animate-pulse rounded-2xl p-4 bg-[#1f1f1f]">
      <div className="bg-gray-700 h-48 w-full rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-600 rounded w-full"></div>
    </div>
  );
};

export default ShimmerCard;
