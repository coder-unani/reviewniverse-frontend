import React from "react";
import { Link } from "react-router-dom";
import { DEFAULT_IMAGES } from "/src/config/constants";

// TODO: 에러 코드별 메세지 표시

const Error = () => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="error-main-container">
      <section className="error-content-section">
        <div className="error-content">
          <img className="error-image" src={DEFAULT_IMAGES.error} alt="페이지를 찾을 수 없음" />
          <p className="error-title">서비스에 접속할 수 없습니다.</p>
          <p className="error-subtitle">
            죄송합니다. 기술적인 문제로 일시적으로 접속되지 않습니다.
            <br />
            잠시 후 다시 이용 부탁드립니다.
          </p>
          <button type="button" className="error-home-button" onClick={handleGoHome}>
            리뷰니버스 홈
          </button>
        </div>
      </section>
    </div>
  );
};

export default Error;
