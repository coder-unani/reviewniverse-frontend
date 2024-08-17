import React from "react";
import { useAuthContext } from "/src/context/AuthContext";
import { useModalContext } from "/src/context/ModalContext";

const ReviewButton = () => {
  const { user } = useAuthContext();
  const { toggleEnjoyModal, toggleReviewModal } = useModalContext();

  const handleReviewCreate = () => {
    if (!user) {
      toggleEnjoyModal();
      return;
    }
    toggleReviewModal();
  };

  return (
    <button type="button" className="detail-control review" onClick={handleReviewCreate}>
      <span className="detail-control-icon"></span>
    </button>
  );
};

export default ReviewButton;
