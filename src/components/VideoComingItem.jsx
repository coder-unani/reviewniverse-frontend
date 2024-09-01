import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { EndpointManager, ENDPOINTS } from "/src/config/endpoints";
import { fYear, fDate } from "/src/utils/format";
import { fThumbnail, fCountry } from "/src/utils/formatContent";

const VideoComingItem = ({ video }) => {
  const path = EndpointManager.generateUrl(ENDPOINTS.VIDEO_DETAIL, { videoId: video.id });

  return (
    <Link to={path} className="default-video-item" aria-label={video.title}>
      <div className="default-thumbnail-container">
        <picture className="default-thumbnail-wrapper">
          <LazyLoadImage className="default-thumbnail" src={fThumbnail(video.thumbnail)} alt="썸네일" effect="blur" />
        </picture>
        <div className="default-code-wrapper">
          <div className="default-code">{video.code_string}</div>
        </div>
        <div className="coming-dday-wrapper">
          <p className="coming-dday">D-{video.d_day}</p>
        </div>
      </div>
      <div className="default-info-container">
        <p className="default-title">{video.title}</p>
        <div className="default-subtitle-wrapper">
          <div className="default-subtitle">
            <span className="coming-subtitle-release">{fDate(video.release)}</span>
            {video.country && (
              <>
                <span>|</span>
                <span>{fCountry(video.country)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoComingItem;
