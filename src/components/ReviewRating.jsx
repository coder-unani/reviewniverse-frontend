import React from "react";
import { formatRating } from "/src/utils/formatContent";

const ReviewRating = ({ rating }) => {
  return (
    <div className="review-rating-wrapper">
      <div className="review-rating-range" data-index={Math.floor(formatRating(rating))}>
        {Array.from({ length: Math.floor(formatRating(rating)) }, (_, i) => (
          <div key={i} className="review-rating-fill" />
        ))}
      </div>
      <span className="review-rating-count">{Math.floor(formatRating(rating))}</span>
    </div>
  );
};

export default ReviewRating;
