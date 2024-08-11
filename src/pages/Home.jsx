import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PreviewSwiper from "/src/components/PreviewSwiper";
import HVideos from "/src/components/HVideos";
import Videos from "/src/components/Videos";
import { useScreenVideos } from "/src/hooks/useScreenVideos";
import { useRankingVideos } from "/src/hooks/useRankingVideos";
import { useVideos } from "/src/hooks/useVideos";
import { SCREEN_PREVIEW_ID, SCREEN_MAIN_ID } from "/src/config/codes";
import { VIDEO_ORDER_OPTIONS } from "/src/config/constants";
import { formatScreens } from "/src/utils/formatContent";

const Home = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // const [orderBy, setOrderBy] = useState(arrayRandomValue(VIDEO_ORDER_OPTIONS));
  const [videos, setVideos] = useState({ count: 0, page: 1, data: [] });
  const {
    data: previews,
    error: previewsError,
    isLoading: previewsIsLoading,
  } = useScreenVideos({ code: SCREEN_PREVIEW_ID, display: "detail" });
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
    if (previewsIsLoading || screensIsLoading || !previews.status || !screens.status) return;
    setScreensMA01(formatScreens(previews.data, SCREEN_PREVIEW_ID));
    setScreensMA02(formatScreens(screens.data, "MA02"));
    setScreensMA03(formatScreens(screens.data, "MA03"));
    setScreensMA04(formatScreens(screens.data, "MA04"));
    setScreensMA05(formatScreens(screens.data, "MA05"));
  }, [previews, screens]);

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

  // TODO: 로딩중일때 표시할 화면 (스켈레톤 UI)
  // if (previewsIsLoading || screensIsLoading || rankingIsLoading || videosIsLoading) return null;
  if (previewsIsLoading || screensIsLoading || rankingIsLoading) return;

  if (previewsError || screensError || rankingError || videosError) return navigate("/error");

  return (
    <main className="home-main-container">
      <section className="home-preview-section">{screensMA01 && <PreviewSwiper screensMA01={screensMA01} />}</section>

      <section className="home-main-section">
        {ranking.status && <HVideos content={ranking.data} template="rank" title="🍿 리뷰니버스 TOP 20"></HVideos>}

        {screensMA02 && (
          <HVideos
            content={screensMA02.content.list}
            template={screensMA02.content.template}
            title={screensMA02.title}
          ></HVideos>
        )}

        {screensMA03 && (
          <HVideos
            content={screensMA03.content.list}
            template={screensMA03.content.template}
            title={screensMA03.title}
          ></HVideos>
        )}
        {screensMA04 && (
          <HVideos
            content={screensMA04.content.list}
            template={screensMA04.content.template}
            title={screensMA04.title}
          ></HVideos>
        )}

        {screensMA05 && (
          <HVideos
            content={screensMA05.content.list}
            template={screensMA05.content.template}
            title={screensMA05.title}
          ></HVideos>
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
