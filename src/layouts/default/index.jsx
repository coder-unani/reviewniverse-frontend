import React from "react";
import { Outlet } from "react-router-dom";
import Header from "/src/layouts/default/header";
import Footer from "/src/layouts/default/footer";
import ScrollToTop from "/src/components/ScrollToTop";

const DefaultLayout = () => {
  return (
    <div className="wrapper">
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default DefaultLayout;
