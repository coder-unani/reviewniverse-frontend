import { useQuery } from "@tanstack/react-query";
import { fetchVideoDetail } from "/src/api/videos";

export const useVideoDetail = ({ videoId }) => {
  return useQuery({
    queryKey: ["videoDetail", videoId],
    queryFn: async () => {
      try {
        const res = await fetchVideoDetail({ videoId });
        if (res.status === 200) {
          return {
            status: true,
            code: "",
            data: res.data.data,
          };
        } else if (res.status === 404) {
          if (res.message.detail === "VIDEO_NOT_FOUND") {
            return {
              status: false,
              code: "V002",
              // code: "존재하지 않는 콘텐츠입니다.",
              data: null,
            };
          } else {
            return {
              status: false,
              code: "콘텐츠 정보를 가져오는데 실패했습니다.",
              data: null,
            };
          }
        } else {
          return {
            status: false,
            code: "콘텐츠 정보를 가져오는데 실패했습니다.",
            data: null,
          };
        }
      } catch (error) {
        return {
          status: false,
          code: "콘텐츠 정보를 가져오는데 실패했습니다.",
          data: null,
        };
      }
    },
    // TODO: staleTime, cacheTime 변경 (staleTime: 5분, cacheTime: 10분)
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: 1,
  });
};
