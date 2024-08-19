import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Videos from "/src/components/Videos";
import { useVideos } from "/src/hooks/useVideos";
import { SETTINGS } from "/src/config/settings";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { fParseInt } from "/src/utils/format";
import { isEmpty } from "lodash";

const Production = () => {
  const navigate = useNavigate();
  const { productionId } = useParams();
  const productionId2Int = fParseInt(productionId);
  const location = useLocation();
  // TODO: 고도화 필요
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
  const url = `${SETTINGS.DOMAIN_URL}/genre/${productionId}`;

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
