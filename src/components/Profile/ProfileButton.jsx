import React from "react";
import { Link } from "react-router-dom";
import ProfileImage from "/src/components/Profile/ProfileImage";
import "/src/styles/ProfileButton.css";

const ProfileButton = (props) => {
  const { image, user } = props;

  return (
    <Link className="profile" to={`/user/${user.id}`}>
      <ProfileImage image={image} size={28} />
      <span className="nickname">{user.nickname}</span>
    </Link>
  );
};

export default ProfileButton;
