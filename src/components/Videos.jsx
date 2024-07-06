import React, { useState, useEffect, useRef, useCallback } from "react";
import HttpClient from "/src/utils/HttpClient";
import VideoItem from "./VideoItem";
import { isEmpty } from "lodash";
import "/src/styles/Videos.css";
import { cLog, cError } from "/src/utils/test";

const API_BASE_URL = "https://comet.orbitcode.kr/v1";

const Videos = (props) => {
  const { type } = props;
  // 렌더링할 데이터
  const [videos, setVideos] = useState([]);
  // 현재 페이지
  const [page, setPage] = useState(1);
  // 더 불러올 데이터가 있는지
  const [hasMore, setHasMore] = useState(true);
  // 한 번에 불러올 데이터 개수
  const pageSize = 20;

  // 무한 스크롤 기능
  const observer = useRef();
  const lastItemRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  // 데이터 요청
  const fetchData = async () => {
    try {
      const client = new HttpClient();
      const res = await client.get(`${API_BASE_URL}/contents/videos`, {
        p: page,
        ps: pageSize,
        t: type,
        ob: "new_desc",
      });

      if (res.status === 200 && res.code === "VIDEO_SEARCH_SUCC") {
        if (isEmpty(res.data.data)) {
          setHasMore(false);
          return;
        }
        setVideos((prevMovies) => [...prevMovies, ...res.data.data]);
      } else {
        cLog("영화 목록을 불러오는데 실패하였습니다.");
        return;
      }
    } catch (error) {
      cError(error);
    }
  };

  // 페이지가 변경될 때마다 데이터 요청
  useEffect(() => {
    fetchData();
  }, [page]);

  if (isEmpty(videos)) return null;

  return (
    <section className="videos-wrapper">
      <div className="title-wrapper">
        <h2 className="title">주인님 내 새끼 구경 좀 해봐요 🦦</h2>
      </div>
      <div className="list-wrapper">
        {videos.map((video, index) => (
          <VideoItem key={index} video={video} />
        ))}
        {hasMore && <article ref={lastItemRef}></article>}
      </div>
    </section>
  );
};

export default Videos;
