import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import HttpClient from "/src/utils/HttpClient";
import { useMobileContext } from "/src/context/MobileContext";
import SearchModal from "/src/components/Modal/SearchModal";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { formatYear } from "/src/utils/format";
import { formatPoster, formatCountry } from "/src/utils/contentFormat";
import { isEmpty } from "lodash";
import { DEFAULT_IMAGES } from "/src/config/images";
import "/src/styles/Search.css";
import { cLog, cError } from "/src/utils/test";

const API_BASE_URL = "https://comet.orbitcode.kr/v1";

/**
 * TODO:
 * - loding 상태 추가
 * - skeleton ui 추가
 */

const Search = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query");
  const [searchMovies, setSearchMovies] = useState(null);
  const { isMobile } = useMobileContext();

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
          {searchMovies.map((movie, index) => (
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
        </div>
      </div>
    );
  };

  const fetchData = async (query) => {
    try {
      const client = new HttpClient();
      const res = await client.get(`${API_BASE_URL}/contents/videos`, {
        q: query,
      });
      if (res.status === 200) {
        setSearchMovies(res.data.data);
      } else if (res.status === 204) {
        cLog("검색 결과가 없습니다.");
        setSearchMovies([]);
      }
    } catch (error) {
      cError(error);
      setSearchMovies([]);
    }
  };

  useEffect(() => {
    if (!query) return;

    fetchData(query);

    return () => {
      setSearchMovies([]);
    };
  }, [query, location]);

  return (
    <main className="search-main">
      <section className="search-result">
        <p>"{query}"의 검색결과</p>
      </section>
      <section className="search-contents">{isEmpty(searchMovies) ? renderEmpty() : renderMovies()}</section>
      {isMobile && isEmpty(query) && <SearchModal />}
    </main>
  );
};

export default Search;
