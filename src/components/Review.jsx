import React, { useState } from "react";
import ProfileButton from "/src/components/Button/Profile";
import { DEFAULT_ICONS } from "/src/config/constants";
import { diffDate } from "/src/utils/format";
import { formatRating } from "/src/utils/formatContent";

/**
 * TODO:
 * 1. 리뷰 스포일러 기능
 * 2. 리뷰 클릭시 리뷰 모달 열기
 */

const Review = ({ review, isLike, onLikeClick }) => {
  const [active, setActive] = useState(review.is_spoiler);
  const handleReviewLike = (reviewId) => onLikeClick(reviewId);

  const handleSpoiler = () => {
    // if (!active) return;
    setActive(!active);
  };

  return (
    <div className="review">
      <div className="review-header">
        <ProfileButton
          image={review.user_profile_image}
          user={{ id: review.user_id, nickname: review.user_nickname }}
        />
        {review.rating && (
          <div className="review-rating">
            <div className="rating-bars" data-index={Math.floor(formatRating(review.rating))}>
              {Array.from({ length: Math.floor(formatRating(review.rating)) }, (_, i) => (
                <div key={i} className="rating-bar" />
              ))}
            </div>
            <span className="rating-count">{Math.floor(formatRating(review.rating))}</span>
          </div>
        )}
      </div>
      {/* TODO: 고도화 */}
      <div className="review-content" data-spoiler={review.is_spoiler ? "spoiler" : ""}>
        {review.is_spoiler ? (
          <p className="content spoiler" data-active={active} onClick={handleSpoiler}>
            {review.title}
          </p>
        ) : (
          <p className="content">{review.title}</p>
        )}
      </div>
      <div className="review-footer">
        <span className="review-date">{diffDate(review.created_at)}</span>
        <button className="review-like" onClick={() => handleReviewLike(review.id)}>
          <img src={isLike ? DEFAULT_ICONS.fillThumb2 : DEFAULT_ICONS.outlineThumb2} alt="좋아요" />
          <span className="review-like-count">{review.like_count}</span>
        </button>
      </div>
    </div>
  );
};

export default Review;
