import React from "react";
import { DEFAULT_IMAGES } from "/src/config/constants";
import "/src/styles/LoginLoading.css";

const LoginLoading = () => {
  return (
    <div className="loading-main">
      <section className="loading-contents">
        <div className="loading">
          <img src={DEFAULT_IMAGES.loading} alt="로딩 이미지" />
          <p className="title">소셜 로그인 중입니다.</p>
        </div>
      </section>
    </div>
  );
};

export default LoginLoading;
