import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer-container">
      <div className="footer-wrapper">
        <span className="footer-item">© {year}. Orbitcode Co. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
