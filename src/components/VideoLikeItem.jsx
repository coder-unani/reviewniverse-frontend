import React from "react";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { fYear } from "/src/utils/format";
import { fVideoCode, fThumbnail } from "/src/utils/formatContent";

const VideoLikeItem = ({ video }) => {
  const navigate = useNavigate();

  // 비디오 아이템 클릭 시 비디오 상세 페이지로 이동
  const handleLinkClick = (videoId) => {
    navigate(`/contents/${videoId}`);
  };

  return (
    <article className="default-video-item">
      <a onClick={() => handleLinkClick(video.video.id)} role="button" aria-label={video.video.title}>
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
          <div className="default-title-wrapper">
            <p className="default-title">{video.video.title}</p>
          </div>
          <div className="default-subtitle-wrapper">
            <div className="default-subtitle">
              <span>{fYear(video.video.release)}</span>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
};

export default VideoLikeItem;
