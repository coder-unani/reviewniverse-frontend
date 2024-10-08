import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { EndpointManager, ENDPOINTS } from "/src/config/endpoints";
import { fYear } from "/src/utils/format";
import { fVideoCode, fThumbnail } from "/src/utils/formatContent";

const VideoLikeItem = ({ video }) => {
  const path = EndpointManager.generateUrl(ENDPOINTS.VIDEO_DETAIL, { videoId: video.video.id });

  return (
    <Link to={path} className="default-video-item" aria-label={video.video.title}>
      <div className="default-thumbnail-container">
        <picture className="default-thumbnail-wrapper">
          <LazyLoadImage
            className="default-thumbnail"
            src={fThumbnail(video.video.thumbnail)}
            alt="썸네일"
            effect="blur"
          />
        </picture>
        <div className="default-code-wrapper">
          <div className="default-code">{fVideoCode(video.code)}</div>
        </div>
      </div>
      <div className="default-info-container">
        <p className="default-title">{video.video.title}</p>
        <div className="default-subtitle-wrapper">
          <div className="default-subtitle">
            <span>{fYear(video.video.release)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoLikeItem;
