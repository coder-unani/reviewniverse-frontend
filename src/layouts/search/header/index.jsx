import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuModal from "/src/components/Modal/MenuModal";
import SearchForm from "/src/components/SearchForm";
import { RiMenu3Line } from "@remixicon/react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
        <RiMenu3Line size={32} className="mobile-menu" onClick={toggleMobileMenu} />
      </div>
      {menuModal && <MenuModal onClose={toggleMobileMenu} />}
    </header>
  );
};

export default Header;
