import { useQuery } from "@tanstack/react-query";
import { fetchToken } from "/src/api/token";

export const useToken = () => {
  const access_token = sessionStorage.getItem("access_token");
  if (!access_token) return false;

  return useQuery({
    queryKey: ["token"],
    queryFn: async () => {
      const response = await fetchToken();
      if (!response) {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("access_token");
      }
      return response;
    },
    // TODO: staleTime, cacheTime 변경 (staleTime: 5분, cacheTime: 10분)
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: 1,
  });
};
