import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Videos from "/src/components/Videos";
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

const Production = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { productionId } = useParams();
  const productionId2Int = fParseInt(productionId);
  const name = location.state?.name;
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState(null);
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideos({
    query: productionId2Int,
    page,
    mode: "id",
    target: "production",
    orderBy: "release_desc",
    enabled: productionId2Int || !isEmpty(name),
  });

  // productionId가 숫자형이 아닐 경우, location state에 name이 없을 경우
  useEffect(() => {
    if (productionId2Int === 0 || isEmpty(name)) {
      return navigate("/404-not-found");
    }
  }, [productionId2Int, name, navigate]);

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

  const title = `${name} - 리뷰니버스`;
  const description = `${name}의 ${videos.total}개 작품`;
  const imageUrl = DEFAULT_IMAGES.logo;
  const url = `${SETTINGS.DOMAIN_URL}/productions/${productionId2Int}`;

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

      <main className="production-main-container">
        <section className="production-section">
          <div className="production-title-wrapper">
            <h1 className="production-title">{name}</h1>
          </div>
        </section>
        <Videos videos={videos} handlePage={handlePage} />
      </main>
    </>
  );
};

export default Production;
