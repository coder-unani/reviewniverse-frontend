import React, { useState, useEffect } from "react";
import Videos from "/src/components/Videos";
import { Helmet } from "react-helmet-async";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useVideos } from "/src/hooks/useVideos";
import { SETTINGS } from "/src/config/settings";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { isEmpty } from "lodash";

const Production = () => {
  const navigate = useNavigate();
  const { productionId: id } = useParams();
  const productionId = parseInt(id);
  const location = useLocation();
  // TODO: 고도화 필요
  const name = location.state?.name;
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState({ count: 0, page: 1, data: [] });
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideos({
    query: productionId,
    page,
    mode: "id",
    target: "production",
    orderBy: "release_desc",
  });

  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    if (isNaN(productionId) || !name) navigate("/404-not-found");
  }, []);

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

  // TODO: videos가 없으면 not found 페이지로 이동
  if (isEmpty(videos)) return;

  return (
    <>
      <Helmet>
        <title>{name} - 리뷰니버스</title>
        <meta name="description" content={`${name}의 ${videos.total}개 작품`} />
        <meta property="og:title" content={`${name} - 리뷰니버스`} />
        <meta property="og:description" content={`${name}의 ${videos.total}개 작품`} />
        <meta property="og:image" content={DEFAULT_IMAGES.logo} />
        <meta property="og:url" content={`${SETTINGS.DOMAIN_URL}/genre/${productionId}`} />
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
