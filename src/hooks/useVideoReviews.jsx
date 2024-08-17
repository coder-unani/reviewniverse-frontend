import { useQuery } from "@tanstack/react-query";
import { fetchVideoReviews } from "/src/api/videos";

// TODO: queryKey page, pageSize 추가

export const useVideoReviews = ({ videoId, page = null, pageSize = null, enabled }) => {
  return useQuery({
    queryKey: [
      "videoReviews",
      videoId,
      {
        ...(page !== null && { page }),
        ...(pageSize !== null && { pageSize }),
      },
    ],
    queryFn: async () => {
      const res = await fetchVideoReviews({ videoId, page, pageSize });
      return res.status === 200 ? res.data : [];
    },
    enabled: !!enabled,
    // TODO: staleTime, cacheTime 변경 (staleTime: 5분, cacheTime: 10분)
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: 1,
  });
};
