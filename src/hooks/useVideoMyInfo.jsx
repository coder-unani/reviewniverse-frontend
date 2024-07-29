import { useQuery } from "@tanstack/react-query";
import { fetchVideoMyInfo } from "/src/api/videos";

export const useVideoMyInfo = ({ videoId, enabled }) => {
  return useQuery({
    queryKey: ["videoMyInfo", videoId],
    queryFn: async () => {
      const res = await fetchVideoMyInfo({ videoId });
      return res.status === 200 ? res.data.data : null;
      // TODO: res.status === 400 && res.message.detail === "ACCESS_TOKEN_NOT_FOUND" 에러 처리
    },
    enabled: !!enabled,
    // TODO: staleTime, cacheTime 변경 (staleTime: 5분, cacheTime: 10분)
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: 1,
  });
};
