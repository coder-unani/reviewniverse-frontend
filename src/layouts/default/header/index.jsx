import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useThemeContext } from "/src/context/ThemeContext";
import MenuModal from "/src/components/Modal/MenuModal";
import SearchForm from "/src/components/SearchForm";
import ProfileButton from "/src/components/Button/Profile";
import ProfileImage from "/src/components/Button/Profile/ProfileImage";
import { DEFAULT_IMAGES, DEFAULT_ICONS } from "/src/config/constants";
import { RiSearchLine, RiMenu3Line } from "@remixicon/react";

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
              <img src={DEFAULT_IMAGES.logo} className="logo" alt="logo" />
            </Link>
          </div>
          <div className="right">
            <img src={DEFAULT_ICONS.search} alt="검색" onClick={handleMobileSearch} />
            {/* <RiSearchLine size={32} onClick={handleMobileSearch} /> */}
            <img src={DEFAULT_ICONS.menu} alt="메뉴" className="mobile-menu" onClick={toggleMobileMenu} />
            {/* <RiMenu3Line size={32} className="mobile-menu" onClick={toggleMobileMenu} /> */}
          </div>
        </div>
      ) : (
        <div className="header">
          <div className="left">
            <Link to="/">
              <img src={DEFAULT_IMAGES.logo} className="logo" alt="logo" />
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
              <Link to={`/user/${user.id}`}>
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
