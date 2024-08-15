import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReviewCreate } from "/src/api/reviews";
import { cLog, cError } from "/src/utils/test";

export const useReviewCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      try {
        const res = await fetchReviewCreate(variables);
        if (res.status === 201) {
          return {
            status: true,
            code: "리뷰가 기록되었습니다.",
          };
        } else {
          throw new Error("리뷰 기록에 실패했습니다.");
        }
      } catch (error) {
        throw new Error(error.message || "리뷰 기록에 실패했습니다.");
      }
    },
    onSuccess: (res, variables) => {
      if (res.status) {
        queryClient.invalidateQueries({
          queryKey: ["videoMyInfo", { videoId: variables.videoId, userId: variables.userId }],
        });

        queryClient.invalidateQueries({
          queryKey: ["videoReviews", variables.videoId],
          exact: false,
        });
      }
    },
    onError: (error) => {
      cError(error.message);
    },
  });
};
