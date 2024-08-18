import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Videos from "/src/components/Videos";
import SearchModal from "/src/components/Modal/Search";
import { useThemeContext } from "/src/context/ThemeContext";
import { useVideos } from "/src/hooks/useVideos";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { isEmpty } from "lodash";

/**
 * TODO:
 * - loading 상태 추가
 * - skeleton ui 추가
 */

const Search = () => {
  const navigate = useNavigate();
  const { isMobile } = useThemeContext();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState({ count: 0, page: 1, data: [] });
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideos({
    query,
    page,
    enabled: query,
  });

  useEffect(() => {
    if (!query) {
      return;
    }
    setPage(1);
    setVideos({ count: 0, page: 1, data: [] });
  }, [query]);

  useEffect(() => {
    if (videosIsLoading || !videosData) {
      return;
    }
    if (!videosData.status) {
      return navigate("/error");
    }
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
  }, [videosIsLoading, videosData, page]);

  const handlePage = (page) => {
    setPage(page);
  };

  if (videosError) {
    return navigate("/error");
  }

  return (
    <main className="search-main-container">
      <section className="search-content-section">
        {isEmpty(videos.data) ? (
          <div className="no-search-content">
            <img className="no-search-image" src={DEFAULT_IMAGES.searchNotFound} alt="검색 결과 없음" />
            <p className="no-search-title">
              "<em>{query}</em>"에 대한 검색 결과가 없어요.
            </p>
            <p className="no-search-subtitle">입력한 검색어를 다시 한번 확인해주세요.</p>
          </div>
        ) : (
          <>
            <strong className="search-content-title">
              "<em>{query}</em>"의 검색 결과가 {videos.total} 개 있어요
            </strong>
            <Videos videos={videos} handlePage={handlePage} />
          </>
        )}
      </section>
      {isMobile && isEmpty(query) && <SearchModal />}
    </main>
  );
};

export default Search;
