import HttpClient from "/src/utils/HttpClient";
import { settings } from "/src/config/settings";
import { cLog, cError } from "/src/utils/test";

const baseURL = settings.API_BASE_URL;
const endpoints = {
  videos: baseURL + "/v1/contents/videos",
  videoDetail: baseURL + "/v1/contents/videos/:videoId",
  videoReviews: baseURL + "/v1/contents/videos/:videoId/reviews",
  videoMyInfo: baseURL + "/v1/contents/videos/:videoId/myinfo",
  videoLike: baseURL + "/v1/contents/videos/:videoId/like",
  videoRating: baseURL + "/v1/contents/videos/:videoId/ratings",
};

// Video List API
/**
 * PARAMS:
 * - page: 페이지 번호
 * - pageSize: 한 번에 불러올 데이터 개수
 * - code: 컨텐츠 코드 10: Movies, 11: Series
 * - query: 검색어
 * - videoId: 비디오 ID
 * - actorId: 배우 ID
 * - staffId: 스태프 ID
 * - genreId: 장르 ID
 * - orderBy: 정렬 순서
 */
export const fetchVideos = async ({
  page = null,
  pageSize = null,
  code = null,
  query = null,
  videoId = null,
  actorId = null,
  staffId = null,
  genreId = null,
  orderBy = null,
}) => {
  try {
    const client = new HttpClient();
    const res = await client.get(endpoints.videos, {
      ...(page && { p: page }),
      ...(pageSize && { ps: pageSize }),
      ...(code && { cd: code }),
      ...(query && { q: query }),
      ...(videoId && { vid: videoId }),
      ...(actorId && { aid: actorId }),
      ...(staffId && { sid: staffId }),
      ...(genreId && { gid: genreId }),
      ...(orderBy && { ob: orderBy }),
    });
    return res.status === 200 ? res.data : [];
  } catch (error) {
    cError(error);
  }
};

export const fetchVideoDetail = async ({ videoId }) => {
  try {
    const client = new HttpClient();
    const res = await client.get(endpoints.videoDetail.replace(":videoId", videoId));
    return res.status === 200 ? res.data : [];
  } catch (error) {
    cError(error);
  }
};

export const fetchVideoReviews = async ({ videoId, page = null, pageSize = null }) => {
  try {
    const client = new HttpClient();
    const res = await client.get(endpoints.videoReviews.replace(":videoId", videoId), {
      ...(page && { p: page }),
      ...(pageSize && { ps: pageSize }),
    });
    return res.status === 200 ? res.data : [];
  } catch (error) {
    cError(error);
  }
};

export const fetchVideoMyInfo = async ({ videoId }) => {
  try {
    const client = new HttpClient();
    const res = await client.post(endpoints.videoMyInfo.replace(":videoId", videoId));
    return res.status === 200 ? res.data : [];
  } catch (error) {
    cError(error);
  }
};

export const fetchVideoLike = async ({ videoId }) => {
  try {
    const client = new HttpClient();
    const res = await client.post(endpoints.videoLike.replace(":videoId", videoId));
    return res.status === 200 ? res.data : [];
  } catch (error) {
    cError(error);
  }
};

export const fetchVideoRating = async ({ videoId, rating }) => {
  try {
    const client = new HttpClient();
    const res = await client.post(endpoints.videoRating.replace(":videoId", videoId), {}, { rating });
    return res.status === 204 ? res.code : "";
  } catch (error) {
    cError(error);
  }
};
