import React from "react";
import { Outlet } from "react-router-dom";
import DefaultHeader from "/src/layouts/default/header";
import SearchHeader from "/src/layouts/search/header";
import Footer from "/src/layouts/default/footer";
import ScrollToTop from "/src/components/ScrollToTop";
import { useThemeContext } from "/src/context/ThemeContext";

const SearchLayout = () => {
  const { isMobile } = useThemeContext();
  const Header = isMobile ? SearchHeader : DefaultHeader;

  return (
    <div className="wrapper">
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default SearchLayout;
