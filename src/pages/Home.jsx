import React, { useState } from "react";
import { SCREEN_MAIN_ID } from "/src/config/types";
import VideoPage from "/src/components/VideoPage";
import "/src/styles/Home.css";
import { useVideos } from "/src/hooks/useVideos";
import { useScreenContents } from "/src/hooks/useScreenContents";

const Home = () => {
  const [page, setPage] = useState(1);
  // 스크린 데이터
  const {
    data: screens,
    error: screensError,
    isLoading: screensIsLoading,
  } = useScreenContents({ code: SCREEN_MAIN_ID });

  // 비디오 리스트
  const orderBy = "view_desc";
  const { data: videos, error: videosError, isLoading: videosIsLoading } = useVideos({ page, orderBy });

  // 로딩중일때 표시할 화면
  if (videosIsLoading || screensIsLoading) {
  }

  // 에러일때 표시할 화면
  if (videosError) {
  }
  if (screensError) {
  }

  const handlePage = (page) => {
    setPage(page);
  };

  // 데이터 props로 하위 컴포넌트에 전달
  return <VideoPage screens={screens} videos={videos} handlePage={handlePage} />;
};

export default Home;
