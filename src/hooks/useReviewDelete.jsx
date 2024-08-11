import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReviewDelete } from "/src/api/reviews";
import { showSuccessToast, showErrorToast } from "/src/components/Toast";

export const useReviewDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => await fetchReviewDelete(variables),
    onSuccess: (res, variables) => {
      if (res.status === 204) {
        queryClient.setQueryData(["videoMyInfo", { videoId: variables.videoId, userId: variables.userId }], (prev) => ({
          ...prev,
          review: {},
        }));

        queryClient.setQueryData(["videoReviews", variables.videoId], (prev) => {
          if (!prev) return prev;
          const updatedReviews = { ...prev };
          updatedReviews.data = updatedReviews.data.filter((review) => review.id !== variables.reviewId);
          return updatedReviews;
        });

        // TODO: review_count 이렇게 업데이트 하는게 맞나?
        queryClient.setQueryData(["videoDetail", variables.videoId], (prev) => ({
          ...prev,
          review_count: prev.review_count > 0 ? prev.review_count - 1 : 0,
        }));

        showSuccessToast("리뷰가 삭제되었습니다.");
      } else {
        showErrorToast("리뷰 삭제에 실패했습니다.");
      }
    },
    onError: (error) => {
      showErrorToast("리뷰 삭제에 실패했습니다.");
    },
  });
};
