import React from "react";
import "/src/styles/ProfileButton.css";

const ProfileButton = (props) => {
  const { image, nickname } = props;
  const profileImage = image || "/src/assets/no-profile.png";

  return (
    <div className="profile">
      <figure>
        <img src={profileImage} alt="프로필 이미지" />
      </figure>
      <span className="nickname">{nickname}</span>
    </div>
  );
};

export default ProfileButton;
