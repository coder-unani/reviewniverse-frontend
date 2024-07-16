import { useQuery } from "@tanstack/react-query";
import { fetchVideoDetail } from "/src/api/videos";

export const useVideoDetail = ({ videoId }) => {
  return useQuery({
    queryKey: ["videoDetail", videoId],
    queryFn: async () => {
      const response = await fetchVideoDetail({ videoId });
      return response.data;
    },
    // TODO: staleTime, cacheTime 변경 (staleTime: 5분, cacheTime: 10분)
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: 1,
  });
};
