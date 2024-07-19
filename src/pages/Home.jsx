import React, { useEffect, useState } from "react";
import VideoPage from "/src/components/VideoPage";
import { useScreenContents } from "/src/hooks/useScreenContents";
import { useVideosSearch } from "/src/hooks/useVideosSearch";
import { SCREEN_MAIN_ID } from "/src/config/codes";
import { VIDEO_ORDER_OPTIONS } from "/src/config/constants";
import { arrayRandomValue } from "/src/utils/format";
import { isEmpty } from "lodash";
import "/src/styles/Home.css";

const Home = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [orderBy, setOrderBy] = useState(arrayRandomValue(VIDEO_ORDER_OPTIONS));
  const [videos, setVideos] = useState({});

  // 스크린 데이터
  const {
    data: screens,
    error: screensError,
    isLoading: screensIsLoading,
  } = useScreenContents({ code: SCREEN_MAIN_ID });

  // 비디오 리스트
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideosSearch({
    page,
    orderBy,
    enabled: hasMore,
  });

  // 페이지 변경
  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    if (isEmpty(videosData) || !hasMore) return;
    if (videosData.status === 200) {
      if (page === 1) {
        setVideos(videosData.data);
      } else {
        if (page === 5) setHasMore(false);
        setVideos((prev) => {
          return {
            ...prev,
            count: videosData.data.count,
            page: videosData.data.page,
            data: [...prev.data, ...videosData.data.data],
          };
        });
      }
    } else {
      setVideos({ data: [] });
    }
  }, [page, videosData, hasMore]);

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

export default Home;
