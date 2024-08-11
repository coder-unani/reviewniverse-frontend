import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReviewUpdate } from "/src/api/reviews";
import { showSuccessToast, showErrorToast } from "/src/components/Toast";

export const useReviewUpdate = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => await fetchReviewUpdate(variables),
    onSuccess: (res, variables) => {
      if (res.status === 204) {
        queryClient.invalidateQueries({
          queryKey: ["videoMyInfo", { videoId: variables.videoId, userId: variables.userId }],
        });
        queryClient.invalidateQueries({ queryKey: ["videoReviews", variables.videoId] });

        if (onSuccessCallback) {
          onSuccessCallback();
        }
        showSuccessToast("리뷰가 수정되었습니다.");
      } else {
        showErrorToast("리뷰 수정에 실패했습니다.");
      }
    },
    onError: (error) => {
      showErrorToast("리뷰 수정에 실패했습니다.");
    },
  });
};
