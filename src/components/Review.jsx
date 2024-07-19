import React, { useEffect } from "react";
import ProfileButton from "/src/components/Button/Profile";
import { RiStarFill, RiThumbUpLine, RiThumbUpFill } from "@remixicon/react";
import { diffDate } from "/src/utils/format";
import { formatRating } from "/src/utils/formatContent";

/**
 * TODO:
 * 1. 리뷰 스포일러 기능
 * 2. 리뷰 클릭시 리뷰 모달 열기
 */

const Review = (props) => {
  const { review, isLike, onLikeClick } = props;

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
            <RiStarFill size={16} />
            <span>{formatRating(review.rating)}</span>
          </div>
        )}
      </div>
      <div className="middle">
        <p>{review.title}</p>
      </div>
      <div className="bottom">
        <span>{diffDate(review.created_at)}</span>
        <button className="like" onClick={() => handleReviewLike(review.id)}>
          {isLike ? <RiThumbUpFill size={16} /> : <RiThumbUpLine size={16} />}
          <span>{review.like_count}</span>
        </button>
      </div>
    </div>
  );
};

export default Review;
