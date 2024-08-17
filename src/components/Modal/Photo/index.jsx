import React, { useRef } from "react";
import Modal from "/src/components/Modal";

const PhotoModal = React.memo(({ url, onClose }) => {
  const modalRef = useRef();

  // 이미지 바깥 영역 클릭시 모달 닫기
  const handleModalClose = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  return (
    <Modal>
      <div className="photo-modal" ref={modalRef} onClick={handleModalClose}>
        <img src={url} alt="스틸컷" />
      </div>
    </Modal>
  );
});

export default PhotoModal;
