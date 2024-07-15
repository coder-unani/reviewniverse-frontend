import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import HttpClient from "/src/utils/HttpClient";
import { useMobileContext } from "/src/context/MobileContext";
import SearchModal from "/src/components/Modal/SearchModal";
import { isEmpty } from "lodash";
import { DEFAULT_IMAGES } from "/src/config/constants";
import "/src/styles/Search.css";
import { cLog, cError } from "/src/utils/test";
import VideoItem from "../components/VideoItem";

const API_BASE_URL = "https://comet.orbitcode.kr/v1";

/**
 * TODO:
 * 1. loding 상태 추가
 * 2. skeleton ui 추가
 */

const Search = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query");
  const [searchVideos, setSearchVideos] = useState([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const { isMobile } = useMobileContext();
  // 현재 페이지
  const [page, setPage] = useState(1);
  // 더 불러올 데이터가 있는지
  const [hasMore, setHasMore] = useState(true);
  // 한 번에 불러올 데이터 개수
  const pageSize = 20;

  // 무한 스크롤 기능
  const observer = useRef();
  const lastItemRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const fetchData = async (query) => {
    try {
      const client = new HttpClient();
      const res = await client.get(`${API_BASE_URL}/contents/videos`, {
        q: query,
        p: page,
        ps: pageSize,
      });

      if (res.status === 200) {
        if (isEmpty(res.data.data) || res.data.data.length < pageSize) {
          setHasMore(false);
        }
        setSearchTotal(res.data.total);
        setSearchVideos((preVideos) => [...preVideos, ...res.data.data]);
      } else if (res.status === 204) {
        cLog("검색 결과가 없습니다.");
        setSearchVideos([]);
      }
    } catch (error) {
      cError(error);
      setSearchVideos([]);
    }
  };

  const renderEmpty = () => {
    return (
      <div className="empty">
        <img src={DEFAULT_IMAGES.noSearch} alt="검색 결과 없음" />
        <p className="title">
          "<em>{query}</em>"에 대한 검색 결과가 없어요.
        </p>
        <p className="sub-title">입력한 검색어를 다시 한번 확인해주세요.</p>
      </div>
    );
  };

  const renderMovies = () => {
    return (
      <div className="search-list-wrapper">
        <div className="list-wrapper">
          {searchVideos.map((video, index) => (
            <VideoItem key={index} video={video} />
          ))}
          {hasMore && <article ref={lastItemRef}></article>}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!query) return;

    // 검색어가 변경될 때마다 데이터 초기화
    setSearchVideos([]);
    setSearchTotal(0);
    setPage(1);
    setHasMore(true);

    fetchData(query);

    return () => {
      setSearchVideos([]);
    };
  }, [query, location]);

  useEffect(() => {
    // 페이지가 변경될 때마다 데이터 요청
    if (page === 1) return;

    fetchData(query);
  }, [page]);

  return (
    <main className="search-main">
      <section className="search-result">
        <p>
          "{query}"의 검색결과 {searchTotal > 0 && <span>{searchTotal}</span>}
        </p>
      </section>
      <section className="search-contents">{isEmpty(searchVideos) ? renderEmpty() : renderMovies()}</section>
      {isMobile && isEmpty(query) && <SearchModal />}
    </main>
  );
};

export default Search;
