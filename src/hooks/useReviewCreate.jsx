import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReviewCreate } from "/src/api/reviews";
import { cLog, cError } from "/src/utils/test";

export const useReviewCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => await fetchReviewCreate(variables),
    onSuccess: (res, variables) => {
      if (res.status === 201) {
        cLog("리뷰가 등록되었습니다.");
        // 지정된 키를 가진 쿼리를 무효화하여 다시 호출되도록 설정
        queryClient.invalidateQueries({
          queryKey: ["videoMyInfo", { videoId: variables.videoId, userId: variables.userId }],
        });
        queryClient.invalidateQueries({ queryKey: ["videoReviews", variables.videoId] });
      } else {
        cLog("리뷰 등록에 실패했습니다.");
      }
    },
    onError: (error) => {
      cError(error);
    },
  });
};
