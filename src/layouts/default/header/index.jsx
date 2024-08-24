import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useThemeContext } from "/src/context/ThemeContext";
import MenuModal from "/src/components/Modal/Menu";
import SearchForm from "/src/components/SearchForm";
import ProfileImage from "/src/components/Button/Profile/Image";
import { DEFAULT_IMAGES } from "/src/config/constants";
import SearchIcon from "/src/assets/button/search.svg?react";
import MenuIcon from "/src/assets/button/menu3.svg?react";

const Logo = () => (
  <Link to="/" className="header-logo-link">
    <img src={DEFAULT_IMAGES.logoWhite} className="logo" alt="logo" />
  </Link>
);

const MobileHeader = ({ isSearch, onToggleMenu, onSearch }) => (
  <section className={isSearch ? "header-search-wrapper" : "header-mobile-wrapper"}>
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
        <section className="toolbar-container">
          <SearchIcon className="search-button" onClick={onSearch} />
          <MenuIcon className="menu-button" onClick={onToggleMenu} />
        </section>
      </>
    )}
  </section>
);

const DefaultHeader = ({ user }) => (
  <section className="header-wrapper">
    <h1 className="header-logo">
      <Logo />
    </h1>
    <section className="search-container">
      <SearchForm />
    </section>
    <section className="toolbar-container">
      {user ? (
        <Link to={`/user/${user.id}`} className="toolbar-user">
          <ProfileImage image={user.profile_image} size={34} />
        </Link>
      ) : (
        <Link to="/user/login" className="toolbar-login">
          로그인
        </Link>
      )}
    </section>
  </section>
);

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { isMobile } = useThemeContext();
  const [isMenuModal, setIsMenuModal] = useState(false);
  const isSearch = location.pathname === "/search";

  const toggleMobileMenu = () => setIsMenuModal((prev) => !prev);
  const handleMobileSearch = () => navigate("/search");

  return (
    <header className="header-container">
      {isMobile ? (
        <MobileHeader isSearch={isSearch} onToggleMenu={toggleMobileMenu} onSearch={handleMobileSearch} />
      ) : (
        <DefaultHeader user={user} />
      )}
      {isMenuModal && <MenuModal onClose={toggleMobileMenu} />}
    </header>
  );
};

export default Header;
