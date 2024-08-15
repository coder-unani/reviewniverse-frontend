import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchVideoLike } from "/src/api/videos";
import { cLog, cError } from "/src/utils/test";

export const useVideoLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => await fetchVideoLike(variables),
    onSuccess: (res, variables) => {
      if (res.status === 200) {
        cLog("비디오 좋아요 상태가 변경되었습니다.");
        queryClient.setQueryData(["videoMyInfo", { videoId: variables.videoId, userId: variables.userId }], (prev) => ({
          ...prev,
          is_like: res.data.data.is_like,
        }));

        queryClient.invalidateQueries({
          queryKey: ["userLikes", variables.userId],
          exact: false,
        });
      } else {
        cLog("비디오 좋아요 상태 변경에 실패했습니다.");
      }
    },
    onError: (error) => {
      cError(error);
    },
  });
};
