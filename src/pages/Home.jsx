import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SwiperPreview from "/src/components/SwiperPreview";
import VideosHorizontal from "/src/components/VideosHorizontal";
import Videos from "/src/components/Videos";
import { useScreenVideos } from "/src/hooks/useScreenVideos";
import { useRankingVideos } from "/src/hooks/useRankingVideos";
import { useVideos } from "/src/hooks/useVideos";
import { SCREEN_MAIN_ID } from "/src/config/codes";
import { VIDEO_ORDER_OPTIONS } from "/src/config/constants";
import { fArrayRandomValue } from "/src/utils/format";
import { fScreenCode } from "/src/utils/formatContent";

const Home = () => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // const [orderBy, setOrderBy] = useState(fArrayRandomValue(VIDEO_ORDER_OPTIONS));
  const [videos, setVideos] = useState({ count: 0, page: 1, data: [] });
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

  const handlePage = (page) => {
    setPage(page);
  };

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
    if (!videosData || !hasMore) return;
    if (page === 1) {
      setVideos(videosData);
    } else {
      // if (page === 5) setHasMore(false);
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

  // TODO: 로딩중일때 표시할 화면 (스켈레톤 UI)
  // if (screensIsLoading || rankingIsLoading || videosIsLoading) return null;
  if (screensIsLoading || rankingIsLoading) return;

  if (screensError || rankingError || videosError) return navigate("/error");

  return (
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
  );
};

export default Home;
