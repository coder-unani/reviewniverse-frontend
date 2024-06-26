import React, { useRef } from "react";
import Modal from "/src/components/Modal/Modal";
import { Link } from "react-router-dom";
import { RiCloseLine } from "@remixicon/react";
import "/src/styles/EnjoyModal.css";

const EnjoyModal = (props) => {
  const { onClose } = props;
  const modalRef = useRef();

  // 모달 바깥 영역 클릭시 모달 닫기
  const handleModalClose = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  const handleCloseButton = () => {
    onClose();
  };

  return (
    <Modal>
      <div className="enjoy-modal" ref={modalRef} onClick={handleModalClose}>
        <div className="enjoy">
          <RiCloseLine size={28} className="close" onClick={handleCloseButton} />
          <div className="content">
            <img src="/src/assets/enjoy.png" alt="enjoy" />
            <p>로그인이 필요한 기능이에요!</p>
          </div>
          <div className="button-wrapper">
            <Link to="/user/join" className="join">
              회원가입
            </Link>
            <Link to="/user/login" className="login">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EnjoyModal;
