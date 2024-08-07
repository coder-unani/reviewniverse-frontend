import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HVideos from "/src/components/HVideos";
import Videos from "/src/components/Videos";
import { useAuthContext } from "/src/context/AuthContext";
import { useRankingVideos } from "/src/hooks/useRankingVideos";
import { useScreenVideos } from "/src/hooks/useScreenVideos";
import { useVideos } from "/src/hooks/useVideos";
import { SCREEN_MAIN_ID } from "/src/config/codes";
import { VIDEO_ORDER_OPTIONS } from "/src/config/constants";
import { arrayRandomValue } from "/src/utils/format";
import { isEmpty } from "lodash";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ArrowRightIcon from "/src/assets/button/arrow-right.svg?react";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // const [orderBy, setOrderBy] = useState(arrayRandomValue(VIDEO_ORDER_OPTIONS));
  const [videos, setVideos] = useState({ count: 0, page: 1, data: [] });
  const {
    data: ranking,
    error: rankingError,
    isLoading: rankingIsLoading,
  } = useRankingVideos({ code: "20240808", count: 20 });
  const { data: screens, error: screensError, isLoading: screensIsLoading } = useScreenVideos({ code: SCREEN_MAIN_ID });
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideos({
    page,
    orderBy: "release_desc",
    enabled: hasMore,
  });
  const [screensMA01, setScreensMA01] = useState(null);
  const [screensMA02, setScreensMA02] = useState(null);
  const [screensMA03, setScreensMA03] = useState(null);
  const [screensMA04, setScreensMA04] = useState(null);
  const [screensMA05, setScreensMA05] = useState(null);

  const formatScreens = (screens, code) => {
    return screens.find((screen) => screen.code === code);
  };

  // 페이지 변경
  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    if (isEmpty(screens)) return;
    setScreensMA01(formatScreens(screens, "MA01"));
    setScreensMA02(formatScreens(screens, "MA02"));
    setScreensMA03(formatScreens(screens, "MA03"));
    setScreensMA04(formatScreens(screens, "MA04"));
    setScreensMA05(formatScreens(screens, "MA05"));
  }, [screens]);

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
  // if (videosIsLoading || rankingIsLoading || screensIsLoading) return null;
  if (rankingIsLoading || screensIsLoading) return;

  // 에러일때 표시할 화면
  if (videosError || rankingError || screensError) return navigate("/error");

  // 데이터 props로 하위 컴포넌트에 전달
  return (
    <main className="home-main">
      <section className="home-preview-wrapper">
        {/* <figure className="background-image">
          <LazyLoadImage src="" alt="배경 이미지" effect="blur" />
        </figure> */}
      </section>
      <section className="home-main-wrapper">
        {screensMA01 && (
          <HVideos content={screensMA01.content.list} template={screensMA01.content.template} code={screensMA01.code}>
            <div className="title-wrapper">
              <h2 className="title">{screensMA01.title}</h2>
              {/* <button className="more">
                  더보기
                  <ArrowRightIcon />
                </button> */}
            </div>
          </HVideos>
        )}

        <HVideos content={ranking} template="rank" code="ranking">
          <div className="title-wrapper">
            <h2 className="title">🍿 리뷰니버스 TOP 20</h2>
          </div>
        </HVideos>

        {screensMA02 && (
          <HVideos content={screensMA02.content.list} template={screensMA02.content.template} code={screensMA02.code}>
            <div className="title-wrapper">
              <h2 className="title">{screensMA02.title}</h2>
            </div>
          </HVideos>
        )}

        {screensMA03 && (
          <HVideos content={screensMA03.content.list} template={screensMA03.content.template} code={screensMA03.code}>
            <div className="title-wrapper">
              <h2 className="title">{screensMA03.title}</h2>
            </div>
          </HVideos>
        )}

        {screensMA04 && (
          <HVideos content={screensMA04.content.list} template={screensMA04.content.template} code={screensMA04.code}>
            <div className="title-wrapper">
              <h2 className="title">{screensMA04.title}</h2>
            </div>
          </HVideos>
        )}

        {screensMA05 && (
          <HVideos content={screensMA05.content.list} template={screensMA05.content.template} code={screensMA05.code}>
            <div className="title-wrapper">
              <h2 className="title">{screensMA05.title}</h2>
            </div>
          </HVideos>
        )}

        {videos && (
          <Videos videos={videos} handlePage={handlePage}>
            <div className="title-wrapper">
              <h2 className="title">🍟 이건 어때요?</h2>
            </div>
          </Videos>
        )}
      </section>
    </main>
  );
};

export default Home;
