import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import HttpClient from "/src/utils/HttpClient";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { isEmpty } from "lodash";
import "swiper/css";
import { formatYear } from "/src/utils/format";
import { formatPoster, formatCountry } from "/src/utils/contentFormat";
import "/src/styles/MovieList.css";
import { cLog, cError } from "/src/utils/test";

const MovieList = (props) => {
  const { type } = props;
  // 렌더링할 데이터
  const [movies, setMovies] = useState([]);
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

  // 데이터 요청
  const fetchData = async () => {
    try {
      const client = new HttpClient();
      const res = await client.get("https://comet.orbitcode.kr/v1/contents/videos", {
        p: page,
        ps: pageSize,
        t: type,
        ob: "new_desc",
      });

      if (res.status === 200 && res.code === "VIDEO_SEARCH_SUCC") {
        if (isEmpty(res.data.data)) {
          setHasMore(false);
          return;
        }
        setMovies((prevMovies) => [...prevMovies, ...res.data.data]);
      } else {
        cLog("영화 목록을 불러오는데 실패하였습니다.");
        return;
      }
    } catch (error) {
      cError(error);
    }
  };

  // 페이지가 변경될 때마다 데이터 요청
  useEffect(() => {
    fetchData();
  }, [page]);

  if (isEmpty(movies)) return null;

  return (
    <section className="all-list-wrapper">
      <div className="title-wrapper">
        <h2 className="title">주인님 내 새끼 구경 좀 해봐요 🦦</h2>
      </div>
      <div className="list-wrapper">
        {movies.map((movie, index) => (
          <article className="content" key={index}>
            <Link to={`/contents/${movie.id}`}>
              <div className="img-wrapper">
                <figure className="thumbnail">
                  <LazyLoadImage src={formatPoster(movie.thumbnail)} alt="썸네일" effect="blur" />
                </figure>
              </div>
              <div className="info">
                <p className="title">{movie.title}</p>
                <div className="sub-title">
                  <span>{formatYear(movie.release)}</span>
                  <span>|</span>
                  <span>{formatCountry(movie.country)}</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
        {hasMore && <article ref={lastItemRef}></article>}
      </div>
    </section>
  );
};

export default MovieList;
