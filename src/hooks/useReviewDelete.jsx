import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReviewDelete } from "/src/api/reviews";
import { cLog, cError } from "/src/utils/test";

export const useReviewDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => await fetchReviewDelete(variables),
    onSuccess: (data, variables) => {
      cLog("리뷰가 삭제되었습니다.");
      queryClient.setQueryData(["videoMyInfo", variables.videoId], (prev) => ({
        ...prev,
        review: {},
      }));
      queryClient.setQueryData(["videoReviews", variables.videoId], (prev) =>
        prev.filter((review) => review.id !== variables.reviewId)
      );
      queryClient.setQueryData(["videoDetail", variables.videoId], (prev) => ({
        ...prev,
        review_count: prev.review_count - 1,
      }));
    },
    onError: (error) => {
      cError(error);
    },
  });
};
