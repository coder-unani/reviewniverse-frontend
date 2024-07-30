import React, { useState } from "react";
import Videos from "/src/components/Videos";
import { useAuthContext } from "/src/context/AuthContext";
import { useVideos } from "/src/hooks/useVideos";
import { isEmpty } from "lodash";

const UserRatings = () => {
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
    orderBy,
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
    <main className="ratings-main">
      <div className="ratings-wrapper">
        <div className="ratings">{!isEmpty(videos) && <Videos videos={videos} handlePage={handlePage} />}</div>
      </div>
    </main>
  );
};

export default UserRatings;
