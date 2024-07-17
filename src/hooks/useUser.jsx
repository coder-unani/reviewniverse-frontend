import { useQuery } from "@tanstack/react-query";
// import { fetchUser } from "/src/api/users";
import { fetchUsers } from "/src/api/users";

export const useUser = ({ userId }) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await fetchUsers({ userId });
      if (res.status === 200) {
        return res.data.data[0];
        // return res.data.user;
      } else {
        throw new Error("사용자 정보를 불러오는데 실패하였습니다.");
      }
    },
    // TODO: staleTime, cacheTime 변경 (staleTime: 5분, cacheTime: 10분)
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: 1,
  });
};
