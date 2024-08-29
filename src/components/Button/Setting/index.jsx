import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useModalContext } from "/src/context/ModalContext";
import { MESSAGES } from "/src/config/messages";
import { RiSettings2Fill } from "@remixicon/react";
import { showSuccessToast, showErrorToast } from "/src/components/Toast";
import { ENDPOINTS } from "/src/config/endpoints";

const SettingButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const { toggleConfirmModal } = useModalContext();
  const [isMenuModal, setIsMenuModal] = useState(false);
  const menuRef = useRef();

  // 메뉴 바깥 영역 클릭시 메뉴 닫기
  useEffect(() => {
    const button = document.querySelector(".settings");

    window.addEventListener("click", (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target) && !button.contains(e.target)) {
        setIsMenuModal(false);
      }
    });
  }, []);

  // 메뉴 모달 토글
  const toggleMenuModal = () => {
    setIsMenuModal((prev) => !prev);
  };

  // 회원정보 수정 페이지로 이동
  const handleEditClick = () => {
    navigate(ENDPOINTS.USER_PROFILE);
  };

  // 로그아웃
  const handleLogoutClick = async () => {
    toggleMenuModal();

    const confirmed = await new Promise((resolve) => {
      toggleConfirmModal("로그아웃 하시겠어요?", resolve);
    });

    if (confirmed) {
      const res = await logout();
      if (res.status) {
        showSuccessToast(MESSAGES[res.code]);
        navigate(ENDPOINTS.HOME);
      } else {
        showErrorToast(MESSAGES[res.code]);
      }
    }
  };

  // 회원탈퇴 페이지로 이동
  const handleDeleteClick = () => {
    navigate(ENDPOINTS.USER_DELETE);
  };

  return (
    <>
      <button type="button" className="settings" onClick={toggleMenuModal}>
        <RiSettings2Fill size={24} />
      </button>
      {isMenuModal && (
        <div className="user-menu" ref={menuRef}>
          <ul>
            <li onClick={handleEditClick}>회원정보 수정</li>
            <li onClick={handleLogoutClick}>로그아웃</li>
            <li className="delete" onClick={handleDeleteClick}>
              회원탈퇴
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default SettingButton;
