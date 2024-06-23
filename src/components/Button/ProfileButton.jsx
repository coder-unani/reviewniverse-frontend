import React from "react";
import "/src/styles/ProfileButton.css";

const ProfileButton = (props) => {
  const { image, nickname } = props;
  const profileImage = image || "/src/assets/no-profile.png";

  return (
    <button className="profile" type="button">
      <figure>
        <img src={profileImage} alt="프로필 이미지" />
      </figure>
      <span className="nickname">{nickname}</span>
    </button>
  );
};

export default ProfileButton;
