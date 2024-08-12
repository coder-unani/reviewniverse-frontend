import React, { useState, useRef, useCallback, useEffect } from "react";
import VideoRatingItem from "/src/components/VideoRatingItem";
import { isEmpty } from "lodash";

const RatingVideos = ({ videos, handlePage, children }) => {
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

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

  useEffect(() => {
    if (videos.data && videos.total <= videos.data.length) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [videos]);

  if (isEmpty(videos) || isEmpty(videos.data)) return null;

  return (
    <section className="vertical-videos-section">
      {children}
      <div className="vertical-videos-wrapper">
        {videos.data.map((video, index) => (
          <VideoRatingItem key={index} video={video} />
        ))}
        {hasMore && <article ref={lastItemRef}></article>}
      </div>
    </section>
  );
};

export default RatingVideos;
