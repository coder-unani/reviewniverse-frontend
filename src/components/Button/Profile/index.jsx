import React from "react";
import { Link } from "react-router-dom";
import ProfileImage from "/src/components/Button/Profile/Image";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { EndpointManager, ENDPOINTS } from "/src/config/endpoints";
import { isEmpty } from "lodash";

const ProfileButton = ({ user, size, onClose }) => {
  const profilePath = user ? EndpointManager.generateUrl(ENDPOINTS.USER, { userId: user.id }) : "";
  const profileImage = user ? user.profile_image : DEFAULT_IMAGES.noActor;
  const profileNickname = user ? user.nickname : "탈퇴한 회원 입니다.";

  const handleMobileMenuClose = () => {
    onClose?.();
  };

  return (
    <Link to={profilePath} className="profile" data-active={!isEmpty(user)} onClick={handleMobileMenuClose}>
      <ProfileImage image={profileImage} size={size} />
      <span className="profile-nickname">{profileNickname}</span>
    </Link>
  );
};

export default ProfileButton;
