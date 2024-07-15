import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMobileContext } from "/src/context/MobileContext";
import MenuModal from "/src/components/Modal/MenuModal";
import SearchForm from "/src/components/SearchForm";
import ProfileButton from "/src/components/Button/Profile";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { RiSearchLine, RiMenu3Line } from "@remixicon/react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 메뉴 활성화
  const [activeMenu, setActiveMenu] = useState("");

  // 모바일 메뉴 활성화
  const { isMobile } = useMobileContext();

  // 모바일 메뉴 모달
  const [menuModal, setMenuModal] = useState(false);

  // 로그인 여부
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

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
            <RiSearchLine size={32} onClick={handleMobileSearch} />
            <RiMenu3Line size={32} className="mobile-menu" onClick={toggleMobileMenu} />
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
            <SearchForm />
            {user ? renderProfileButton() : renderLoginButton()}
          </div>
        </div>
      )}
      {menuModal && <MenuModal onClose={toggleMobileMenu} />}
    </header>
  );
};

export default Header;
