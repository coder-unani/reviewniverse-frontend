import React from "react";
import ArrowLeftIcon from "/src/assets/button/arrow-left.svg?react";

const BackButton = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <button className="back-button">
      <ArrowLeftIcon className="back-icon" onClick={handleBack} />
    </button>
  );
};

export default BackButton;
