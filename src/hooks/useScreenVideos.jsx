import { useQuery } from "@tanstack/react-query";
import { fetchScreenVideos } from "/src/api/screens";

export const useScreenVideos = ({ code, display = null }) => {
  return useQuery({
    queryKey: ["screenVideos", { code, ...(display && { display }) }],
    queryFn: async () => {
      // API 호출
      const res = await fetchScreenVideos({ code, display });
      /**
       * API를 통해 넘겨받은 데이터 가공이 필요하면 여기서 처리
       */
      return res.status === 200 ? res.data.data : [];
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: 1,
  });
};
