import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import PopupBanner from "/src/components/Banner/Popup";
import EnjoyModal from "/src/components/Modal/Enjoy";
import ConfirmModal from "/src/components/Modal/Confirm";
import TermsModal from "/src/components/Modal/Terms";
import PrivacyModal from "/src/components/Modal/Privacy";
import PrivacyCollectionModal from "/src/components/Modal/PrivacyCollection";
import { setStorageHasVisited, getStorageHasVisited, getStorageHidePopupBanner } from "/src/utils/formatStorage";
import { EndpointManager, ENDPOINTS } from "/src/config/endpoints";

/**
 * TODO:
 * - 팝업 모달
 */

const ModalContext = createContext();

const ModalContextProvider = ({ children }) => {
  const location = useLocation();
  const [isPopupBanner, setIsPopupBanner] = useState(false);
  const [isEnjoyModal, setIsEnjoyModal] = useState(false);
  const [isReviewModal, setIsReviewModal] = useState(false);
  const [isTermsModal, setIsTermsModal] = useState(false);
  const [isPrivacyModal, setIsPrivacyModal] = useState(false);
  const [isPrivcayCollectionModal, setIsPrivacyCollectionModal] = useState(false);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmResolve, setConfirmResolve] = useState(null);

  /*
  // 팝업 배너
  useEffect(() => {
    // location.pathname이 /users 하위일 경우 팝업 모달창 띄우지 않기
    if (location.pathname.includes("/users")) return;

    const hidePopupBanner = getStorageHidePopupBanner();
    if (hidePopupBanner) return;

    const hasVisited = getStorageHasVisited();
    if (location.pathname !== ENDPOINTS.HOME && hasVisited) {
      if (isPopupBanner) setIsPopupBanner(false);
      return;
    }

    setIsPopupBanner(true);
    setStorageHasVisited(true);
  }, [location]);
  */

  useEffect(() => {
    if (isEnjoyModal) setIsEnjoyModal(false);
    if (isReviewModal) setIsReviewModal(false);
    if (isTermsModal) setIsTermsModal(false);
    if (isPrivacyModal) setIsPrivacyModal(false);
    if (isPrivcayCollectionModal) setIsPrivacyCollectionModal(false);
    if (isConfirmModal) setIsConfirmModal(false);
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

  // 개인정보 수집 및 이용 동의 모달창 토글
  const togglePrivacyCollectionModal = () => {
    setIsPrivacyCollectionModal((prev) => !prev);
  };

  // 확인 모달창 토글
  const toggleConfirmModal = (message, resolve) => {
    // 메세지 설정
    setConfirmMessage(message);
    // 확인 결과를 처리할 함수 설정
    setConfirmResolve(() => resolve);
    // 확인 모달창 열기
    setIsConfirmModal(true);
  };

  // 확인 모달창 닫기
  const handleConfirm = (result) => {
    if (confirmResolve) {
      confirmResolve(result);
      setConfirmResolve(null);
    }
    setIsConfirmModal(false);
  };

  const values = useMemo(
    () => ({
      isReviewModal,
      toggleEnjoyModal,
      toggleReviewModal,
      toggleTermsModal,
      togglePrivacyModal,
      togglePrivacyCollectionModal,
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
      {isPrivcayCollectionModal && <PrivacyCollectionModal onClose={togglePrivacyCollectionModal} />}
      {isConfirmModal && (
        <ConfirmModal onClose={() => handleConfirm(false)} onConfirm={() => handleConfirm(true)}>
          {confirmMessage}
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
