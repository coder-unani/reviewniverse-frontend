import React, { useRef } from "react";
import Modal from "/src/components/Modal";
import ProfileButton from "/src/components/Button/Profile";
import CloseButton from "/src/components/Button/Close";
import { useAuthContext } from "/src/context/AuthContext";
import { Link } from "react-router-dom";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { ENDPOINTS } from "/src/config/endpoints";
import ArrowRightIcon from "/src/assets/button/arrow-right.svg?react";

/**
 * TODO:
 * 1. 메뉴 애니메이션 추가
 */

const MenuModal = ({ onClose }) => {
  const { user } = useAuthContext();
  const modalRef = useRef();

  // 메뉴 모달 바깥 영역 클릭시 모달 닫기
  const handleModalClose = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  // 로그인 여부에 따라 프로필 또는 로그인 버튼 렌더링
  const renderProfileButton = () => {
    return <ProfileButton user={user} size={28} onClose={onClose} />;
  };

  const renderLoginButton = () => {
    return (
      <Link to={ENDPOINTS.USER_LOGIN} className="login" onClick={onClose}>
        <img src={DEFAULT_IMAGES.noActor} alt="프로필 이미지" />
        로그인 해주세요
        <ArrowRightIcon />
      </Link>
    );
  };

  return (
    <Modal>
      <div className="menu-modal" ref={modalRef} onClick={handleModalClose}>
        <div className="menu">
          <div className="top">
            <CloseButton onClose={onClose} />
            <div className="menu-user">{user ? renderProfileButton() : renderLoginButton()}</div>
          </div>
          <div className="bottom">
            <p>메뉴</p>
            <ul className="menu-list">
              <li>
                <Link to={ENDPOINTS.HOME} onClick={onClose}>
                  홈
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MenuModal;
