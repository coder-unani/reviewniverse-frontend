import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VideosLike from "/src/components/VideosLike";
import { useUserLikes } from "/src/hooks/useUserLikes";
import { showErrorToast } from "/src/components/Toast";
import { MESSAGES } from "/src/config/messages";
import { fParseInt } from "/src/utils/format";
import { isEmpty } from "lodash";

const UserLikes = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const userId2Int = fParseInt(userId);
  const [videos, setVideos] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useUserLikes({
    userId: userId2Int,
    page,
    pageSize,
    orderBy: "created_at_desc",
    enabled: userId2Int,
  });

  useEffect(() => {
    if (userId2Int === 0) {
      return navigate("/404-not-found");
    }
  }, [userId2Int, navigate]);

  useEffect(() => {
    if (videosIsLoading || !videosData) {
      return;
    }
    if (!videosData.status) {
      if (videosData.code === "C001") {
        // TODO: 고도화 필요
        if (page > 1) setPage((prev) => prev - 1);
        // showErrorToast(MESSAGES["C001"]);
        return;
      } else {
        return navigate("/error");
      }
    }
    if (page === 1) {
      setVideos({ ...videosData.data });
    } else {
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
  }, [videosIsLoading, videosData, page]);

  const handlePage = (newPage) => {
    setPage(newPage);
  };

  if (videosError) {
    return navigate("/error");
  }

  if (isEmpty(videos)) {
    return <main className="ratings-main-container"></main>;
  }

  return (
    <main className="ratings-main-container">
      <section className="ratings-title-section">
        <strong className="ratings-title">
          <em>{videos.user.nickname}</em> 님이 좋아하는 작품이 {videos.total} 개 있어요
        </strong>
      </section>
      {!isEmpty(videos.data) && <VideosLike videos={videos} handlePage={handlePage} />}
    </main>
  );
};

export default UserLikes;
