import React, { useState, useEffect } from "react";
import ProfileButton from "/src/components/Button/Profile";
import RatingReview from "/src/components/RatingReview";
import ReviewLikeButton from "/src/components/Button/ReviewLike";
import { fDiffDate } from "/src/utils/format";

/**
 * TODO:
 * 1. 리뷰 스포일러 기능
 * 2. 리뷰 클릭시 리뷰 모달 열기
 */

const VideoReviewItem = ({ videoId, review }) => {
  const [data, setData] = useState(review);
  const [active, setActive] = useState(review.is_spoiler);

  useEffect(() => {
    setData(review);
    setActive(review.is_spoiler);
  }, [review]);

  const handleSpoiler = () => {
    if (!active) return;
    setActive(!active);
  };

  if (!data) return null;

  return (
    <div className="detail-review-item">
      <div className="detail-review-header">
        <ProfileButton user={data.user} size={36} />
        {data.rating && <RatingReview rating={data.rating} />}
      </div>
      <div className="detail-review-body" data-spoiler={data.is_spoiler}>
        {data.is_spoiler ? (
          <p className="detail-review-content" data-active={active} onClick={handleSpoiler}>
            {data.title}
          </p>
        ) : (
          <p className="detail-review-content">{data.title}</p>
        )}
      </div>
      <div className="detail-review-footer">
        <span className="detail-review-date">{fDiffDate(data.created_at)}</span>
        <ReviewLikeButton videoId={videoId} review={data} setReview={setData} />
      </div>
    </div>
  );
};

export default VideoReviewItem;
