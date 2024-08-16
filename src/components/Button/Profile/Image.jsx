import React from "react";

const ProfileImage = ({ image, size }) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : {};

  return (
    <div className="profile-image-wrapper" style={style}>
      <img className="profile-image" src={image} alt="프로필 이미지" />
    </div>
  );
};

export default ProfileImage;
