import React from "react";
import { fRating } from "/src/utils/formatContent";

const RatingReview = ({ rating }) => {
  return (
    <div className="review-rating-wrapper">
      <div className="review-rating-range" data-index={Math.floor(fRating(rating))}>
        {Array.from({ length: Math.floor(fRating(rating)) }, (_, i) => (
          <div key={i} className="review-rating-fill" />
        ))}
      </div>
      <span className="review-rating-count">{Math.floor(fRating(rating))}</span>
    </div>
  );
};

export default RatingReview;
