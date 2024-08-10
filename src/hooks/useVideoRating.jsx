import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchVideoRating } from "/src/api/videos";
import { cLog, cError } from "/src/utils/test";

export const useVideoRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => await fetchVideoRating(variables),
    onSuccess: (res, variables) => {
      if (res.status === 200) {
        cLog("비디오 평가 점수가 변경되었습니다.");
        // videoDetail 쿼리 키의 데이터를 업데이트
        queryClient.setQueryData(["videoDetail", variables.videoId], (prevDetail) => {
          if (!prevDetail) return prevDetail;
          const updatedRating = res.data.data.rating_avg;
          return {
            ...prevDetail,
            data: { ...prevDetail.data, rating: updatedRating },
          };
        });
        // videoMyInfo 쿼리 키의 데이터를 업데이트
        queryClient.setQueryData(
          ["videoMyInfo", { videoId: variables.videoId, userId: variables.userId }],
          (prevMyInfo) => {
            if (!prevMyInfo) return prevMyInfo;
            const updatedRating = res.data.data.rating;
            // review 데이터가 있는 경우
            if (prevMyInfo.review && prevMyInfo.review.id) {
              // videoReviews 쿼리 키의 데이터를 업데이트
              queryClient.setQueryData(["videoReviews", variables.videoId], (prevReviews) => {
                const updatedReviews = { ...prevReviews };
                updatedReviews.data = updatedReviews.data.map((review) =>
                  review.id === prevMyInfo.review.id ? { ...review, rating: updatedRating } : review
                );
                return updatedReviews;
              });
            }
            return { ...prevMyInfo, rating: updatedRating };
          }
        );
      } else {
        cLog("비디오 평가 점수 변경에 실패했습니다.");
      }
    },
    onError: (error) => {
      cError(error);
    },
  });
};
