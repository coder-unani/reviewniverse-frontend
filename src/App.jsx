import React from "react";
import Logo from "/src/assets/logo.svg";
import { RiArrowRightSLine } from "@remixicon/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "/src/styles/App.css";

/**
 * @todo
 * 0. 페이지 라우팅
 * 1. 로고 클릭 시 메인 페이지로 이동
 * 2. 메뉴 클릭 시 해당 페이지로 이동
 * 3. 검색어 입력 후 검색 버튼 클릭 시 검색 결과 페이지로 이동
 * 4. 로그인 버튼 클릭 시 로그인 페이지로 이동
 * 4-1. 아이디, 비밀번호 입력
 * 4-2. 로그인 버튼 클릭 시 로그인 처리
 * 4-3. 로그인 성공 시 메인 페이지로 이동
 * 4-4. 로그인 n회 이상 실패 시 사람인지 확인
 * 5. 회원가입 버튼 클릭 시 회원가입 페이지로 이동
 * 5-1. 아이디, 비밀번호, 비밀번호 확인, 이름, 이메일 입력
 */

function App() {
  const swiperConfig = {
    modules: [Navigation],
    spaceBetween: 20,
    slidesPerView: 5,
    navigation: true,
  };

  return (
    <div className="wrapper">
      <header className="header">
        <div className="left">
          <img src={Logo} className="logo" alt="logo" />
          <ul className="menu">
            <li className="active">영화</li>
            <li>시리즈</li>
          </ul>
        </div>
        <div className="right">
          <div className="search">
            <input type="text" placeholder="검색어를 입력하세요" />
            <button>검색</button>
          </div>
          <button className="login">로그인</button>
          <button className="join">회원가입</button>
        </div>
      </header>
      <main className="main">
        <section className="container">
          <div className="title-wrapper">
            <h2 className="title">🎬 박스오피스 순위</h2>
            <button className="more">
              더보기
              <RiArrowRightSLine width={20} height={20} />
            </button>
          </div>
          <Swiper {...swiperConfig}>
            {new Array(10).fill(1).map((_, index) => (
              <SwiperSlide key={index}>
                <div className="img">
                  <div className="number">
                    <img src={`/src/assets/number-${index + 1}.svg`} alt="1" />
                  </div>
                </div>
                <div className="info">
                  <p title="title">영화/시리즈 제목</p>
                  <div className="sub-title">
                    <span>제작년도</span>
                    <span>|</span>
                    <span>국가</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </main>
      <footer className="footer">footer</footer>
    </div>
  );
}

export default App;
