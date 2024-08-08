import React from "react";
import { DEFAULT_IMAGES } from "/src/config/constants";

const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="not-found-main">
      <section className="not-found-contents">
        <div className="not-found">
          <img src={DEFAULT_IMAGES.pageNotFound} alt="페이지를 찾을 수 없음" />
          <p className="title">요청하신 페이지를 찾을 수 없습니다.</p>
          <p className="sub-title">
            입력하신 주소가 잘못되었거나, 변경 혹은 삭제되었을 수 있습니다.
            <br />
            입력하신 주소가 정확한지 다시 한번 확인해주세요.
          </p>
          <button className="home" onClick={handleGoHome}>
            리뷰니버스 홈
          </button>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
