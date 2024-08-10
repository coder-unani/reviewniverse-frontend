import React from "react";
import { DEFAULT_IMAGES } from "/src/config/constants";

const LoginLoading = () => {
  return (
    <main className="loading-main-container">
      <section className="loading-content-section">
        <div className="loading-content">
          <img className="loading-image" src={DEFAULT_IMAGES.loading} alt="로딩 이미지" />
          <p className="loading-title">소셜 로그인 중입니다.</p>
          <p className="loading-subtitle">잠시만 기다려주세요.</p>
        </div>
      </section>
    </main>
  );
};

export default LoginLoading;
