import React from "react";
import RatingVideo from "/src/components/RatingVideo";
import { useVideoDetailContext } from "/src/context/VideoDetailContext";

const VideoSectionMyRating = React.memo(() => {
  const { myInfo } = useVideoDetailContext();
  const rating = myInfo && myInfo.rating ? Math.floor(myInfo.rating / 2) : 0;
  const ratingText = rating > 0 ? rating : "-";

  return (
    <section className="detail-my-rating-section">
      <h4 className="detail-main-title">평가하기</h4>
      <div className="detail-my-rating">
        <span className="my-rating-text number" data-index={rating}>
          {ratingText}
        </span>
        <span className="my-rating-text">/</span>
        <span className="my-rating-text">5</span>
      </div>
      <RatingVideo />
    </section>
  );
});

export default VideoSectionMyRating;
