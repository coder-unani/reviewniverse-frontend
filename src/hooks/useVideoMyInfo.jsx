import { useQuery } from "@tanstack/react-query";
import { fetchVideoMyInfo } from "/src/api/videos";

export const useVideoMyInfo = ({ videoId, enabled }) => {
  return useQuery({
    queryKey: ["videoMyInfo", videoId],
    queryFn: async () => {
      const response = await fetchVideoMyInfo({ videoId });
      return response.data;
    },
    enabled: !!enabled,
    // TODO: staleTime, cacheTime 변경 (staleTime: 5분, cacheTime: 10분)
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: 1,
  });
};
