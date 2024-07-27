import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "/src/api/users";

export const useUser = ({ userId }) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await fetchUser({ userId });
      return res.status === 200 ? res.data.user : null;
    },
    // staleTime: 1000 * 60 * 5,
    // cacheTime: 1000 * 60 * 10,
    retry: 1,
  });
};
