import React, { useState, useEffect } from "react";
import RatingVideos from "/src/components/RatingVideos";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useUser } from "/src/hooks/useUser";
import { useVideos } from "/src/hooks/useVideos";
import { isEmpty } from "lodash";

const UserRatings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId: id } = useParams();
  const userId = parseInt(id);
  const { nickname } = location.state || "";
  const { user } = useAuthContext();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [videos, setVideos] = useState({ count: 0, page: 1, data: [] });
  // 비디오 리스트
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideos({
    page,
    orderBy: "new_desc",
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

  return (
    <main className="ratings-main-container">
      <section className="ratings-content-section">
        <strong className="ratings-content-title">
          <em>{nickname}</em> 님이 평가한 작품이 {videos.total} 개 있어요
        </strong>
      </section>
      {!isEmpty(videos) && <RatingVideos videos={videos} handlePage={handlePage} />}
    </main>
  );
};

export default UserRatings;
