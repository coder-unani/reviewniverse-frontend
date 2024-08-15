import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReviewDelete } from "/src/api/reviews";
import { cLog, cError } from "/src/utils/test";

export const useReviewDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      try {
        const res = await fetchReviewDelete(variables);
        if (res.status === 204) {
          return {
            status: true,
            code: "리뷰가 삭제되었습니다.",
          };
        } else {
          throw new Error("리뷰 삭제에 실패했습니다.");
        }
      } catch (error) {
        throw new Error(error.message || "리뷰 삭제에 실패했습니다.");
      }
    },
    onSuccess: (res, variables) => {
      if (res.status) {
        queryClient.setQueryData(["videoMyInfo", { videoId: variables.videoId, userId: variables.userId }], (prev) => ({
          ...prev,
          review: {},
        }));

        queryClient.setQueriesData({ queryKey: ["videoReviews", variables.videoId], exact: false }, (prev) => {
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
      }
    },
    onError: (error) => {
      cError(error.message);
    },
  });
};
