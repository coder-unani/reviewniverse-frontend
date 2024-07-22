import React, { useState, useEffect } from "react";
import Videos from "/src/components/Videos";
import SearchModal from "/src/components/Modal/SearchModal";
import { useSearchParams } from "react-router-dom";
import { useVideosSearch } from "/src/hooks/useVideosSearch";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [searchVideos, setSearchVideos] = useState({});
  const [page, setPage] = useState(1);
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideosSearch({
    query,
    page,
  });

  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    if (!query) return;
    setPage(1);
    setSearchVideos({});
  }, [query]);

  useEffect(() => {
    if (isEmpty(videosData)) return;
    if (videosData.status === 200) {
      if (page === 1) {
        setSearchVideos(videosData.data);
      } else {
        setSearchVideos((prev) => {
          return {
            ...prev,
            count: videosData.data.count,
            page: videosData.data.page,
            data: [...prev.data, ...videosData.data.data],
          };
        });
      }
    } else if (videosData.status === 204) {
      setSearchVideos({ data: [] });
    } else {
      setSearchVideos({ data: [] });
      // throw new Error("검색 데이터를 불러오는데 실패했습니다.");
    }
  }, [page, videosData]);

  if (isEmpty(searchVideos)) return;

  return (
    <main className="search-main">
      <section className="search-result">
        <p>
          "{query}"의 검색결과 {searchVideos.total > 0 && <span>{searchVideos.total}</span>}
        </p>
      </section>
      <section className="search-contents">
        {isEmpty(searchVideos.data) ? (
          <div className="empty">
            <img src={DEFAULT_IMAGES.searchNotFound} alt="검색 결과 없음" />
            <p className="title">
              "<em>{query}</em>"에 대한 검색 결과가 없어요.
            </p>
            <p className="sub-title">입력한 검색어를 다시 한번 확인해주세요.</p>
          </div>
        ) : (
          <Videos videos={searchVideos} handlePage={handlePage} />
        )}
      </section>
      {isMobile && isEmpty(query) && <SearchModal />}
    </main>
  );
};

export default Search;
