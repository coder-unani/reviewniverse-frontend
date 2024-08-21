import React from "react";
import ArrowLeftIcon from "/src/assets/button/arrow-left.svg?react";

const BackButton = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <button type="button" className="back-button">
      <ArrowLeftIcon onClick={handleBack} />
    </button>
  );
};

export default BackButton;
