import React, { useState, useEffect } from "react";
import Videos from "/src/components/Videos";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useVideos } from "/src/hooks/useVideos";
import { showErrorToast } from "/src/components/Toast";
import { SETTINGS } from "/src/config/settings";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { MESSAGES } from "/src/config/messages";
import { fParseInt } from "/src/utils/format";
import { isEmpty } from "lodash";

/**
 * TODO:
 * - location.state 말고 다른 방법으로 name을 받아오는 방법 찾기
 */

const Genre = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { genreId } = useParams();
  const genreId2Int = fParseInt(genreId);
  const name = location.state?.name;
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState(null);
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideos({
    query: genreId2Int,
    page,
    mode: "id",
    target: "genre",
    orderBy: "release_desc",
    enabled: genreId2Int || !isEmpty(name),
  });

  // genreId가 숫자형이 아닐 경우, location state에 name이 없을 경우
  useEffect(() => {
    if (genreId2Int === 0 || isEmpty(name)) {
      return navigate("/404-not-found");
    }
  }, [genreId2Int, name, navigate]);

  useEffect(() => {
    if (videosIsLoading || !videosData) {
      return;
    }
    if (!videosData.status) {
      if (videosData.code === "C001") {
        // TODO: 고도화 필요
        if (page === 1) {
          return navigate("/error");
        } else {
          // showErrorToast(MESSAGES["C001"]);
          setPage((prev) => prev - 1);
          return;
        }
      } else {
        return navigate("/error");
      }
    }
    if (page === 1) {
      setVideos({ ...videosData.data });
    } else {
      setVideos((prev) => {
        if (prev.page === videosData.data.page) return prev;
        return {
          ...prev,
          count: videosData.data.count,
          page: videosData.data.page,
          data: prev.data ? [...prev.data, ...videosData.data.data] : [...videosData.data.data],
        };
      });
    }
  }, [videosIsLoading, videosData, page]);

  const handlePage = (newPage) => {
    setPage(newPage);
  };

  if (videosError) {
    return navigate("/error");
  }

  if (isEmpty(videos)) {
    return;
  }

  const title = `${name}의 검색결과 - 리뷰니버스`;
  const description = `${name}의 검색결과 - 리뷰니버스`;
  const imageUrl = DEFAULT_IMAGES.logo;
  const url = `${SETTINGS.DOMAIN_URL}/genres/${genreId2Int}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={url} />
      </Helmet>

      <main className="genre-main-container">
        <section className="genre-section">
          <div className="genre-title-wrapper">
            <h1 className="genre-title">#{name}</h1>
          </div>
        </section>
        <Videos videos={videos} handlePage={handlePage} />
      </main>
    </>
  );
};

export default Genre;
