import { useQuery } from "@tanstack/react-query";
import { fetchVideoReviews } from "/src/api/videos";

export const useVideoReviews = ({ videoId, page = null, pageSize = null }) => {
  return useQuery({
    queryKey: ["videoReviews", videoId],
    queryFn: async () => {
      const response = await fetchVideoReviews({
        videoId,
        ...(page !== null && { page }),
        ...(pageSize !== null && { pageSize }),
      });
      return response.data;
    },
    // TODO: staleTime, cacheTime 변경 (staleTime: 5분, cacheTime: 10분)
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: 1,
  });
};
