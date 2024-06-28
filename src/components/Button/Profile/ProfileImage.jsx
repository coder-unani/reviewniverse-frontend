import React from "react";
import { DEFAULT_IMAGES } from "/src/config/images";
import "/src/styles/ProfileImage.css";

const ProfileImage = (props) => {
  const { image, size } = props;
  const profileImage = image || DEFAULT_IMAGES.noProfile;
  const style = size ? { width: `${size}px`, height: `${size}px` } : {};

  return (
    <figure className="profile-image" style={style}>
      <img src={profileImage} alt="프로필 이미지" />
    </figure>
  );
};

export default ProfileImage;
