import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import EnjoyModal from "/src/components/Modal/Enjoy";
import ConfirmModal from "/src/components/Modal/Confirm";
import TermsModal from "/src/components/Modal/Terms";
import PrivacyModal from "/src/components/Modal/Privacy";

const ModalContext = createContext();

const ModalContextProvider = ({ children }) => {
  const location = useLocation();
  const [isEnjoyModal, setIsEnjoyModal] = useState(false);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [isReviewModal, setIsReviewModal] = useState(false);
  const [isTermsModal, setIsTermsModal] = useState(false);
  const [isPrivacyModal, setIsPrivacyModal] = useState(false);

  useEffect(() => {
    if (isEnjoyModal) setIsEnjoyModal(false);
    if (isConfirmModal) setIsConfirmModal(false);
    if (isReviewModal) setIsReviewModal(false);
    if (isTermsModal) setIsTermsModal(false);
    if (isPrivacyModal) setIsPrivacyModal(false);
  }, [location]);

  // 로그인 모달창 토글
  const toggleEnjoyModal = () => {
    setIsEnjoyModal(!isEnjoyModal);
  };

  // 리뷰 모달창 토글
  const toggleReviewModal = () => {
    setIsReviewModal(!isReviewModal);
  };

  // 확인 모달창 토글
  const toggleConfirmModal = () => {
    setIsConfirmModal(!isConfirmModal);
  };

  // 약관 모달창 토글
  const toggleTermsModal = () => {
    setIsTermsModal(!isTermsModal);
  };

  // 개인정보 처리방침 모달창 토글
  const togglePrivacyModal = () => {
    setIsPrivacyModal(!isPrivacyModal);
  };

  const values = useMemo(
    () => ({
      isEnjoyModal,
      isConfirmModal,
      isReviewModal,
      isTermsModal,
      isPrivacyModal,
      toggleEnjoyModal,
      toggleConfirmModal,
      toggleReviewModal,
      toggleTermsModal,
      togglePrivacyModal,
    }),
    [isEnjoyModal, isConfirmModal, isReviewModal, isTermsModal, isPrivacyModal]
  );

  return (
    <ModalContext.Provider value={values}>
      {children}
      {isEnjoyModal && <EnjoyModal onClose={toggleEnjoyModal} />}
      {isConfirmModal && <ConfirmModal onClose={toggleConfirmModal} />}
      {isTermsModal && <TermsModal onClose={toggleTermsModal} />}
      {isPrivacyModal && <PrivacyModal onClose={togglePrivacyModal} />}
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
