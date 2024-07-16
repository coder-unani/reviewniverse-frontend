import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchVideoRating } from "/src/api/videos";
import { cLog, cError } from "/src/utils/test";

export const useVideoRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => await fetchVideoRating(variables),
    onSuccess: (data, variables) => {
      cLog("비디오 평가 점수가 변경되었습니다.");
      // videoMyInfo 쿼리 키의 데이터를 업데이트
      queryClient.setQueryData(["videoMyInfo", variables.videoId], (prev) => {
        if (!prev) return prev;
        const updatedRating =
          data === "RATING_CREATE_SUCC" || data === "RATING_UPDATE_SUCC"
            ? variables.rating
            : data === "RATING_DELETE_SUCC"
            ? 0
            : prev.rating;
        // review 데이터가 있는 경우
        if (prev.review && prev.review.id) {
          // videoReviews 쿼리 키의 데이터를 업데이트
          queryClient.setQueryData(["videoReviews", variables.videoId], (prevReviews) => {
            if (!prevReviews) return prevReviews;
            const updatedReviews = prevReviews.map((review) =>
              review.id === prev.review.id ? { ...review, rating: updatedRating === 0 ? null : updatedRating } : review
            );
            return updatedReviews;
          });
        }
        return {
          ...prev,
          rating: updatedRating,
        };
      });
    },
    onError: (error) => {
      cError(error);
    },
  });
};
