import { useQuery } from "@tanstack/react-query";
import { fetchRanking } from "/src/api/ranking";

export const useRankingVideos = ({ code, count }) => {
  return useQuery({
    queryKey: ["rankingVideos", { code, count }],
    queryFn: async () => {
      const res = await fetchRanking({ code, count });
      return res.status === 200 ? res.data.data : [];
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: 1,
  });
};
