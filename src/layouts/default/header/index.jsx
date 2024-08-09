import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useThemeContext } from "/src/context/ThemeContext";
import MenuModal from "/src/components/Modal/MenuModal";
import SearchForm from "/src/components/SearchForm";
import ProfileImage from "/src/components/Button/Profile/ProfileImage";
import { DEFAULT_IMAGES } from "/src/config/constants";
import SearchIcon from "/src/assets/button/search.svg?react";
import MenuIcon from "/src/assets/button/menu3.svg?react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // 로그인 여부
  const { user } = useAuthContext();

  // 메뉴 활성화
  const [activeMenu, setActiveMenu] = useState("");

  // 모바일 메뉴 활성화
  const { isMobile } = useThemeContext();

  // 모바일 메뉴 모달
  const [menuModal, setMenuModal] = useState(false);

  /* 데스크탑 */
  // 메뉴 핸들러
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  /* 모바일 */
  // 모바일 메뉴 핸들러
  const toggleMobileMenu = () => {
    setMenuModal(!menuModal);
  };

  // 모바일 검색 메뉴 핸들러
  const handleMobileSearch = () => {
    navigate("/search");
  };

  useEffect(() => {
    const path = location.pathname;

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
      {isMobile ? (
        <div className="header-mobile">
          <div className="left">
            <Link to="/">
              <img src={DEFAULT_IMAGES.logoWhite} className="logo" alt="logo" />
            </Link>
          </div>
          <div className="right">
            <SearchIcon onClick={handleMobileSearch} />
            <MenuIcon className="mobile-menu" onClick={toggleMobileMenu} />
          </div>
        </div>
      ) : (
        <div className="header">
          <div className="left">
            <Link to="/">
              <img src={DEFAULT_IMAGES.logoWhite} className="logo" alt="logo" />
            </Link>
            {/* <ul className="menu">
              <li className={activeMenu === "movie" ? "active" : ""} onClick={() => handleMenuClick("movie")}>
                <Link to="/movie">영화</Link>
              </li>
              <li className={activeMenu === "series" ? "active" : ""} onClick={() => handleMenuClick("series")}>
                <Link to="/series">시리즈</Link>
              </li>
            </ul> */}
          </div>
          <div className="right">
            <SearchForm />
            {user ? (
              <Link to={`/user/${user.id}`} className="login-user">
                <ProfileImage image={user.profile_image} size={30} />
              </Link>
            ) : (
              <Link to="/user/login" className="login">
                로그인
              </Link>
            )}
          </div>
        </div>
      )}
      {menuModal && <MenuModal onClose={toggleMobileMenu} />}
    </header>
  );
};

export default Header;
