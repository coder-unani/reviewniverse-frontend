import React from "react";
import ClearIcon from "/src/assets/button/clear.svg?react";

const ClearButton = ({ onClear }) => {
  const handleClick = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <button className="clear-button" onClick={handleClick}>
      <ClearIcon className="clear-icon" />
    </button>
  );
};

export default ClearButton;
