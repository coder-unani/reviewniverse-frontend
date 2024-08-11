import React from "react";
import { DEFAULT_IMAGES } from "/src/config/constants";

const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="notfound-main-container">
      <section className="notfound-content-section">
        <div className="notfound-content">
          <img className="notfound-image" src={DEFAULT_IMAGES.pageNotFound} alt="페이지를 찾을 수 없음" />
          <p className="notfound-title">요청하신 페이지를 찾을 수 없습니다.</p>
          <p className="notfound-subtitle">
            입력하신 주소가 잘못되었거나, 변경 혹은 삭제되었을 수 있습니다.
            <br />
            입력하신 주소가 정확한지 다시 한번 확인해주세요.
          </p>
          <button type="button" className="notfound-home-button" onClick={handleGoHome}>
            리뷰니버스 홈
          </button>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
