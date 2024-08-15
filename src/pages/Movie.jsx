import React, { useEffect, useState } from "react";
import VideosHorizontal from "/src/components/VideosHorizontal";
import Videos from "/src/components/Videos";
import { useAuthContext } from "/src/context/AuthContext";
import { useScreenVideos } from "/src/hooks/useScreenVideos";
import { useVideos } from "/src/hooks/useVideos";
import { SCREEN_MOVIE_ID } from "/src/config/codes";
import { VIDEO_ORDER_OPTIONS } from "/src/config/constants";
import { fArrayRandomValue } from "/src/utils/format";
import { isEmpty } from "lodash";

const Movie = () => {
  const { user } = useAuthContext();
  const code = 10;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [orderBy, setOrderBy] = useState(fArrayRandomValue(VIDEO_ORDER_OPTIONS));
  const [videos, setVideos] = useState({ count: 0, page: 1, data: [] });
  // 스크린 데이터
  const {
    data: screens,
    error: screensError,
    isLoading: screensIsLoading,
  } = useScreenVideos({ code: SCREEN_MOVIE_ID });
  // 비디오 리스트
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideos({ page, orderBy, code, enabled: hasMore });

  // 페이지 변경
  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    if (!videosData || !hasMore) return;
    if (page === 1) {
      setVideos(videosData);
    } else {
      if (page === 5) setHasMore(false);
      setVideos((prev) => {
        return {
          ...prev,
          count: videosData.count,
          page: videosData.page,
          data: [...prev.data, ...videosData.data],
        };
      });
    }
  }, [videosData, hasMore, page]);

  // 로딩중일때 표시할 화면 (스켈레톤 UI)
  if (videosIsLoading || screensIsLoading) {
  }

  // 에러일때 표시할 화면
  if (videosError) {
  }
  if (screensError) {
  }

  if (isEmpty(screens) || isEmpty(videos)) return null;

  // 데이터 props로 하위 컴포넌트에 전달
  return (
    <main className="main">
      {!isEmpty(screens) && screens.map((content, index) => <VideosHorizontal key={index} content={content} />)}
      {!isEmpty(videos) && (
        <Videos videos={videos} handlePage={handlePage}>
          <div className="title-wrapper">
            <h2 className="title">주인님 내 새끼 구경 좀 해봐요 🦦</h2>
          </div>
        </Videos>
      )}
    </main>
  );
};

export default Movie;
