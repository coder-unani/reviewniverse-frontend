import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import EnjoyModal from "/src/components/Modal/Enjoy";
import ConfirmModal from "/src/components/Modal/Confirm";

const ModalContext = createContext();

const ModalContextProvider = ({ children }) => {
  const location = useLocation();
  const [enjoyModal, setEnjoyModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    if (enjoyModal) setEnjoyModal(false);
    if (reviewModal) setReviewModal(false);
    if (confirmModal) setConfirmModal(false);
  }, [location]);

  // 로그인 모달창 토글
  const toggleEnjoyModal = () => {
    setEnjoyModal(!enjoyModal);
  };

  // 리뷰 모달창 토글
  const toggleReviewModal = () => {
    setReviewModal(!reviewModal);
  };

  // 확인 모달창 토글
  const toggleConfirmModal = () => {
    setConfirmModal(!confirmModal);
  };

  const values = useMemo(
    () => ({
      enjoyModal,
      reviewModal,
      confirmModal,
      toggleEnjoyModal,
      toggleReviewModal,
      toggleConfirmModal,
    }),
    [enjoyModal, reviewModal, confirmModal]
  );

  return (
    <ModalContext.Provider value={values}>
      {children}
      {enjoyModal && <EnjoyModal onClose={toggleEnjoyModal} />}
      {confirmModal && <ConfirmModal onClose={toggleConfirmModal} />}
    </ModalContext.Provider>
  );
};

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within an ModalContextProvider");
  }
  return context;
};

export { ModalContextProvider, useModalContext };
