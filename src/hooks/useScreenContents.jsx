import { useQuery } from "@tanstack/react-query";
import { fetchScreenContents } from "/src/api/screens";

export const useScreenContents = ({ code }) => {
  return useQuery({
    queryKey: ["screenContents", code],
    queryFn: async () => {
      // API 호출
      const response = await fetchScreenContents({ code });
      /**
       * API를 통해 넘겨받은 데이터 가공이 필요하면 여기서 처리
       */
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: 1,
  });
};
