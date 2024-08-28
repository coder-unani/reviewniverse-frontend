import React, { useRef, useEffect, useState } from "react";
import { useAuthContext } from "/src/context/AuthContext";
import { useModalContext } from "/src/context/ModalContext";
import { useVideoDetailContext } from "/src/context/VideoDetailContext";
import { useVideoRating } from "/src/hooks/useVideoRating";
import { Tooltip } from "react-tooltip";
import { showSuccessToast } from "/src/components/Toast";
import { fRating, fRatingColor } from "/src/utils/formatContent";
import { VIDEO_RATING_TEXT } from "/src/config/constants";

const RatingVideo = () => {
  const { user } = useAuthContext();
  const { toggleEnjoyModal } = useModalContext();
  const { videoId, myInfo } = useVideoDetailContext();
  const { mutate: videoRating, isPending: isRatingPending } = useVideoRating();
  const [imgSrc, setImgSrc] = useState("/assets/rating/0.png");
  const ratingRef = useRef(null);
  const ratingImgRef = useRef(null);
  const ratingTextRef = useRef(null);

  // 비디오 평가하기 이미지 및 텍스트 설정
  const handleRatingSet = (rating) => {
    if (ratingRef.current && ratingTextRef.current) {
      ratingRef.current.dataset.rating = rating;
      ratingTextRef.current.innerText = VIDEO_RATING_TEXT[rating];
    }
    setImgSrc(`/assets/rating/${rating}.png`);
  };

  // 비디오 평가하기 마우스 올렸을 때 이벤트
  const handleRatingMouseOver = (e) => {
    if (isRatingPending) return;
    const rating = e.target.dataset.rating;
    if (!rating) return;
    handleRatingSet(rating);
  };

  // 비디오 평가하기 마우스 벗어났을 때 이벤트
  const handleRatingMouseOut = (e) => {
    if (isRatingPending) return;
    if (ratingRef.current && !ratingRef.current.contains(e.relatedTarget)) {
      handleRatingSet(myInfo && myInfo.rating ? myInfo.rating : 0);
    }
  };

  // 비디오 평가하기 클릭 이벤트
  const handleRatingClick = async (e) => {
    if (!user) {
      toggleEnjoyModal();
      return;
    }
    if (isRatingPending) return;

    const rating = e.target.dataset.rating;
    if (!rating) return;

    // 평가하기 API 호출
    await videoRating(
      { videoId, rating: rating, userId: user.id },
      {
        onSuccess: (res) => {
          if (res.status === 200) {
            const resRating = res.data.data.rating;
            if (resRating) {
              showSuccessToast(`평점 ${resRating / 2}점이 입력되었습니다.`);
            } else {
              showSuccessToast("입력된 평점이 삭제되었습니다.");
            }
          }
        },
      }
    );
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
  }, [user, myInfo, isRatingPending]);

  return (
    <article className="video-rating-container">
      <div className="video-rating-image-wrapper">
        <img className="video-rating-image" src={imgSrc} alt="평가 이미지" ref={ratingImgRef} />
      </div>
      <div className="video-rating-range-wrapper">
        <span id="ratingText" className="video-rating-text" ref={ratingTextRef}>
          {VIDEO_RATING_TEXT[0]}
        </span>
        <div className="video-rating-range" ref={ratingRef}>
          {Array.from({ length: 10 }, (_, i) => (
            <div
              id={`video-rating-${i + 1}`}
              className="video-rating-fill"
              data-rating={i + 1}
              data-color={fRatingColor(i + 1)}
              key={i}
            ></div>
          ))}
        </div>
        {Array.from({ length: 10 }, (_, i) => (
          <Tooltip
            className="video-rating-tooltip"
            anchorSelect={`#video-rating-${i + 1}`}
            content={`${fRating(i + 1)}점`}
            place="bottom"
            key={i}
          />
        ))}
      </div>
    </article>
  );
};

export default RatingVideo;
