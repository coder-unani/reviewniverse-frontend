import React from "react";
import ArrowLeft from "/src/assets/button/arrow-left.svg?react";

const BackButton = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <button className="back-button">
      <ArrowLeft onClick={handleBack} />
    </button>
  );
};

export default BackButton;
