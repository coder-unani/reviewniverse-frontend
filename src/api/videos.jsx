import HttpClient from "/src/utils/HttpClient";
import { settings } from "/src/config/settings";
import { cLog, cError } from "/src/utils/test";

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
    const res = await client.get(`${settings.API_BASE_URL}/v1/contents/videos`, {
      ...(page && { p: page }),
      ...(pageSize && { ps: pageSize }),
      ...(code && { t: code }),
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
