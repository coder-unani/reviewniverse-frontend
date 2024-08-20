import React from "react";
import { useAuthContext } from "/src/context/AuthContext";
import { useModalContext } from "/src/context/ModalContext";
import { useReviewLike } from "/src/hooks/useReviewLike";
import { fNumberWithCommas } from "/src/utils/format";
import FillThumbIcon from "/src/assets/button/fill-thumb-2.svg?react";
import OutlineThumbIcon from "/src/assets/button/outline-thumb-2.svg?react";

const ReviewLikeButton = ({ videoId, review, setReview = null }) => {
  const { toggleEnjoyModal } = useModalContext();
  const { user } = useAuthContext();
  const { mutate: reviewLike, isPending: isLikePending } = useReviewLike();
  const isLike = user && review.my_info ? review.my_info.is_like : false;

  const handleReviewLike = async () => {
    if (!user) {
      toggleEnjoyModal();
      return;
    }
    if (isLikePending) {
      return;
    }
    await reviewLike(
      { videoId, reviewId: review.id, userId: user.id },
      {
        onSuccess: (res) => {
          if (res.status === 200 && setReview) {
            const likeCount = res.data.data.like_count;
            const isLike = res.data.data.is_like;
            setReview((prev) => {
              return { ...prev, like_count: likeCount, my_info: { is_like: isLike } };
            });
          }
        },
      }
    );
  };

  return (
    <button type="button" className="review-like-button" onClick={handleReviewLike} disabled={isLikePending}>
      {isLike ? <FillThumbIcon /> : <OutlineThumbIcon />}
      <span className="review-like-count" data-like={isLike}>
        {fNumberWithCommas(review.like_count)}
      </span>
    </button>
  );
};

export default ReviewLikeButton;
