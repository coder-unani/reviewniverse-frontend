import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VideosHorizontal from "/src/components/VideosHorizontal";
import Videos from "/src/components/Videos";
import { useScreenVideos } from "/src/hooks/useScreenVideos";
import { useVideos } from "/src/hooks/useVideos";
import { showErrorToast } from "/src/components/Toast";
import { SCREEN_SERIES_ID } from "/src/config/codes";
import { VIDEO_ORDER_OPTIONS } from "/src/config/constants";
import { MESSAGES } from "/src/config/messages";
import { ENDPOINTS } from "/src/config/endpoints";
import { fArrayRandomValue } from "/src/utils/format";
import { isEmpty } from "lodash";

const Series = () => {
  const navigate = useNavigate();
  const code = 11;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [orderBy, setOrderBy] = useState(fArrayRandomValue(VIDEO_ORDER_OPTIONS));
  const [videos, setVideos] = useState(null);
  const {
    data: screens,
    error: screensError,
    isLoading: screensIsLoading,
  } = useScreenVideos({ code: SCREEN_SERIES_ID });
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideos({ page, orderBy, code, enabled: hasMore });

  useEffect(() => {
    if (videosIsLoading || !videosData || !hasMore) {
      return;
    }
    if (!videosData.status) {
      if (videosData.code === "C001") {
        // TODO: 고도화 필요
        if (page > 1) setPage((prev) => prev - 1);
        // showErrorToast(MESSAGES["C001"]);
        return;
      } else {
        return navigate(ENDPOINTS.ERROR);
      }
    }
    if (page === 1) {
      setVideos({ ...videosData.data });
    } else {
      if (page === 5) setHasMore(false);
      setVideos((prev) => {
        if (prev.page === videosData.data.page) return prev;
        return {
          ...prev,
          count: videosData.data.count,
          page: videosData.data.page,
          data: prev.data ? [...prev.data, ...videosData.data.data] : [],
        };
      });
    }
  }, [videosIsLoading, videosData, hasMore, page]);

  const handlePage = (newPage) => {
    setPage(newPage);
  };

  if (screensIsLoading) {
  }

  if (screensError || videosError) {
    return navigate(ENDPOINTS.ERROR);
  }

  return (
    <main className="main">
      {!isEmpty(screens) && screens.map((content, index) => <VideosHorizontal key={index} content={content} />)}
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

export default Series;
