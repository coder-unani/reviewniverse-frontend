import React, { useState } from "react";
import MenuModal from "/src/components/Modal/MenuModal";
import SearchForm from "/src/components/SearchForm";
import MenuIcon from "/src/assets/button/menu3.svg?react";

const Header = () => {
  // 모바일 메뉴 모달
  const [menuModal, setMenuModal] = useState(false);

  /* 모바일 */
  // 모바일 메뉴 핸들러
  const toggleMobileMenu = () => {
    setMenuModal(!menuModal);
  };

  return (
    <header className="header-wrapper">
      <div className="header-search">
        <SearchForm />
        <MenuIcon className="mobile-menu" onClick={toggleMobileMenu} />
      </div>
      {menuModal && <MenuModal onClose={toggleMobileMenu} />}
    </header>
  );
};

export default Header;
