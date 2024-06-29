import React, { useEffect, useRef, useState } from "react";
import { RiSettings2Fill } from "@remixicon/react";

/**
 * TODO:
 * 1. 회원정보 수정: 회원정보 수정 페이지로 이동
 * 2. 로그아웃: 확인 모달, 메인페이지로 이동
 * 3. 회원탈퇴: 확인 모달, 탈퇴페이지로 이동
 */

const SettingButton = () => {
  const [menuModal, isMenuModal] = useState(false);
  const menuRef = useRef();

  const toggleMenuModal = () => isMenuModal(!menuModal);

  const handleEditClick = () => {
    window.location.href = "/user/profile";
  };

  const handleLogoutClick = () => {
    // 로그아웃
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("access_token");
    window.location.href = "/";
  };

  useEffect(() => {
    // 메뉴 바깥 영역 클릭시 메뉴 닫기
    const button = document.querySelector(".settings");

    window.addEventListener("click", (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target) && !button.contains(e.target)) {
        isMenuModal(false);
      }
    });
  }, []);

  return (
    <>
      <button type="button" className="settings" onClick={toggleMenuModal}>
        <RiSettings2Fill size={24} />
      </button>
      {menuModal && (
        <div className="user-menu" ref={menuRef}>
          <ul>
            <li onClick={handleEditClick}>회원정보 수정</li>
            <li onClick={handleLogoutClick}>로그아웃</li>
            <li className="withdraw">회원탈퇴</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default SettingButton;
