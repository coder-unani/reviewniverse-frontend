import React from "react";
import { Link } from "react-router-dom";
import { DEFAULT_IMAGES } from "/src/config/constants";

const Error = () => {
  // TODO: 에러 코드별 메세지 표시
  return (
    <div className="error-main">
      <section className="error-contents">
        <div className="error">
          <img src={DEFAULT_IMAGES.error} alt="페이지를 찾을 수 없음" />
          <p className="title">서비스에 접속할 수 없습니다.</p>
          <p className="sub-title">
            죄송합니다. 기술적인 문제로 일시적으로 접속되지 않습니다.
            <br />
            잠시 후 다시 이용 부탁드립니다.
          </p>
          <button>리뷰니버스 홈</button>
        </div>
      </section>
    </div>
  );
};

export default Error;
