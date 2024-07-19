import { useQuery } from "@tanstack/react-query";
import { fetchVideosSearch } from "/src/api/videos";

export const useVideosSearch = ({
  query = null,
  page = 1,
  size = 20,
  display = null,
  mode = null,
  target = null,
  orderBy = null,
  enabled = true,
}) => {
  const STALE_TIME = 1000 * 60 * 5;
  const CACHE_TIME = 1000 * 60 * 10;
  const RETRY = 1;
  const queryKey = [
    "videos",
    {
      ...(query !== null && { query }),
      page,
      size,
      ...(display !== null && { display }),
      ...(mode !== null && { mode }),
      ...(target !== null && { target }),
      ...(orderBy !== null && { orderBy }),
    },
  ];

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const res = await fetchVideosSearch({
        query,
        page,
        size,
        display,
        mode,
        target,
        orderBy,
      });
      return res;
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    retry: RETRY,
  });
};
