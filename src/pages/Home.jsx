import React, { useEffect, useState } from "react";
import HVideos from "/src/components/HVideos";
import Videos from "/src/components/Videos";
import { useAuthContext } from "/src/context/AuthContext";
import { useScreenContents } from "/src/hooks/useScreenContents";
import { useVideos } from "/src/hooks/useVideos";
import { SCREEN_MAIN_ID } from "/src/config/codes";
import { VIDEO_ORDER_OPTIONS } from "/src/config/constants";
import { arrayRandomValue } from "/src/utils/format";
import { isEmpty } from "lodash";
import "/src/styles/Home.css";

const Home = () => {
  const { user } = useAuthContext();
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
  } = useVideos({
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

  if (isEmpty(screens) || isEmpty(videos)) return null;

  // 데이터 props로 하위 컴포넌트에 전달
  return (
    <main className="main">
      <p style={{ wordBreak: "break-all" }}>{user ? JSON.stringify(user) : "null"}</p>
      {!isEmpty(screens.data.data) &&
        screens.data.data.map((content, index) => <HVideos key={index} content={content} />)}
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

export default Home;
