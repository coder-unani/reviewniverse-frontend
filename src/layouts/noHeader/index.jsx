import React from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "/src/components/ScrollToTop";

const NoHeaderLayout = () => {
  return (
    <div className="wrapper">
      <ScrollToTop />
      <Outlet />
    </div>
  );
};

export default NoHeaderLayout;
