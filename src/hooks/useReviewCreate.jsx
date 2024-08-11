import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReviewCreate } from "/src/api/reviews";
import { showSuccessToast, showErrorToast } from "/src/components/Toast";

export const useReviewCreate = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => await fetchReviewCreate(variables),
    onSuccess: (res, variables) => {
      if (res.status === 201) {
        queryClient.invalidateQueries({
          queryKey: ["videoMyInfo", { videoId: variables.videoId, userId: variables.userId }],
        });
        queryClient.invalidateQueries({ queryKey: ["videoReviews", variables.videoId] });

        if (onSuccessCallback) {
          onSuccessCallback();
        }

        showSuccessToast("리뷰가 기록되었습니다.");
      } else {
        showErrorToast("리뷰 기록에 실패했습니다.");
      }
    },
    onError: (error) => {
      showErrorToast("리뷰 기록에 실패했습니다.");
    },
  });
};
