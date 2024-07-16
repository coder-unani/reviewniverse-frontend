import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchVideoLike } from "/src/api/videos";
import { cLog, cError } from "/src/utils/test";

export const useVideoLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => await fetchVideoLike(variables),
    onSuccess: (data, variables) => {
      cLog("비디오 좋아요 상태가 변경되었습니다.");
      queryClient.setQueryData(["videoMyInfo", variables.videoId], (prev) => ({
        ...prev,
        is_like: data.data.is_like,
      }));
    },
    onError: (error) => {
      cError(error);
    },
  });
};
