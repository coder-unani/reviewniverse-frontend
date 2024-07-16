import React, { useState, useRef, useCallback } from "react";
import VideoItem from "/src/components/VideoItem";
import { isEmpty } from "lodash";
import "/src/styles/Videos.css";

const Videos = ({ videos, handlePage }) => {
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const lastItemRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          handlePage((prevPage) => {
            const nextPage = prevPage + 1;
            // 5페이지까지만 불러오기
            if (nextPage === 5) setHasMore(false);
            return nextPage;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  if (isEmpty(videos)) return null;

  return (
    <section className="videos-wrapper">
      <div className="title-wrapper">
        <h2 className="title">주인님 내 새끼 구경 좀 해봐요 🦦</h2>
      </div>
      <div className="list-wrapper">
        {videos.data.map((video, index) => (
          <VideoItem key={index} video={video} />
        ))}
        {hasMore && <article ref={lastItemRef}></article>}
      </div>
    </section>
  );
};

export default Videos;
