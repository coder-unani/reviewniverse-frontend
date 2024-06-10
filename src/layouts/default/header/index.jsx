import React from "react";
import { Link } from "react-router-dom";
import Logo from "/src/assets/logo.svg";

/**
 * @todo
 * 1. 로고 클릭 시 메인 페이지로 이동
 * 2. 메뉴 클릭 시 해당 페이지로 이동
 * 2-1. 활성화된 메뉴 스타일 변경
 * 3. 검색어 입력 후 검색 버튼 클릭 시 검색 결과 페이지로 이동
 * 4. 로그인 버튼 클릭 시 로그인 페이지로 이동
 * 5. 회원가입 버튼 클릭 시 회원가입 페이지로 이동
 * 6. 로그인 시 로그인 버튼 대신 프로필 버튼으로 변경
 */

const Header = () => {
  const handleLoginButton = () => {
    window.location.href = "/user/login";
  };

  const handleJoinButton = () => {
    window.location.href = "/user/join";
  };

  return (
    <header className="header">
      <div className="left">
        <Link to="/">
          <img src={Logo} className="logo" alt="logo" />
        </Link>
        <ul className="menu">
          <li className="">
            <Link to="/movie">영화</Link>
          </li>
          <li className="">
            <Link to="/series">시리즈</Link>
          </li>
        </ul>
      </div>
      <div className="right">
        <div className="search">
          <input type="text" placeholder="검색어를 입력하세요" />
          <button>검색</button>
        </div>
        <button className="login" onClick={handleLoginButton}>
          로그인
        </button>
        <button className="join" onClick={handleJoinButton}>
          회원가입
        </button>
      </div>
    </header>
  );
};

export default Header;
