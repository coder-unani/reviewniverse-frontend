import React from "react";
import { DEFAULT_IMAGES } from "/src/config/constants";
import "/src/styles/PeopleImage.css";

const PeopleImage = (props) => {
  const { image, size } = props;
  const peopleImage = image || DEFAULT_IMAGES.noActor;
  const style = size ? { width: `${size}px`, height: `${size}px` } : {};

  return (
    <figure className="people-image" style={style}>
      <img src={peopleImage} alt="프로필 이미지" />
    </figure>
  );
};

export default PeopleImage;
