import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReviewUpdate } from "/src/api/reviews";
import { cLog, cError } from "/src/utils/test";

export const useReviewUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => await fetchReviewUpdate(variables),
    onSuccess: (res, variables) => {
      if (res.status === 204) {
        cLog("리뷰가 수정되었습니다.");
        // 지정된 키를 가진 쿼리를 무효화하여 다시 호출되도록 설정
        queryClient.invalidateQueries({
          queryKey: ["videoMyInfo", { videoId: variables.videoId, userId: variables.userId }],
        });
        queryClient.invalidateQueries({ queryKey: ["videoReviews", variables.videoId] });
      } else {
        cLog("리뷰 수정에 실패했습니다.");
      }
    },
    onError: (error) => {
      cError(error);
    },
  });
};
