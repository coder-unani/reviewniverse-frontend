import React from "react";
import { Link } from "react-router-dom";
import ProfileImage from "/src/components/Button/Profile/ProfileImage";
import "/src/styles/ProfileButton.css";

const ProfileButton = ({ image, user, onClose }) => {
  const handleMobileMenuClose = () => {
    onClose?.();
  };

  return (
    <Link className="profile" to={`/user/${user.id}`} onClick={handleMobileMenuClose}>
      <ProfileImage image={image} size={28} />
      <span className="nickname">{user.nickname}</span>
    </Link>
  );
};

export default ProfileButton;
