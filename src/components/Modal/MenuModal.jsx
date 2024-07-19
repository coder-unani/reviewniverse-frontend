import React, { useEffect, useRef, useState } from "react";
import Modal from "/src/components/Modal";
import ProfileButton from "/src/components/Button/Profile";
import { Link } from "react-router-dom";
import { RiCloseLine, RiArrowRightSLine } from "@remixicon/react";
import { DEFAULT_IMAGES } from "/src/config/constants";
import "/src/styles/MenuModal.css";

/**
 * TODO:
 * 1. 메뉴 애니메이션 추가
 */

const MenuModal = (props) => {
  const { onClose } = props;
  const modalRef = useRef();

  // 로그인 여부
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // 메뉴 모달 닫기
  const handleCloseButton = () => {
    onClose();
  };

  // 메뉴 모달 바깥 영역 클릭시 모달 닫기
  const handleModalClose = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  // 로그인 여부에 따라 프로필 또는 로그인 버튼 렌더링
  const renderProfileButton = () => {
    return (
      <ProfileButton
        image={user.profile_image}
        user={{ id: user.id, nickname: user.nickname }}
        onClose={handleCloseButton}
      />
    );
  };

  const renderLoginButton = () => {
    return (
      <Link to="/user/login" className="login" onClick={handleCloseButton}>
        <img src={DEFAULT_IMAGES.noProfile} alt="프로필 이미지" />
        로그인 해주세요
        <RiArrowRightSLine size={20} />
      </Link>
    );
  };

  return (
    <Modal>
      <div className="menu-modal" ref={modalRef} onClick={handleModalClose}>
        <div className="menu">
          <div className="top">
            <RiCloseLine size={30} fill="white" className="close" onClick={handleCloseButton} />
            <div className="menu-user">{user ? renderProfileButton() : renderLoginButton()}</div>
          </div>
          <div className="bottom">
            <p>메뉴</p>
            <ul className="menu-list">
              <li>
                <Link to="/" onClick={handleCloseButton}>
                  홈
                </Link>
              </li>
              <li>
                <Link to="/movie" onClick={handleCloseButton}>
                  영화
                </Link>
              </li>
              <li>
                <Link to="/series" onClick={handleCloseButton}>
                  시리즈
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
