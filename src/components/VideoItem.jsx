import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { formatYear } from "/src/utils/format";
import { formatCountry } from "/src/utils/contentFormat";

const VideoItem = (props) => {
  const { video } = props;

  return (
    <article className="default-content">
      <Link to={`/contents/${video.id}`}>
        <div className="img-wrapper">
          <figure className="thumbnail">
            <LazyLoadImage src={video.thumbnail.url} alt="썸네일" effect="blur" />
          </figure>
        </div>
        <div className="info">
          <p className="title">{video.title}</p>
          <div className="sub-title">
            <span>{formatYear(video.release)}</span>
            <span>|</span>
            <span>{formatCountry(video.country)}</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default VideoItem;
