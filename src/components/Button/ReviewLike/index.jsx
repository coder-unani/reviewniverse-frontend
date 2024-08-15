import React from "react";
import { useAuthContext } from "/src/context/AuthContext";
import { useModalContext } from "/src/context/ModalContext";
import { useReviewLike } from "/src/hooks/useReviewLike";
import { DEFAULT_ICONS } from "/src/config/constants";

const ReviewLikeButton = ({ videoId, review, setReview = null }) => {
  const { toggleEnjoyModal } = useModalContext();
  const { user } = useAuthContext();
  const { mutateAsync: reviewLike } = useReviewLike();
  const isLike = review.my_info ? review.my_info.is_like : false;

  const handleReviewLike = async () => {
    if (!user) {
      toggleEnjoyModal();
      return;
    }

    const res = await reviewLike({ videoId, reviewId: review.id, userId: user.id });
    if (setReview) {
      setReview((prev) => {
        return {
          ...prev,
          like_count: res.data.like_count,
          my_info: { is_like: res.data.is_like },
        };
      });
    }
  };

  return (
    <button type="button" className="review-like-button" onClick={handleReviewLike}>
      <img src={isLike ? DEFAULT_ICONS.fillThumb2 : DEFAULT_ICONS.outlineThumb2} alt="좋아요" />
      <span className="review-like-count" data-like={isLike}>
        {review.like_count}
      </span>
    </button>
  );
};

export default ReviewLikeButton;
