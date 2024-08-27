import React from "react";
import ClearIcon from "/src/assets/button/fill-clear.svg?react";

const ClearButton = ({ onClear }) => {
  const handleClear = () => onClear?.();

  return (
    <button type="reset" className="clear-button" onClick={handleClear}>
      <ClearIcon />
    </button>
  );
};

export default ClearButton;
