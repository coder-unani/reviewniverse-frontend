import React, { useEffect } from "react";
import ModalContainer from "/src/components/Modal/Container";

const Modal = ({ children }) => {
  // 모달 오픈 시 body 스크롤 방지
  useEffect(() => {
    const $body = document.querySelector("body");
    const overflow = $body.style.overflow;
    $body.style.overflow = "hidden";
    return () => {
      $body.style.overflow = overflow;
    };
  }, []);

  return <ModalContainer>{children}</ModalContainer>;
};

export default Modal;
