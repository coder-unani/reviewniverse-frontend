import React, { useState } from "react";
import ProfileButton from "/src/components/Button/Profile";
import ReviewRating from "/src/components/ReviewRating";
import { DEFAULT_ICONS } from "/src/config/constants";
import { diffDate } from "/src/utils/format";

/**
 * TODO:
 * 1. 리뷰 스포일러 기능
 * 2. 리뷰 클릭시 리뷰 모달 열기
 */

const VideoReviewItem = ({ review, isLike, onLikeClick }) => {
  const [active, setActive] = useState(review.is_spoiler);
  const handleReviewLike = (reviewId) => onLikeClick(reviewId);

  const handleSpoiler = () => {
    if (!active) return;
    setActive(!active);
  };

  return (
    <div className="detail-review-item">
      <div className="detail-review-header">
        <ProfileButton
          image={review.user_profile_image}
          user={{ id: review.user_id, nickname: review.user_nickname }}
        />
        {review.rating && <ReviewRating rating={review.rating} />}
      </div>
      <div className="detail-review-body" data-spoiler={review.is_spoiler}>
        {review.is_spoiler ? (
          <p className="detail-review-content" data-active={active} onClick={handleSpoiler}>
            {review.title}
          </p>
        ) : (
          <p className="detail-review-content">{review.title}</p>
        )}
      </div>
      <div className="detail-review-footer">
        <span className="detail-review-date">{diffDate(review.created_at)}</span>
        <button type="button" className="review-like-button" onClick={() => handleReviewLike(review.id)}>
          <img src={isLike ? DEFAULT_ICONS.fillThumb2 : DEFAULT_ICONS.outlineThumb2} alt="좋아요" />
          <span className="review-like-count">{review.like_count}</span>
        </button>
      </div>
    </div>
  );
};

export default VideoReviewItem;
