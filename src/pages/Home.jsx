import React, { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SkeletonHome from "/src/components/Skeleton/Home";
import { useScreenVideos } from "/src/hooks/useScreenVideos";
import { useRankingVideos } from "/src/hooks/useRankingVideos";
import { useVideos } from "/src/hooks/useVideos";
import { showErrorToast } from "/src/components/Toast";
import { SCREEN_MAIN_ID } from "/src/config/codes";
import { VIDEO_ORDER_OPTIONS } from "/src/config/constants";
import { MESSAGES } from "/src/config/messages";
import { fScreenCode } from "/src/utils/formatContent";

const SwiperPreview = React.lazy(() => import("/src/components/SwiperPreview"));
const VideosHorizontal = React.lazy(() => import("/src/components/VideosHorizontal"));
const Videos = React.lazy(() => import("/src/components/Videos"));

const Home = () => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [videos, setVideos] = useState(null);
  const {
    data: ranking,
    error: rankingError,
    isLoading: rankingIsLoading,
  } = useRankingVideos({ code: today, count: 20 });
  const {
    data: screens,
    error: screensError,
    isLoading: screensIsLoading,
  } = useScreenVideos({ code: SCREEN_MAIN_ID, display: "detail" });
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideos({
    page,
    orderBy: VIDEO_ORDER_OPTIONS,
    enabled: hasMore,
  });
  const [screensMA01, setScreensMA01] = useState(null);
  const [screensMA02, setScreensMA02] = useState(null);
  const [screensMA03, setScreensMA03] = useState(null);
  const [screensMA04, setScreensMA04] = useState(null);
  const [screensMA05, setScreensMA05] = useState(null);

  useEffect(() => {
    const header = document.querySelector("header");

    const handleScroll = () => {
      if (window.scrollY > 100 && header.classList.contains("transparent")) {
        header.classList.remove("transparent");
      } else if (window.scrollY <= 100 && !header.classList.contains("transparent")) {
        header.classList.add("transparent");
      }
    };

    window.addEventListener("scroll", handleScroll);
    header.classList.add("transparent");

    return () => {
      window.removeEventListener("scroll", handleScroll);
      header.classList.remove("transparent");
    };
  }, []);

  // TODO: 정리 필요
  useEffect(() => {
    if (screensIsLoading || !screens.status) return;
    setScreensMA01(fScreenCode(screens.data, "MA01"));
    setScreensMA02(fScreenCode(screens.data, "MA02"));
    setScreensMA03(fScreenCode(screens.data, "MA03"));
    setScreensMA04(fScreenCode(screens.data, "MA04"));
    setScreensMA05(fScreenCode(screens.data, "MA05"));
  }, [screens]);

  useEffect(() => {
    if (videosIsLoading || !videosData || !hasMore) {
      return;
    }
    if (!videosData.status) {
      if (videosData.code === "C001") {
        // TODO: 고도화 필요
        if (page === 1) {
          return navigate("/error");
        } else {
          // showErrorToast(MESSAGES["C001"]);
          setPage((prev) => prev - 1);
          return;
        }
      } else {
        return navigate("/error");
      }
    }
    if (page === 1) {
      setVideos({ ...videosData.data });
    } else {
      // if (page === 5) setHasMore(false);
      setVideos((prev) => {
        if (prev.page === videosData.data.page) return prev;
        return {
          ...prev,
          count: videosData.data.count,
          page: videosData.data.page,
          data: prev.data ? [...prev.data, ...videosData.data.data] : [...videosData.data.data],
        };
      });
    }
  }, [videosIsLoading, videosData, hasMore, page]);

  const handlePage = (newPage) => {
    setPage(newPage);
  };

  if (screensIsLoading || rankingIsLoading) {
    return <SkeletonHome />;
  }

  if (screensError || rankingError || videosError) {
    return navigate("/error");
  }

  return (
    <Suspense fallback={<SkeletonHome />}>
      <main className="home-main-container">
        <section className="home-preview-section">{screensMA01 && <SwiperPreview screensMA01={screensMA01} />}</section>

        <section className="home-main-section">
          {ranking.status && (
            <VideosHorizontal content={ranking.data} template="rank" title="🍿 리뷰니버스 TOP 20"></VideosHorizontal>
          )}

          {screensMA02 && (
            <VideosHorizontal
              content={screensMA02.content.list}
              template={screensMA02.content.template}
              title={screensMA02.title}
            ></VideosHorizontal>
          )}

          {screensMA03 && (
            <VideosHorizontal
              content={screensMA03.content.list}
              template={screensMA03.content.template}
              title={screensMA03.title}
            ></VideosHorizontal>
          )}
          {screensMA04 && (
            <VideosHorizontal
              content={screensMA04.content.list}
              template={screensMA04.content.template}
              title={screensMA04.title}
            ></VideosHorizontal>
          )}

          {screensMA05 && (
            <VideosHorizontal
              content={screensMA05.content.list}
              template={screensMA05.content.template}
              title={screensMA05.title}
            ></VideosHorizontal>
          )}

          {videos && (
            <Videos videos={videos} handlePage={handlePage}>
              <div className="vertical-title-wrapper">
                <h2 className="vertical-title">🍟 이건 어때요?</h2>
              </div>
            </Videos>
          )}
        </section>
      </main>
    </Suspense>
  );
};

export default Home;
