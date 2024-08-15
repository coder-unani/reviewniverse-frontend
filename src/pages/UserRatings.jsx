import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VideosRating from "/src/components/VideosRating";
import { useUserRatings } from "/src/hooks/useUserRatings";
import { showErrorToast } from "/src/components/Toast";
import { MESSAGES } from "/src/config/messages";
import { fParseInt } from "/src/utils/format";
import { isEmpty } from "lodash";

const UserRatings = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [videos, setVideos] = useState({ count: 0, page: 1, total: 0, data: [], user: {} });
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const userId2Int = fParseInt(userId);

  // 비디오 리스트
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useUserRatings({
    userId: userId2Int,
    page,
    pageSize,
    orderBy: "rating_desc",
    enabled: userId2Int,
  });

  // 페이지 변경
  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    if (userId2Int === 0) {
      showErrorToast(MESSAGES.U006);
      navigate("/404-not-found");
    }
  }, [userId2Int, navigate]);

  useEffect(() => {
    if (videosIsLoading || !videosData || !videosData.status) return;
    if (page === 1) {
      setVideos(videosData.data);
    } else {
      setVideos((prev) => {
        return {
          ...prev,
          count: videosData.data.count,
          page: videosData.data.page,
          data: [...prev.data, ...videosData.data.data],
        };
      });
    }
  }, [videosData, videosIsLoading, page]);

  if (videosIsLoading) return null;
  if (videosError) return navigate("/error");

  return (
    <main className="ratings-main-container">
      <section className="ratings-content-section">
        <strong className="ratings-content-title">
          <em>{videos.user.nickname}</em> 님이 평가한 작품이 {videos.total} 개 있어요
        </strong>
        {!isEmpty(videos.data) && <VideosRating videos={videos} handlePage={handlePage} />}
      </section>
    </main>
  );
};

export default UserRatings;
