import React from "react";
import CloseIcon from "/src/assets/button/close.svg?react";

const CloseButton = ({ onClose }) => {
  const handleClose = () => onClose?.();

  return (
    <button className="modal-close-button" onClick={handleClose}>
      <CloseIcon />
    </button>
  );
};

export default CloseButton;
