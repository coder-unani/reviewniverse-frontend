import React, { useRef } from "react";
import Modal from "/src/components/Modal";
import { useNavigate } from "react-router-dom";
import { RiCloseLine } from "@remixicon/react";
import { DEFAULT_IMAGES } from "/src/config/constants";

const EnjoyModal = React.memo(({ onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef();

  // 모달 바깥 영역 클릭시 모달 닫기
  const handleModalClose = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  const handleCloseButton = () => {
    onClose();
  };

  const handleLoginButton = () => {
    navigate("/user/login");
  };

  return (
    <Modal>
      <div className="enjoy-modal" ref={modalRef} onClick={handleModalClose}>
        <div className="enjoy">
          <RiCloseLine size={28} className="close" onClick={handleCloseButton} />
          <div className="content">
            <img src={DEFAULT_IMAGES.userLogin} alt="회원 환영 이미지" />
            <p>로그인 후 이용할 수 있어요!</p>
          </div>
          <div className="button-wrapper">
            <button className="login" onClick={handleLoginButton}>
              로그인
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
});

export default EnjoyModal;
