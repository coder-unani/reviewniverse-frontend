import React from "react";
import { ENDPOINTS } from "/src/config/endpoints";

const HomeButton = () => {
  const handleGoHome = () => {
    window.location.href = ENDPOINTS.HOME;
  };

  return (
    <button type="button" className="home-button" onClick={handleGoHome}>
      리뷰니버스 홈
    </button>
  );
};

export default HomeButton;
