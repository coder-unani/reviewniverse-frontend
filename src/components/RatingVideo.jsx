import React, { useRef, useEffect, useState } from "react";
import { useAuthContext } from "/src/context/AuthContext";
import { useVideoRating } from "/src/hooks/useVideoRating";
import { VIDEO_RATING_TEXT } from "/src/config/constants";

const RatingVideo = ({ videoId, myInfo, toggleEnjoyModal }) => {
  const { user } = useAuthContext();
  const [imgSrc, setImgSrc] = useState("/assets/rating/0.png");
  const ratingRef = useRef(null);
  const ratingImgRef = useRef(null);
  const { mutate: videoRating } = useVideoRating();

  // 비디오 평가하기
  const handleRatingSet = (rating) => {
    // 1~10까지의 rating을 0~5까지로 변환
    const floorRating = Math.floor(rating / 2);
    const barRating = ratingRef.current;
    barRating.dataset.rating = floorRating;
    const text = document.querySelector("#ratingText");
    text.innerText = VIDEO_RATING_TEXT[floorRating];
    setImgSrc(`/assets/rating/${floorRating}.png`);
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

  const handleRatingClick = async (e) => {
    if (!user) {
      toggleEnjoyModal();
      return;
    }
    const rating = e.target.dataset.rating;
    if (!rating) return;
    videoRating({ videoId, rating: rating * 2, userId: user.id });
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
    <div className="video-rating-container">
      <div className="video-rating-image-wrapper">
        <img className="video-rating-image" src={imgSrc} alt="평가 이미지" ref={ratingImgRef} />
      </div>
      <div className="video-rating-range-wrapper">
        <span id="ratingText" className="video-rating-text">
          {VIDEO_RATING_TEXT[0]}
        </span>
        <div className="video-rating-range" ref={ratingRef}>
          <div className="video-rating-fill" data-rating="1"></div>
          <div className="video-rating-fill" data-rating="2"></div>
          <div className="video-rating-fill" data-rating="3"></div>
          <div className="video-rating-fill" data-rating="4"></div>
          <div className="video-rating-fill" data-rating="5"></div>
        </div>
      </div>
    </div>
  );
};

export default RatingVideo;
