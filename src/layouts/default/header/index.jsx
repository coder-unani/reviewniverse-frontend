import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DEFAULT_IMAGES } from "/src/config/images";
import { RiSearchLine, RiMenu3Line } from "@remixicon/react";
import ProfileButton from "/src/components/Button/Profile";
import MenuModal from "/src/components/Modal/MenuModal";

/**
 * TODO:
 * 1. 모바일 검색 버튼 클릭시 검색 페이지로 이동
 */

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 메뉴 활성화
  const [activeMenu, setActiveMenu] = useState("");

  // 모바일 메뉴 활성화
  const [mobileMenu, setMobileMenu] = useState(false);

  // 모바일 메뉴 모달
  const [menuModal, setMenuModal] = useState(false);

  // 로그인 여부
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // 검색어
  const searchInputRef = useRef(null);

  // 메뉴 핸들러
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  // 모바일 메뉴 핸들러
  const toggleMobileMenu = () => {
    setMenuModal(!menuModal);
  };

  // 검색 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchQuery = searchInputRef.current.value;
    if (!searchQuery || !searchQuery.trim()) return;
    navigate(`/search?query=${searchQuery}`);
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

  useEffect(() => {
    window.innerWidth < 768 ? setMobileMenu(true) : setMobileMenu(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !mobileMenu) {
        setMobileMenu(true);
      } else if (window.innerWidth >= 768 && mobileMenu) {
        setMobileMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenu]);

  useEffect(() => {
    const path = location.pathname;

    if (path === "/search" || !searchInputRef.current) return;
    searchInputRef.current.value = "";

    if (path === "/movie") {
      setActiveMenu("movie");
    } else if (path === "/series") {
      setActiveMenu("series");
    } else {
      setActiveMenu("");
    }
  }, [location]);

  return (
    <header className="header-wrapper">
      {mobileMenu ? (
        <div className="header-mobile">
          <div className="left">
            <Link to="/">
              <img src={DEFAULT_IMAGES.logo} className="logo" alt="logo" />
            </Link>
          </div>
          <div className="right">
            <RiSearchLine size={24} />
            <RiMenu3Line size={24} className="mobile-menu" onClick={toggleMobileMenu} />
          </div>
        </div>
      ) : (
        <div className="header">
          <div className="left">
            <Link to="/">
              <img src={DEFAULT_IMAGES.logo} className="logo" alt="logo" />
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
            <form className="search" onSubmit={handleSearchSubmit}>
              <RiSearchLine size={20} />
              <input type="text" placeholder="검색어를 입력하세요." ref={searchInputRef} />
            </form>
            {user ? renderProfileButton() : renderLoginButton()}
          </div>
        </div>
      )}
      {menuModal && <MenuModal onClose={toggleMobileMenu} />}
    </header>
  );
};

export default Header;
