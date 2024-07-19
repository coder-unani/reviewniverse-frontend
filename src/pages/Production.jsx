import React, { useState, useEffect } from "react";
import Videos from "/src/components/Videos";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useVideosSearch } from "/src/hooks/useVideosSearch";
import { isEmpty } from "lodash";
import "/src/styles/Production.css";

const Production = () => {
  const navigate = useNavigate();
  const { productionId: id } = useParams();
  const productionId = parseInt(id);
  const location = useLocation();
  const name = location.state?.name;
  const [videos, setVideos] = useState({});
  const [page, setPage] = useState(1);
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideosSearch({
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
    if (isEmpty(videosData)) return;
  }, [productionId, videosData]);

  useEffect(() => {
    if (isEmpty(videosData)) return;
    if (videosData.status === 200) {
      if (page === 1) {
        setVideos(videosData.data);
      } else {
        setVideos((prev) => {
          return {
            ...prev,
            count: videosData.data.count,
            page: videosData.data.page,
            data: [...prev.data, ...videosData.data.data],
          };
        });
      }
    } else {
      setVideos({ data: [] });
    }
  }, [page, videosData]);

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
