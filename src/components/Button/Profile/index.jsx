import React from "react";
import { Link } from "react-router-dom";
import ProfileImage from "/src/components/Button/Profile/ProfileImage";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { isEmpty } from "lodash";

const ProfileButton = ({ user, size, onClose }) => {
  const profileLink = user ? `/user/${user.id}` : "";
  const profileImage = user ? user.profile_image : DEFAULT_IMAGES.noProfile;
  const profileNickname = user ? user.nickname : "탈퇴한 회원 입니다.";

  const handleMobileMenuClose = () => {
    onClose?.();
  };

  return (
    <Link className="profile" data-active={!isEmpty(user)} to={profileLink} onClick={handleMobileMenuClose}>
      <ProfileImage image={profileImage} size={size} />
      <span className="profile-nickname">{profileNickname}</span>
    </Link>
  );
};

export default ProfileButton;
