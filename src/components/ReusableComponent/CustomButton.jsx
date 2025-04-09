import React from "react";

const CustomButton = ({ onClick, btntitle, type,Icons }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="flex items-center justify-center w-full px-4 py-2 mt-2 text-white rounded-md bg-maincolor"
    >
      {btntitle}
    </button>
  );
};

export default CustomButton;
