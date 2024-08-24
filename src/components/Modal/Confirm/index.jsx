import React, { useRef } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ConfirmModal = React.memo(({ children, onClose, onConfirm }) => {
  const modalRef = useRef();

  const handleModalClose = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  const handleConfirmClick = () => {
    onConfirm(true);
    onClose();
  };

  const handleCancelClick = () => {
    onConfirm(false);
    onClose();
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.56)",
          zIndex: 998,
        },
        content: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "0",
          border: "none",
          background: "transparent",
          overflow: "visible",
          zIndex: 999,
        },
      }}
    >
      <main className="confirm-modal-container" ref={modalRef} onClick={handleModalClose}>
        <section className="confirm-modal-wrapper">
          <section className="confirm-header-section">
            <h4 className="confirm-header-title">알림</h4>
          </section>
          <section className="confirm-body-section">
            <p className="confirm-body-content">{children}</p>
          </section>
          <section className="confirm-footer-section">
            <button type="button" className="modal-cancel-button" onClick={handleCancelClick}>
              취소
            </button>
            |
            <button type="button" className="modal-confirm-button" onClick={handleConfirmClick}>
              확인
            </button>
          </section>
        </section>
      </main>
    </Modal>
  );
});

export default ConfirmModal;
