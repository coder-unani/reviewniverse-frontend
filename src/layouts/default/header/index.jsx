import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useThemeContext } from "/src/context/ThemeContext";
import MenuModal from "/src/components/Modal/Menu";
import SearchForm from "/src/components/SearchForm";
import ProfileImage from "/src/components/Button/Profile/Image";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { EndpointManager, ENDPOINTS } from "/src/config/endpoints";
import SearchIcon from "/src/assets/button/outline-search.svg?react";
import MenuIcon from "/src/assets/button/menu3.svg?react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { isMobile } = useThemeContext();
  const [isMenuModal, setIsMenuModal] = useState(false);
  const isSearch = location.pathname === ENDPOINTS.SEARCH;

  const toggleMobileMenu = () => {
    setIsMenuModal((prev) => !prev);
  };

  const handleMobileSearch = () => {
    navigate(ENDPOINTS.SEARCH);
  };

  const Logo = () => (
    <Link to={ENDPOINTS.HOME} className="header-logo-link">
      <img src={DEFAULT_IMAGES.logoWhite} className="logo" alt="logo" />
    </Link>
  );

  const MobileHeader = () => {
    const defaultMobile = () => (
      <section className="header-mobile-wrapper">
        <h1 className="header-logo">
          <Logo />
        </h1>
        <section className="toolbar-container">
          <SearchIcon className="search-button" onClick={handleMobileSearch} />
          <MenuIcon className="menu-button" onClick={toggleMobileMenu} />
        </section>
      </section>
    );

    const searchMobile = () => (
      <section className="header-search-wrapper">
        <SearchForm />
        <MenuIcon className="menu-button" onClick={toggleMobileMenu} />
      </section>
    );

    return isSearch ? searchMobile() : defaultMobile();
  };

  const DefaultHeader = () => {
    const renderProfile = () => {
      const path = EndpointManager.generateUrl(ENDPOINTS.USER, { userId: user.id });
      return (
        <Link to={path} className="toolbar-user">
          <ProfileImage image={user.profile_image} size={34} />
        </Link>
      );
    };

    const renderLogin = () => (
      <Link to={ENDPOINTS.USER_LOGIN} className="toolbar-login">
        로그인
      </Link>
    );

    return (
      <section className="header-wrapper">
        <h1 className="header-logo">
          <Logo />
        </h1>
        <section className="search-container">
          <SearchForm />
        </section>
        <section className="toolbar-container">{user ? renderProfile() : renderLogin()}</section>
      </section>
    );
  };

  const renderHeader = () => {
    return isMobile ? <MobileHeader /> : <DefaultHeader />;
  };

  return (
    <header className="header-container">
      {renderHeader()}
      {isMenuModal && <MenuModal onClose={toggleMobileMenu} />}
    </header>
  );
};

export default Header;
