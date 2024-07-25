import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReviewDelete } from "/src/api/reviews";
import { cLog, cError } from "/src/utils/test";

export const useReviewDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => await fetchReviewDelete(variables),
    onSuccess: (res, variables) => {
      if (res.status === 204) {
        cLog("리뷰가 삭제되었습니다.");
        queryClient.setQueryData(["videoMyInfo", variables.videoId], (prev) => ({
          ...prev,
          review: {},
        }));
        queryClient.setQueryData(["videoReviews", variables.videoId], (prev) =>
          prev.filter((review) => review.id !== variables.reviewId)
        );
        // TODO: review_count 이렇게 업데이트 하는게 맞나?
        queryClient.setQueryData(["videoDetail", variables.videoId], (prev) => ({
          ...prev,
          review_count: prev.review_count - 1,
        }));
      } else {
        cLog("리뷰 삭제에 실패했습니다.");
      }
    },
    onError: (error) => {
      cError(error);
    },
  });
};
