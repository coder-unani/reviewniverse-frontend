import React, { useRef } from "react";
import Modal from "/src/components/Modal";
import CloseButton from "/src/components/Button/Close";
import { useNavigate } from "react-router-dom";
import { DEFAULT_IMAGES } from "/src/config/constants";

const EnjoyModal = React.memo(({ onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef();

  // 모달 바깥 영역 클릭시 모달 닫기
  const handleModalClose = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  const handleLoginButton = () => {
    navigate("/user/login");
  };

  return (
    <Modal>
      <div className="enjoy-modal" ref={modalRef} onClick={handleModalClose}>
        <main className="enjoy-modal-container">
          <section className="enjoy-modal-wrapper">
            <CloseButton onClose={onClose} />
            <div className="enjoy-modal-image-wrapper">
              <img className="enjoy-modal-image" src={DEFAULT_IMAGES.userLogin} alt="회원 환영 이미지" />
              <p className="enjoy-modal-content">로그인 후 이용할 수 있어요!</p>
            </div>
            <div className="enjoy-modal-button-wrapper">
              <button className="enjoy-modal-login-button" onClick={handleLoginButton}>
                로그인
              </button>
            </div>
          </section>
        </main>
      </div>
    </Modal>
  );
});

export default EnjoyModal;
