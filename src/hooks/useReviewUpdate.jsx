import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReviewUpdate } from "/src/api/reviews";
import { cLog, cError } from "/src/utils/test";

export const useReviewUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => await fetchReviewUpdate(variables),
    onSuccess: (data, variables) => {
      cLog("리뷰가 수정되었습니다.");
      queryClient.setQueryData(["videoMyInfo", variables.videoId], (prev) => ({
        ...prev,
        review: {
          title: variables.title,
          is_spoiler: variables.is_spoiler,
          is_private: variables.is_private,
        },
      }));
      queryClient.setQueryData(["videoReviews", variables.videoId], (prev) => {
        if (!prev) return prev;
        const updatedReviews = prev.map((review) =>
          review.id === variables.reviewId
            ? { ...review, title: variables.title, is_spoiler: variables.is_spoiler, is_private: variables.is_private }
            : review
        );
        return updatedReviews;
      });
    },
    onError: (error) => {
      cError(error);
    },
  });
};
