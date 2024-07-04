import React from "react";
import { RiArrowLeftSLine } from "@remixicon/react";

const BackButton = () => {
  const handleBack = () => {
    window.history.back();
  };

  return <RiArrowLeftSLine size={30} className="back" onClick={handleBack} />;
};

export default BackButton;
