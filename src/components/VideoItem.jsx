import React from "react";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { fYear } from "/src/utils/format";
import { fThumbnail, fCountry, fRating } from "/src/utils/formatContent";

const VideoItem = ({ video }) => {
  const navigate = useNavigate();

  const handleLinkClick = (videoId) => {
    navigate(`/contents/${videoId}`);
  };

  return (
    <article className="default-video-item">
      <a onClick={() => handleLinkClick(video.id)} role="button" aria-label={video.title}>
        <div className="default-thumbnail-container">
          <picture className="default-thumbnail-wrapper">
            <LazyLoadImage className="default-thumbnail" src={fThumbnail(video.thumbnail)} alt="썸네일" effect="blur" />
          </picture>
          <div className="default-code-wrapper">
            <div className="default-code">{video.code_string}</div>
          </div>
        </div>
        <div className="default-info-container">
          <div className="default-title-wrapper">
            <p className="default-title">{video.title}</p>
          </div>
          <div className="default-subtitle-wrapper">
            <div className="default-subtitle">
              <span>{fYear(video.release)}</span>
              {video.country && (
                <>
                  <span>|</span>
                  <span>{fCountry(video.country)}</span>
                </>
              )}
            </div>
            <div className="default-rating-wrapper" data-rating={Math.floor(fRating(video.rating))}>
              <div className="default-rating-square"></div>
              <span className="default-rating">{video.rating ? fRating(video.rating) : "-"}</span>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
};

export default VideoItem;
