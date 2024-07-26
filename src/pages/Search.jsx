import React, { useState, useEffect } from "react";
import Videos from "/src/components/Videos";
import SearchModal from "/src/components/Modal/SearchModal";
import { useSearchParams } from "react-router-dom";
import { useVideos } from "/src/hooks/useVideos";
import { useThemeContext } from "/src/context/ThemeContext";
import { isEmpty } from "lodash";
import { DEFAULT_IMAGES } from "/src/config/constants";
import "/src/styles/Search.css";

/**
 * TODO:
 * - loading 상태 추가
 * - skeleton ui 추가
 */

const Search = () => {
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

  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    if (!query) return;
    setPage(1);
    setVideos({ count: 0, page: 1, data: [] });
  }, [query]);

  useEffect(() => {
    if (!videosData) return;
    if (page === 1) {
      setVideos(videosData);
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
  }, [videosData, page]);

  // if (isEmpty(videos)) return;

  return (
    <main className="search-main">
      <section className="search-result">
        <p>
          "{query}"의 검색결과 {videos.total > 0 && <span>{videos.total}</span>}
        </p>
      </section>
      <section className="search-contents">
        {isEmpty(videos.data) ? (
          <div className="empty">
            <img src={DEFAULT_IMAGES.searchNotFound} alt="검색 결과 없음" />
            <p className="title">
              "<em>{query}</em>"에 대한 검색 결과가 없어요.
            </p>
            <p className="sub-title">입력한 검색어를 다시 한번 확인해주세요.</p>
          </div>
        ) : (
          <Videos videos={videos} handlePage={handlePage} />
        )}
      </section>
      {isMobile && isEmpty(query) && <SearchModal />}
    </main>
  );
};

export default Search;
