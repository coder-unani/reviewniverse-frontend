import React from "react";
import { useModalContext } from "/src/context/ModalContext";
import { DEFAULT_IMAGES } from "/src/config/constants";

const Footer = () => {
  const year = new Date().getFullYear();
  const { toggleTermsModal, togglePrivacyModal } = useModalContext();

  return (
    <footer className="footer-container">
      <section className="footer-wrapper">
        <div className="footer-item-container">
          <ul className="footer-service-wrapper">
            <li onClick={toggleTermsModal}>리뷰니버스 이용약관</li>
            <li onClick={togglePrivacyModal}>개인정보 처리방침</li>
          </ul>
        </div>
        <div className="footer-item-container">
          <ul className="footer-contact-wrapper">
            <li>고객센터</li>
            <li>help@orbitcode.kr</li>
          </ul>
          <ul className="footer-contact-wrapper">
            <li>제휴 및 협력 문의</li>
            <li>help@orbitcode.kr</li>
          </ul>
        </div>
        <div className="footer-item-container">
          <ul className="footer-copyright-wrapper">
            {/* <li className="footer-logo">
              <img src={DEFAULT_IMAGES.logoWhite} alt="logo" />
            </li> */}
            <li className="footer-copyright">© {year}. Orbitcode Co. All rights reserved.</li>
          </ul>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
