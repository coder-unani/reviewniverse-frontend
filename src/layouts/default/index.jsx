import React from "react";
import { Outlet } from "react-router-dom";
import Header from "/src/layouts/default/header";
import Footer from "/src/layouts/default/footer";
import ScrollToTop from "/src/components/ScrollToTop";
import { MobileContextProvider } from "../../context/MobileContext";

const DefaultLayout = () => {
  return (
    <MobileContextProvider>
      <ScrollToTop />
      <div className="wrapper">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </MobileContextProvider>
  );
};

export default DefaultLayout;
