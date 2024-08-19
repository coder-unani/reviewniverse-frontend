import React, { useState, useEffect } from "react";
import Videos from "/src/components/Videos";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVideos } from "/src/hooks/useVideos";
import { SETTINGS } from "/src/config/settings";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { isEmpty } from "lodash";

const Genre = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("genre");
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState(null);
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideos({
    query,
    page,
    target: "genre",
    orderBy: "view_desc",
    enabled: query,
  });

  // TODO: searchParams가 없을 경우는?(임시조치)
  useEffect(() => {
    if (!query) {
      return navigate("/404-not-found");
    }
  }, [query, navigate]);

  useEffect(() => {
    if (videosIsLoading || !videosData) {
      return;
    }
    if (!videosData.status) {
      return navigate("/error");
    }
    if (page === 1) {
      setVideos({ ...videosData.data });
    } else {
      setVideos((prev) => {
        return {
          ...prev,
          count: videosData.data.count,
          page: videosData.data.page,
          data: prev.data ? [...prev.data, ...videosData.data.data] : [],
        };
      });
    }
  }, [videosIsLoading, videosData, page]);

  const fQuery = (query) => {
    // , 구분으로 array로 변환
    const genre = query.split(",");
    // 배열 요소 앞에 # 붙이기
    const result = genre.map((item) => `#${item}`);
    return result.join(" ");
  };

  const handlePage = (newPage) => {
    setPage(newPage);
  };

  if (videosError) {
    return navigate("/error");
  }

  if (isEmpty(videos)) {
    return;
  }

  const title = `${query}의 검색결과 - 리뷰니버스`;
  const description = `${query}의 검색결과 - 리뷰니버스`;
  const imageUrl = DEFAULT_IMAGES.logo;
  const url = `${SETTINGS.DOMAIN_URL}/genre/${query}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        {/* noindex, noimageindex */}
        {/* <meta content="noindex, noimageindex" name="robots" data-rh="true" /> */}
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={url} />
      </Helmet>

      <main className="genre-main-container">
        <section className="genre-section">
          <div className="genre-title-wrapper">
            <h1 className="genre-title">{fQuery(query)}</h1>
          </div>
        </section>
        <Videos videos={videos} handlePage={handlePage} />
      </main>
    </>
  );
};

export default Genre;
