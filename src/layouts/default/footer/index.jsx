import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer-wrapper">
      <div className="footer">
        <div className="left">
          <span>© {year}. Orbitcode Co. All rights reserved.</span>
        </div>
        <div className="right"></div>
      </div>
    </footer>
  );
};

export default Footer;
