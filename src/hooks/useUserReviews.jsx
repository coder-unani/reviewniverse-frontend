import { useQuery } from "@tanstack/react-query";
import { fetchUserReviews } from "/src/api/users";

export const useUserReviews = ({ userId, page = null, pageSize = null, orderBy = null }) => {
  return useQuery({
    queryKey: [
      "userRatings",
      {
        userId,
        ...(page !== null && { page }),
        ...(pageSize !== null && { pageSize }),
        ...(orderBy !== null && { orderBy }),
      },
    ],
    queryFn: async () => {
      const res = await fetchUserReviews({ userId, page, pageSize, orderBy });
      console.log(res);
      if (res.status === 200) {
        return {
          status: true,
          code: "",
          data: res.data,
        };
      } else {
        return {
          status: false,
          code: "사용자 비디오 리뷰 리스트를 가져오는데 실패했습니다.",
          data: null,
        };
      }
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: 1,
  });
};
