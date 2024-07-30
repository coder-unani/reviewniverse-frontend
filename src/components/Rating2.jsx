import React, { useRef, useEffect, useState } from "react";
import { useAuthContext } from "/src/context/AuthContext";
import { useVideoRating } from "/src/hooks/useVideoRating";
import { DEFAULT_IMAGES, VIDEO_RATING_TEXT } from "/src/config/constants";
import "/src/styles/Rating2.css";

const Rating = ({ videoId, myInfo, toggleEnjoyModal }) => {
  const { user } = useAuthContext();
  const [imgSrc, setImgSrc] = useState(DEFAULT_IMAGES.noImage);
  const ratingRef = useRef(null);
  const ratingImgRef = useRef(null);
  const { mutate: videoRating } = useVideoRating();

  // 비디오 평가하기
  const handleRatingSet = (rating) => {
    // 1~10까지의 rating을 0~5까지로 변환
    const ceilRating = Math.ceil(rating / 2);
    const barRating = ratingRef.current;
    barRating.dataset.rating = ceilRating;
    const text = document.querySelector("#ratingText");
    text.innerText = ceilRating === 0 ? "평가하기" : `${VIDEO_RATING_TEXT[ceilRating - 1]}`;
    if (ceilRating === 0) {
      setImgSrc(DEFAULT_IMAGES.noImage);
    } else {
      setImgSrc(`/assets/rating-${ceilRating}.png`);
    }
  };

  // 비디오 평가하기 이벤트
  const handleRatingMouseOver = (e) => {
    const rating = e.target.dataset.rating;
    if (!rating) return;
    handleRatingSet(rating * 2);
  };

  const handleRatingMouseOut = (e) => {
    const barRating = ratingRef.current;
    if (!barRating.contains(e.relatedTarget)) {
      handleRatingSet(myInfo && myInfo.rating ? myInfo.rating : 0);
    }
  };

  const handleRatingClick = async () => {
    if (!user) {
      toggleEnjoyModal();
      return;
    }
    const rating = ratingRef.current.dataset.rating;
    videoRating({ videoId, rating: rating * 2 });
  };

  useEffect(() => {
    const barRating = ratingRef.current;
    if (!barRating) return;

    if (user && myInfo) handleRatingSet(myInfo.rating || 0);

    barRating.addEventListener("mouseover", handleRatingMouseOver);
    barRating.addEventListener("mouseout", handleRatingMouseOut);
    barRating.addEventListener("click", handleRatingClick);

    return () => {
      barRating.removeEventListener("mouseover", handleRatingMouseOver);
      barRating.removeEventListener("mouseout", handleRatingMouseOut);
      barRating.removeEventListener("click", handleRatingClick);
    };
  }, [user, myInfo]);

  return (
    <div className="bar-rating-wrapper">
      <span id="ratingText">평가하기</span>
      <div className="bar-rating" ref={ratingRef}>
        <div className="bars">
          <div className="bar" data-rating="1"></div>
          <div className="bar" data-rating="2"></div>
          <div className="bar" data-rating="3"></div>
          <div className="bar" data-rating="4"></div>
          <div className="bar" data-rating="5"></div>
        </div>
      </div>
      <figure className="bar-rating-image">
        <img src={imgSrc} alt="평가 이미지" ref={ratingImgRef} />
      </figure>
    </div>
  );
};

export default Rating;
