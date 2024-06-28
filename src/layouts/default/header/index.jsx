import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "/src/assets/logo.svg";
import { RiSearchLine } from "@remixicon/react";
import ProfileButton from "/src/components/Button/Profile";

/**
 * TODO:
 * 1. 검색어 입력 후 검색 버튼 클릭 시 검색 결과 페이지로 이동
 */

const Header = () => {
  const location = useLocation();

  // 메뉴 활성화
  const [activeMenu, setActiveMenu] = useState("");

  // 로그인 여부
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // 활성화된 메뉴 설정
  useEffect(() => {
    const path = location.pathname;
    if (path === "/movie") {
      setActiveMenu("movie");
    } else if (path === "/series") {
      setActiveMenu("series");
    } else {
      setActiveMenu("");
    }
  }, [location, activeMenu]);

  // TODO: 토큰 검증
  /*
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    cLog(user);
    cLog(token);
  }, []);
  */

  // 메뉴 핸들러
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  // 로그인 여부에 따라 프로필 또는 로그인 버튼 렌더링
  const renderProfileButton = () => {
    return <ProfileButton image={user.profile_image} user={{ id: user.id, nickname: user.nickname }} />;
  };

  const renderLoginButton = () => {
    return (
      <>
        <Link to="/user/login" className="login">
          로그인
        </Link>
        <Link to="/user/join" className="join">
          회원가입
        </Link>
      </>
    );
  };

  return (
    <header className="header-wrapper">
      <div className="header">
        <div className="left">
          <Link to="/">
            <img src={Logo} className="logo" alt="logo" />
          </Link>
          <ul className="menu">
            <li className={activeMenu === "movie" ? "active" : ""} onClick={() => handleMenuClick("movie")}>
              <Link to="/movie">영화</Link>
            </li>
            <li className={activeMenu === "series" ? "active" : ""} onClick={() => handleMenuClick("series")}>
              <Link to="/series">시리즈</Link>
            </li>
          </ul>
        </div>
        <div className="right">
          <div className="search">
            <RiSearchLine size={20} />
            <input type="text" placeholder="검색어를 입력하세요." />
          </div>
          {user ? renderProfileButton() : renderLoginButton()}
        </div>
      </div>
    </header>
  );
};

export default Header;
