import React from "react";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const PeopleImage = ({ image, size }) => {
  const peopleImage = image || DEFAULT_IMAGES.noActor;
  const style = size ? { width: `${size}px`, height: `${size}px` } : {};

  return (
    <figure className="people-image" style={style}>
      <LazyLoadImage src={peopleImage} alt="프로필 이미지" effect="blur" />
    </figure>
  );
};

export default PeopleImage;
