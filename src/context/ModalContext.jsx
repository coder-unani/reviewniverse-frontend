import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import PopupBanner from "/src/components/Banner/Popup";
import EnjoyModal from "/src/components/Modal/Enjoy";
import ConfirmModal from "/src/components/Modal/Confirm";
import TermsModal from "/src/components/Modal/Terms";
import PrivacyModal from "/src/components/Modal/Privacy";
import { getStorageHidePopupBanner } from "/src/utils/formatStorage";

/**
 * TODO:
 * - 팝업 모달
 * - 사이트 첫 진입시 팝업 모달창 띄우기
 * - HIDE_POPUP_BANNER 쿠키값이 true일 경우 팝업 모달창 띄우지 않기
 */

const ModalContext = createContext();

const ModalContextProvider = ({ children }) => {
  const location = useLocation();
  const [isPopupBanner, setIsPopupBanner] = useState(false);
  const [isEnjoyModal, setIsEnjoyModal] = useState(false);
  const [isReviewModal, setIsReviewModal] = useState(false);
  const [isTermsModal, setIsTermsModal] = useState(false);
  const [isPrivacyModal, setIsPrivacyModal] = useState(false);
  const [isReviewDeleteModal, setIsReviewDeleteModal] = useState(false);
  const [confirmResolve, setConfirmResolve] = useState(null);

  useEffect(() => {
    const hidePopupBanner = getStorageHidePopupBanner();
    if (hidePopupBanner) return;
    setIsPopupBanner(true);
  }, []);

  useEffect(() => {
    if (isEnjoyModal) setIsEnjoyModal(false);
    if (isReviewModal) setIsReviewModal(false);
    if (isTermsModal) setIsTermsModal(false);
    if (isPrivacyModal) setIsPrivacyModal(false);
    if (isReviewDeleteModal) setIsReviewDeleteModal(false);
  }, [location]);

  // 팝업 배너 토글
  const togglePopupBanner = () => {
    setIsPopupBanner((prev) => !prev);
  };

  // 로그인 모달창 토글
  const toggleEnjoyModal = () => {
    setIsEnjoyModal((prev) => !prev);
  };

  // 리뷰 모달창 토글
  const toggleReviewModal = () => {
    setIsReviewModal((prev) => !prev);
  };

  // 약관 모달창 토글
  const toggleTermsModal = () => {
    setIsTermsModal((prev) => !prev);
  };

  // 개인정보 처리방침 모달창 토글
  const togglePrivacyModal = () => {
    setIsPrivacyModal((prev) => !prev);
  };

  // 확인 모달창 토글
  const toggleConfirmModal = (resolve) => {
    setConfirmResolve(() => resolve);
    setIsReviewDeleteModal(true);
  };

  const handleConfirm = (result) => {
    if (confirmResolve) {
      confirmResolve(result);
      setConfirmResolve(null);
    }
    setIsReviewDeleteModal(false);
  };

  const values = useMemo(
    () => ({
      isReviewModal,
      toggleEnjoyModal,
      toggleReviewModal,
      toggleTermsModal,
      togglePrivacyModal,
      toggleConfirmModal,
    }),
    [isReviewModal]
  );

  return (
    <ModalContext.Provider value={values}>
      {children}
      {isPopupBanner && <PopupBanner onClose={togglePopupBanner} />}
      {isEnjoyModal && <EnjoyModal onClose={toggleEnjoyModal} />}
      {isTermsModal && <TermsModal onClose={toggleTermsModal} />}
      {isPrivacyModal && <PrivacyModal onClose={togglePrivacyModal} />}
      {isReviewDeleteModal && (
        <ConfirmModal onClose={() => handleConfirm(false)} onConfirm={handleConfirm}>
          리뷰를 삭제하시겠어요?
        </ConfirmModal>
      )}
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
