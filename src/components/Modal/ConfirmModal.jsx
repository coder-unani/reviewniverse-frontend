import React, { useRef } from "react";
import Modal from "/src/components/Modal/Modal";
import "/src/styles/ConfirmModal.css";

const ConfirmModal = (props) => {
  const { onClose } = props;
  const modalRef = useRef();

  // 리뷰 모달 바깥 영역 클릭시 모달 닫기
  const handleModalClose = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  const handleCloseButton = () => {
    onClose();
  };

  return (
    <Modal>
      <div className="confirm-modal" ref={modalRef} onClick={handleModalClose}>
        <div className="confirm"></div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
