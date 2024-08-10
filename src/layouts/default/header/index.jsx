import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useThemeContext } from "/src/context/ThemeContext";
import MenuModal from "/src/components/Modal/MenuModal";
import SearchForm from "/src/components/SearchForm";
import ProfileImage from "/src/components/Button/Profile/ProfileImage";
import { DEFAULT_IMAGES } from "/src/config/constants";
import SearchIcon from "/src/assets/button/search.svg?react";
import MenuIcon from "/src/assets/button/menu3.svg?react";

const Logo = () => (
  <Link to="/" className="header-logo-link">
    <img src={DEFAULT_IMAGES.logoWhite} className="logo" alt="logo" />
  </Link>
);

const MobileHeader = ({ isSearch, onToggleMenu, onSearch }) => (
  <div className={isSearch ? "header-search-wrapper" : "header-mobile-wrapper"}>
    {isSearch ? (
      <>
        <SearchForm />
        <MenuIcon className="menu-button" onClick={onToggleMenu} />
      </>
    ) : (
      <>
        <h1 className="header-logo">
          <Logo />
        </h1>
        <div className="toolbar-container">
          <SearchIcon className="search-button" onClick={onSearch} />
          <MenuIcon className="menu-button" onClick={onToggleMenu} />
        </div>
      </>
    )}
  </div>
);

const DefaultHeader = ({ user }) => (
  <div className="header-wrapper">
    <h1 className="header-logo">
      <Logo />
    </h1>
    <div className="search-container">
      <SearchForm />
    </div>
    <div className="toolbar-container">
      {user ? (
        <Link to={`/user/${user.id}`} className="toolbar-user">
          <ProfileImage image={user.profile_image} size={34} />
        </Link>
      ) : (
        <Link to="/user/login" className="toolbar-login">
          로그인
        </Link>
      )}
    </div>
  </div>
);

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { isMobile } = useThemeContext();
  const [menuModal, setMenuModal] = useState(false);
  const isSearch = location.pathname === "/search";

  const toggleMobileMenu = () => setMenuModal(!menuModal);
  const handleMobileSearch = () => navigate("/search");

  return (
    <header className="header-container">
      {isMobile ? (
        <MobileHeader isSearch={isSearch} onToggleMenu={toggleMobileMenu} onSearch={handleMobileSearch} />
      ) : (
        <DefaultHeader user={user} />
      )}
      {menuModal && <MenuModal onClose={toggleMobileMenu} />}
    </header>
  );
};

export default Header;
