import React from "react";

const HomeButton = () => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <button type="button" className="home-button" onClick={handleGoHome}>
      리뷰니버스 홈
    </button>
  );
};

export default HomeButton;
