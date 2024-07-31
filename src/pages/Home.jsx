import React, { useEffect, useState } from "react";
import HVideos from "/src/components/HVideos";
import Videos from "/src/components/Videos";
import { Helmet } from "react-helmet-async";
import { useAuthContext } from "/src/context/AuthContext";
import { useScreenContents } from "/src/hooks/useScreenContents";
import { useVideos } from "/src/hooks/useVideos";
import { SCREEN_MAIN_ID } from "/src/config/codes";
import { DEFAULT_IMAGES, VIDEO_ORDER_OPTIONS } from "/src/config/constants";
import { SETTINGS } from "/src/config/settings";
import { arrayRandomValue } from "/src/utils/format";
import { isEmpty } from "lodash";
import "/src/styles/Home.css";

const Home = () => {
  const { user } = useAuthContext();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [orderBy, setOrderBy] = useState(arrayRandomValue(VIDEO_ORDER_OPTIONS));
  const [videos, setVideos] = useState({ count: 0, page: 1, data: [] });
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
    <>
      <Helmet>
        <title>리뷰니버스</title>
        <meta name="description" content="리뷰니버스와 함께라면 보는 즐거움이 2배로, 생생한 리뷰를 확인해보세요!" />
        <meta property="og:title" content="리뷰니버스" />
        <meta
          property="og:description"
          content="리뷰니버스와 함께라면 보는 즐거움이 2배로, 생생한 리뷰를 확인해보세요!"
        />
        <meta property="og:image" content={DEFAULT_IMAGES.logo} />
        <meta property="og:url" content={SETTINGS.DOMAIN_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:site_name" content="Reviewniverse" />
      </Helmet>
      <main className="main">
        {!isEmpty(screens) && screens.map((content, index) => <HVideos key={index} content={content} />)}
        {!isEmpty(videos) && (
          <Videos videos={videos} handlePage={handlePage}>
            <div className="title-wrapper">
              <h2 className="title">주인님 내 새끼 구경 좀 해봐요 🦦</h2>
            </div>
          </Videos>
        )}
      </main>
    </>
  );
};

export default Home;
