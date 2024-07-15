import React, { useEffect, useState } from "react";
import VideoPage from "/src/components/VideoPage";
import { SCREEN_MOVIE_ID } from "/src/config/types";
import { useVideos } from "/src/hooks/useVideos";
import { VIDEO_ORDER_OPTIONS } from "/src/config/constants";
import { useScreenContents } from "/src/hooks/useScreenContents";
import { arrayRandomValue } from "/src/utils/format";
import { isEmpty } from "lodash";

const Movie = () => {
  const code = 10;
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState(arrayRandomValue(VIDEO_ORDER_OPTIONS));
  const [videos, setVideos] = useState([]);

  // 스크린 데이터
  const {
    data: screens,
    error: screensError,
    isLoading: screensIsLoading,
  } = useScreenContents({ code: SCREEN_MOVIE_ID });

  // 비디오 리스트
  const { data: videosData, error: videosError, isLoading: videosIsLoading } = useVideos({ page, orderBy, code });

  // 페이지 변경
  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    if (isEmpty(videosData)) return;
    setVideos((prev) => {
      if (isEmpty(prev)) return videosData;
      return { ...prev, data: [...prev.data, ...videosData.data] };
    });
  }, [page, videosData]);

  // 로딩중일때 표시할 화면 (스켈레톤 UI)
  if (videosIsLoading || screensIsLoading) {
  }

  // 에러일때 표시할 화면
  if (videosError) {
  }
  if (screensError) {
  }

  // 데이터 props로 하위 컴포넌트에 전달
  return <VideoPage screens={screens} videos={videos} handlePage={handlePage} />;
};

export default Movie;
