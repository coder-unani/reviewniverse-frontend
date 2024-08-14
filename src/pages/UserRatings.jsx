import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RatingVideos from "/src/components/RatingVideos";
import { useUserRatings } from "/src/hooks/useUserRatings";
import { MESSAGES } from "/src/config/messages";
import { isEmpty } from "lodash";

const fetchVideosData = ({ userId, page, pageSize, navigate }) => {
  try {
    const userId2Int = parseInt(userId);

    if (isNaN(userId2Int)) {
      throw new Error(MESSAGES.U006);
    }

    const { data, error, isLoading } = useUserRatings({
      userId: userId2Int,
      page,
      pageSize,
      orderBy: "rating_desc",
    });

    return { data, error, isLoading };
  } catch (error) {
    navigate("/404-not-found");
  }
};

const UserRatings = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [videos, setVideos] = useState({ count: 0, page: 1, data: [], user: {} });
  // 비디오 리스트
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = fetchVideosData({
    userId,
    page,
    pageSize,
    navigate,
  });

  // 페이지 변경
  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    if (videosIsLoading || !videosData.status) return;
    if (page === 1) {
      setVideos(videosData.data);
    } else {
      setVideos((prev) => {
        return {
          ...prev,
          count: videosData.count,
          page: videosData.page,
          data: [...prev.data, ...videosData.data],
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
        {!isEmpty(videos) && !isEmpty(videos.data) && <RatingVideos videos={videos} handlePage={handlePage} />}
      </section>
    </main>
  );
};

export default UserRatings;
