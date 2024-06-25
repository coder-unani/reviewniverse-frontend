import React from "react";
import ProfileButton from "/src/components/Button/ProfileButton";
import { RiStarFill, RiThumbUpLine, RiThumbUpFill } from "@remixicon/react";
import { diffDate } from "/src/utils/format";
import { formatRating } from "/src/utils/contentFormat";

/**
 * TODO:
 * 1. 리뷰 스포일러 기능
 * 2. 리뷰 클릭시 리뷰 모달 열기
 */

const Review = (props) => {
  const { review } = props;

  return (
    <div className="review">
      <div className="top">
        <ProfileButton image={review.user_profile_img} nickname={review.user_nickname} />
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
        <button className="like">
          <RiThumbUpLine size={16} />
          <span>{review.like_count}</span>
        </button>
      </div>
    </div>
  );
};

export default Review;
