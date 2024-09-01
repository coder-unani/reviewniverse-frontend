import React, { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SkeletonHome from "/src/components/Skeleton/Home";
import { useScreenVideos } from "/src/hooks/useScreenVideos";
import { useRankingVideos } from "/src/hooks/useRankingVideos";
import { useRankingGenres } from "/src/hooks/useRankingGenres";
import { useVideos } from "/src/hooks/useVideos";
import { showErrorToast } from "/src/components/Toast";
import { fScreenCode } from "/src/utils/formatContent";
import { SCREEN_MAIN_ID } from "/src/config/codes";
import { VIDEO_ORDER_OPTIONS, VIDEO_TERMS_OPTIONS } from "/src/config/constants";
import { MESSAGES } from "/src/config/messages";
import { ENDPOINTS } from "/src/config/endpoints";
import LayoutIcon from "/src/assets/button/outline-layout.svg?react";

// 코드 스플리팅을 위한 동적 임포트
const SwiperPreview = React.lazy(() => import("/src/components/SwiperPreview"));
const SwiperGenre = React.lazy(() => import("/src/components/SwiperGenre"));
const VideosHorizontal = React.lazy(() => import("/src/components/VideosHorizontal"));
const Videos = React.lazy(() => import("/src/components/Videos"));

const Home = () => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [videos, setVideos] = useState(null);
  const {
    data: screenVideos,
    error: screenVidoesError,
    isLoading: screenVideosIsLoading,
  } = useScreenVideos({ code: SCREEN_MAIN_ID, display: "detail" });
  const {
    data: rankingVideos,
    error: rankingVideosError,
    isLoading: rankingVideosIsLoading,
  } = useRankingVideos({ code: today, count: 20 });
  const {
    data: rankingGenres,
    error: rankingGenresError,
    isLoading: rankingGenresIsLoading,
  } = useRankingGenres({ count: 50 });
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideos({
    page,
    orderBy: VIDEO_ORDER_OPTIONS,
    terms: VIDEO_TERMS_OPTIONS[0],
    enabled: hasMore,
  });
  const [screensMA01, setScreensMA01] = useState(null);
  const [screensMA02, setScreensMA02] = useState(null);
  const [screensMA03, setScreensMA03] = useState(null);
  const [screensMA04, setScreensMA04] = useState(null);
  const [screensMA05, setScreensMA05] = useState(null);

  // 헤더 스타일 변경
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

  // TODO: 스크린 코드별로 데이터 분리 및 state에 저장, 정리 필요
  useEffect(() => {
    if (screenVideosIsLoading || !screenVideos.status) return;
    setScreensMA01(fScreenCode(screenVideos.data, "MA01"));
    setScreensMA02(fScreenCode(screenVideos.data, "MA02"));
    setScreensMA03(fScreenCode(screenVideos.data, "MA03"));
    setScreensMA04(fScreenCode(screenVideos.data, "MA04"));
    setScreensMA05(fScreenCode(screenVideos.data, "MA05"));
  }, [screenVideosIsLoading, screenVideos]);

  // 비디오 데이터 무한 스크롤 구현
  // TODO: useInfiniteQuery 사용하여 무한 스크롤 구현해보기
  useEffect(() => {
    if (videosIsLoading || !videosData || !hasMore) {
      return;
    }

    // TODO: 고도화 필요
    if (!videosData.status) {
      // 429 Too Many Requests 에러 처리
      if (videosData.code === "C001") {
        if (page === 1) {
          // 첫 페이지에서 429 에러 발생 시 에러 페이지로 이동
          return navigate(ENDPOINTS.ERROR);
        } else {
          // 429 에러 발생 시 페이지 번호를 줄여서 다시 요청
          showErrorToast(MESSAGES["C001"]);
          setPage((prev) => prev - 1);
          return;
        }
      } else {
        // 그 외 에러 발생 시 에러 페이지로 이동
        return navigate(ENDPOINTS.ERROR);
      }
    }

    if (page === 1) {
      // 첫 페이지일 경우 데이터를 그대로 저장
      setVideos({ ...videosData.data });
    } else {
      // 그 외 페이지일 경우 기존 데이터에 추가
      setVideos((prev) => {
        // 이전 페이지와 현재 페이지가 같을 경우 데이터를 그대로 반환
        if (prev.page === videosData.data.page) {
          return prev;
        }
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
    // 5페이지까지만 불러오기
    if (newPage === 6) {
      setHasMore(false);
    }
    setPage(newPage);
  };

  // 스켈리톤 로딩 UI 적용
  if (screenVideosIsLoading || rankingVideosIsLoading || rankingGenresIsLoading) {
    return <SkeletonHome />;
  }

  // 에러 발생 시 에러 페이지로 이동
  if (screenVidoesError || rankingVideosError || rankingGenresError || videosError) {
    return navigate(ENDPOINTS.ERROR);
  }

  return (
    <Suspense fallback={<SkeletonHome />}>
      <main className="home-main-container">
        <section className="home-preview-section">{screensMA01 && <SwiperPreview screensMA01={screensMA01} />}</section>

        <section className="home-main-section">
          {rankingVideos.status && (
            <VideosHorizontal
              content={rankingVideos.data}
              template="rank"
              title="🍿 리뷰니버스 TOP 20"
            ></VideosHorizontal>
          )}

          {rankingGenres.status && (
            <SwiperGenre content={rankingGenres.data}>
              <div className="horizontal-title-wrapper">
                <h2 className="horizontal-title genre">
                  <LayoutIcon />
                  장르
                </h2>
              </div>
            </SwiperGenre>
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
