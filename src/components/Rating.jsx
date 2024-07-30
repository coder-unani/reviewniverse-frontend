import React, { useRef, useEffect } from "react";
import { useAuthContext } from "/src/context/AuthContext";
import { useVideoRating } from "/src/hooks/useVideoRating";
import { RiStarFill } from "@remixicon/react";

const Rating = ({ videoId, myInfo, toggleEnjoyModal }) => {
  const { user } = useAuthContext();
  const emptyRatingRef = useRef(null);
  const fillRatingRef = useRef(null);
  const { mutate: videoRating } = useVideoRating();

  // 비디오 평가하기
  const handleRatingSet = (rating) => {
    const fillRating = fillRatingRef.current;
    fillRating.dataset.rating = rating;
    fillRating.style.width = `${rating * 10}%`;
  };

  // 비디오 평가하기 이벤트
  const handleRatingMouseOver = (e) => {
    const emptyRating = emptyRatingRef.current;
    const width = emptyRating.getBoundingClientRect().width;
    const mouseX = e.clientX - emptyRating.getBoundingClientRect().left;
    const ratio = Math.max(0, Math.min(mouseX / width, 1));
    const rating = Math.ceil(ratio * 10);
    handleRatingSet(rating);
  };

  const handleRatingMouseOut = () => {
    handleRatingSet(myInfo && myInfo.rating ? myInfo.rating : 0);
  };

  const handleRatingClick = async () => {
    if (!user) {
      toggleEnjoyModal();
      return;
    }
    videoRating({ videoId, rating: fillRatingRef.current.dataset.rating });
  };

  useEffect(() => {
    const emptyRating = emptyRatingRef.current;
    const fillRating = fillRatingRef.current;

    if (!emptyRating || !fillRating) {
      return;
    }

    if (user && myInfo) {
      handleRatingSet(myInfo.rating || 0);
    }

    emptyRating.addEventListener("mouseover", handleRatingMouseOver);
    emptyRating.addEventListener("mouseout", handleRatingMouseOut);
    emptyRating.addEventListener("click", handleRatingClick);

    return () => {
      emptyRating.removeEventListener("mouseover", handleRatingMouseOver);
      emptyRating.removeEventListener("mouseout", handleRatingMouseOut);
      emptyRating.removeEventListener("click", handleRatingClick);
    };
  }, [user, myInfo]);

  return (
    <div className="rating-wrapper">
      <div className="empty-rating" ref={emptyRatingRef}>
        <RiStarFill size={45} />
        <RiStarFill size={45} />
        <RiStarFill size={45} />
        <RiStarFill size={45} />
        <RiStarFill size={45} />
      </div>
      <div className="fill-rating" ref={fillRatingRef}>
        <RiStarFill size={45} />
        <RiStarFill size={45} />
        <RiStarFill size={45} />
        <RiStarFill size={45} />
        <RiStarFill size={45} />
      </div>
      <span id="ratingText">평가하기</span>
    </div>
  );
};

export default Rating;
