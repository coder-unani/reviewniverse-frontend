import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReviewLike } from "/src/api/reviews";
import { cLog, cError } from "/src/utils/test";

export const useReviewLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => await fetchReviewLike(variables),
    onSuccess: (res, variables) => {
      if (res.status === 200) {
        cLog("리뷰 좋아요 상태가 변경되었습니다.");
        // 응답값: like_count, is_like
        // 1. myInfo: review_like 배열에 해당 review id값 업데이트
        // 2. reviews: 해당 review id값의 like_count 업데이트
        queryClient.setQueryData(["videoMyInfo", variables.videoId], (prev) => {
          const updatedMyInfo = { ...prev };
          if (res.data.data.is_like) {
            updatedMyInfo.review_like.push(variables.reviewId);
          } else {
            updatedMyInfo.review_like = updatedMyInfo.review_like.filter((id) => id !== variables.reviewId);
          }
          return updatedMyInfo;
        });
        queryClient.setQueryData(["videoReviews", variables.videoId], (prev) => {
          const updatedReviews = prev.map((review) => {
            if (review.id === variables.reviewId) {
              return { ...review, like_count: res.data.data.like_count };
            }
            return review;
          });
          return updatedReviews;
        });
      } else {
        cLog("리뷰 좋아요 상태 변경에 실패했습니다.");
      }
    },
    onError: (error) => {
      cError(error);
    },
  });
};
