import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { formatYear } from "/src/utils/format";
import { formatThumbnail, formatCountry } from "/src/utils/formatContent";

const VideoItem = ({ video }) => {
  return (
    <article className="default-video-item">
      <Link to={`/contents/${video.id}`}>
        <div className="img-wrapper">
          <figure className="thumbnail">
            <LazyLoadImage src={formatThumbnail(video.thumbnail)} alt="썸네일" effect="blur" />
          </figure>
        </div>
        <div className="info">
          <div className="left">
            <p className="title">{video.title}</p>
            <div className="sub-title">
              <span>{formatYear(video.release)}</span>
              {video.country && (
                <>
                  <span>|</span>
                  <span>{formatCountry(video.country)}</span>
                </>
              )}
            </div>
          </div>
          <div className="right">
            <div className="code">{video.code_string}</div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default VideoItem;
