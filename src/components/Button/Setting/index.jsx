import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { MESSAGES } from "/src/config/messages";
import { RiSettings2Fill } from "@remixicon/react";
import { showSuccessToast, showErrorToast } from "/src/components/Toast";

/**
 * TODO:
 * 1. 회원정보 수정: 회원정보 수정 페이지로 이동
 * 2. 로그아웃: 확인 모달, 메인페이지로 이동
 * 3. 회원탈퇴: 탈퇴페이지로 이동
 */

const SettingButton = () => {
  const [isMenuModal, setIsMenuModal] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const toggleMenuModal = () => {
    setIsMenuModal((prev) => !prev);
  };

  // 회원정보 수정
  const handleEditClick = () => {
    navigate("/user/profile");
  };

  // 로그아웃
  const handleLogoutClick = async () => {
    const res = await logout();
    if (res.status) {
      showSuccessToast(MESSAGES[res.code]);
      navigate("/");
    } else {
      showErrorToast(MESSAGES[res.code]);
    }
  };

  // 회원탈퇴
  const handleDeleteClick = () => {
    navigate("/user/delete");
  };

  useEffect(() => {
    // 메뉴 바깥 영역 클릭시 메뉴 닫기
    const button = document.querySelector(".settings");

    window.addEventListener("click", (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target) && !button.contains(e.target)) {
        setIsMenuModal(false);
      }
    });
  }, []);

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
