import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReviewLike } from "/src/api/reviews";
import { cLog, cError } from "/src/utils/test";

export const useReviewLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      try {
        const res = await fetchReviewLike(variables);
        if (res.status === 200) {
          return {
            status: true,
            code: "리뷰 좋아요 상태가 변경되었습니다.",
            data: res.data.data,
          };
        } else {
          throw new Error("리뷰 좋아요 상태 변경에 실패했습니다.");
        }
      } catch (error) {
        throw new Error(error.message || "리뷰 좋아요 상태 변경에 실패했습니다.");
      }
    },
    onSuccess: (res, variables) => {
      if (res.status) {
        // 응답값: like_count, is_like
        // 1. myInfo: review_like 배열에 해당 review id값 업데이트
        // 2. reviews: 해당 review id값의 like_count 업데이트
        // queryClient.setQueryData(["videoMyInfo", { videoId: variables.videoId, userId: variables.userId }], (prev) => {
        //   if (!prev) return prev;
        //   const updatedMyInfo = { ...prev };
        //   if (res.data.is_like) {
        //     updatedMyInfo.review_like = [...updatedMyInfo.review_like, variables.reviewId];
        //   } else {
        //     updatedMyInfo.review_like = updatedMyInfo.review_like.filter((id) => id !== variables.reviewId);
        //   }
        //   return updatedMyInfo;
        // });

        // videoReviews 캐시 업데이트
        queryClient.setQueriesData({ queryKey: ["videoReviews", variables.videoId], exact: false }, (prev) => {
          if (!prev) return prev;
          const updatedReviews = { ...prev };
          updatedReviews.data = updatedReviews.data.map((review) => {
            if (review.id === variables.reviewId) {
              return { ...review, like_count: res.data.like_count, my_info: { is_like: res.data.is_like } };
            }
            return review;
          });
          return updatedReviews;
        });

        // userReviews 캐시 업데이트
        queryClient.setQueriesData({ queryKey: ["userReviews", variables.userId], exact: false }, (prev) => {
          if (!prev) return prev;
          const updatedReviews = { ...prev };
          updatedReviews.data.data = updatedReviews.data.data.map((review) => {
            if (review.id === variables.reviewId) {
              return { ...review, like_count: res.data.like_count, my_info: { is_like: res.data.is_like } };
            }
            return review;
          });
          return updatedReviews;
        });
      }
    },
    onError: (error) => {
      cError(error.message);
    },
  });
};
