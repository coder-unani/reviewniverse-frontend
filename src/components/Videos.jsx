import React, { useState, useRef, useCallback, useEffect } from "react";
import VideoItem from "/src/components/VideoItem";
import { isEmpty } from "lodash";

const Videos = ({ children, videos, handlePage }) => {
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    if (videos.data && videos.total <= videos.data.length) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [videos]);

  const lastItemRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          handlePage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  if (isEmpty(videos.data)) {
    return;
  }

  return (
    <section className="vertical-videos-section">
      {children}
      <div className="vertical-videos-wrapper">
        {videos.data.map((video, index) => (
          <VideoItem key={index} video={video} />
        ))}
        {hasMore && <article ref={lastItemRef}></article>}
      </div>
    </section>
  );
};

export default Videos;
