import React, { useMemo } from "react";
import { useVideoDetailContext } from "/src/context/VideoDetailContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { fThumbnail } from "/src/utils/formatContent";

const VideoSectionPoster = React.memo(() => {
  const { content } = useVideoDetailContext();
  const poster = useMemo(() => fThumbnail(content.data.thumbnail), [content.data.thumbnail]);

  return (
    <section className="detail-poster-section">
      <picture className="detail-poster-wrapper">
        {/* <LazyLoadImage className="detail-poster" src={poster} alt="포스터" effect="blur" /> */}
        <img className="detail-poster" src={poster} alt="포스터" />
      </picture>
    </section>
  );
});

export default VideoSectionPoster;
