import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReviewLike } from "/src/api/reviews";
import { cLog, cError } from "/src/utils/test";

export const useReviewLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => await fetchReviewLike(variables),
    onSuccess: (data, variables) => {
      cLog("리뷰 좋아요 상태가 변경되었습니다.");
      // 응답값: like_count, is_like
      // 1. myInfo: review_like 배열에 해당 review id값 업데이트
      // 2. reviews: 해당 review id값의 like_count 업데이트
      queryClient.setQueryData(["videoMyInfo", variables.videoId], (prev) => {
        const updatedMyInfo = { ...prev };
        if (data.data.is_like) {
          updatedMyInfo.review_like.push(variables.reviewId);
        } else {
          updatedMyInfo.review_like = updatedMyInfo.review_like.filter((id) => id !== variables.reviewId);
        }
        return updatedMyInfo;
      });
      queryClient.setQueryData(["videoReviews", variables.videoId], (prev) => {
        const updatedReviews = prev.map((review) => {
          if (review.id === variables.reviewId) {
            return { ...review, like_count: data.data.like_count };
          }
          return review;
        });
        return updatedReviews;
      });
    },
    onError: (error) => {
      cError(error);
    },
  });
};
