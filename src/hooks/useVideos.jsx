import { useQuery } from "@tanstack/react-query";
import { fetchVideos } from "/src/api/videos";

export const useVideos = ({
  page = 1,
  pageSize = 20,
  code = null,
  query = null,
  videoId = null,
  actorId = null,
  staffId = null,
  genreId = null,
  orderBy = null,
  enabled = true,
}) => {
  // Custom cache cycle
  const STALE_TIME = 1000 * 60 * 5;
  const CACHE_TIME = 1000 * 60 * 10;
  const RETRY = 1;

  // queryKey 동적으로 구성
  const queryKey = [
    "videos",
    {
      page,
      pageSize,
      ...(code !== null && { code }),
      ...(query !== null && { query }),
      ...(videoId !== null && { videoId }),
      ...(actorId !== null && { actorId }),
      ...(staffId !== null && { staffId }),
      ...(genreId !== null && { genreId }),
      ...(orderBy !== null && { orderBy }),
    },
  ];

  return useQuery({
    /**
     * queryKey: 캐시 구분을 위한 키
     * queryFn: 비동기 함수
     * staleTime: 캐시 만료 시간 ex. 1000 * 60 * 5 (5분)
     * cacheTime: 캐시 유지 시간 ex. 1000 * 60 * 5 (5분)
     * retry: 재시도 횟수 ex. 1 (1회)
     */
    queryKey: queryKey,
    queryFn: async () => {
      // API 호출
      const res = await fetchVideos({
        page,
        pageSize,
        code,
        query,
        videoId,
        actorId,
        staffId,
        genreId,
        orderBy,
      });
      /**
       * API를 통해 넘겨받은 데이터 가공이 필요하면 여기서 처리
       */
      return res;
    },
    enabled: !!enabled,
    /**
     * .env 로 관리할 필요까지는 없고, config/settings.js 정도에서 관리
     * query별로 캐시전략을 다르게 가져갈 수 있으므로 default 하나 만들고 이 파일 상단에서 상수 선언 후 사용
     * custome 하게 사용할 경우 상수에 settings 값 사용 안하고 지금처럼 처리
     */
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    retry: RETRY,
  });
};
