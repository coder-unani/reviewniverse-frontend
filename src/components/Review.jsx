import React from "react";
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
  const handleReviewLike = (reviewId) => onLikeClick(reviewId);

  return (
    <div className="review">
      <div className="top">
        <ProfileButton
          image={review.user_profile_image}
          user={{ id: review.user_id, nickname: review.user_nickname }}
        />
        {review.rating && (
          <div className="rating">
            <div className="bars" data-index={Math.floor(formatRating(review.rating))}>
              {Array.from({ length: Math.floor(formatRating(review.rating)) }, (_, i) => (
                <div key={i} className="bar" />
              ))}
            </div>
            <span>{Math.floor(formatRating(review.rating))}</span>
          </div>
        )}
      </div>
      <div className="middle">
        <p>{review.title}</p>
      </div>
      <div className="bottom">
        <span>{diffDate(review.created_at)}</span>
        <button className="like" onClick={() => handleReviewLike(review.id)}>
          {isLike ? (
            <img src={DEFAULT_ICONS.fillThumb2} alt="좋아요" />
          ) : (
            <img src={DEFAULT_ICONS.outlineThumb2} alt="좋아요" />
          )}
          <span>{review.like_count}</span>
        </button>
      </div>
    </div>
  );
};

export default Review;
