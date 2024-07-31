import React, { useState, useEffect } from "react";
import Videos from "/src/components/Videos";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVideos } from "/src/hooks/useVideos";
import { SETTINGS } from "/src/config/settings";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { isEmpty } from "lodash";
import "/src/styles/Genre.css";

const Genre = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("genre");
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState({ count: 0, page: 1, data: [] });
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideos({
    query,
    page,
    target: "genre",
    orderBy: "view_desc",
  });

  const formatQuery = (query) => {
    // , 구분으로 array로 변환
    const genre = query.split(",");
    // 배열 요소 앞에 # 붙이기
    const result = genre.map((item) => `#${item}`);
    return result.join(" ");
  };

  const handlePage = (page) => {
    setPage(page);
  };

  // TODO: searchParams가 없을 경우는?(임시조치)
  useEffect(() => {
    if (!query) navigate("/404-not-found");
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

  if (isEmpty(videos) || !query) return;

  return (
    <>
      <Helmet>
        <title>{query}의 검색결과 - 리뷰니버스</title>
        {/* noindex, noimageindex */}
        {/* <meta content="noindex, noimageindex" name="robots" data-rh="true" /> */}
        <meta name="description" content={`${query}의 검색결과 - 리뷰니버스`} />
        <meta property="og:title" content={`${query}의 검색결과 - 리뷰니버스`} />
        <meta property="og:description" content={`${query}의 검색결과 - 리뷰니버스`} />
        <meta property="og:image" content={DEFAULT_IMAGES.logo} />
        <meta property="og:url" content={`${SETTINGS.DOMAIN_URL}/genre/${query}`} />
      </Helmet>
      <main className="genre-main">
        <section className="genre-wrapper">
          <div className="genre">
            <h1 className="title">{formatQuery(query)}</h1>
          </div>
        </section>
        <Videos videos={videos} handlePage={handlePage} />
      </main>
    </>
  );
};

export default Genre;
