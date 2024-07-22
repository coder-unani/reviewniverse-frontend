import React from "react";
import { DEFAULT_IMAGES } from "/src/config/constants";
import "/src/styles/ProfileImage.css";

const ProfileImage = ({ image, size }) => {
  const profileImage = image || DEFAULT_IMAGES.noProfile;
  const style = size ? { width: `${size}px`, height: `${size}px` } : {};

  return (
    <figure className="profile-image" style={style}>
      <img src={profileImage} alt="프로필 이미지" />
    </figure>
  );
};

export default ProfileImage;
