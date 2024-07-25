import React, { useState, useEffect } from "react";
import Videos from "/src/components/Videos";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useVideos } from "/src/hooks/useVideos";
import { isEmpty } from "lodash";
import "/src/styles/Production.css";

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
    <main className="production-main">
      <section className="production-wrapper">
        <div className="production">
          <h1 className="title">{name}</h1>
        </div>
      </section>
      <Videos videos={videos} handlePage={handlePage} />
    </main>
  );
};

export default Production;
