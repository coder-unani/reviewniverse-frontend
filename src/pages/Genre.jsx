import React, { useState, useEffect } from "react";
import Videos from "/src/components/Videos";
import { useSearchParams } from "react-router-dom";
import { useVideosSearch } from "/src/hooks/useVideosSearch";
import { isEmpty } from "lodash";
import "/src/styles/Genre.css";

const Genre = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("genre");
  const [videos, setVideos] = useState({});
  const [page, setPage] = useState(1);
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideosSearch({
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

  if (isEmpty(videos)) return;

  return (
    <main className="genre-main">
      <section className="genre-wrapper">
        <div className="genre">
          <h1 className="title">{formatQuery(query)}</h1>
        </div>
      </section>
      <Videos videos={videos} handlePage={handlePage} />
    </main>
  );
};

export default Genre;
