import React from "react";
import { Link } from "react-router-dom";
import ReviewRating from "/src/components/ReviewRating";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { formatYear } from "/src/utils/format";
import { formatThumbnail, formatCountry } from "/src/utils/formatContent";

const VideoRatingItem = ({ video }) => {
  return (
    <article className="default-video-item">
      <Link to={`/contents/${video.id}`}>
        <div className="default-thumbnail-container">
          <figure className="default-thumbnail-wrapper">
            <LazyLoadImage
              className="default-thumbnail"
              src={formatThumbnail(video.thumbnail)}
              alt="썸네일"
              effect="blur"
            />
          </figure>
        </div>
        <div className="default-info-container">
          <div className="default-title-wrapper">
            <p className="default-title">{video.title}</p>
            <div className="default-subtitle">
              <ReviewRating rating={10} />
              {/* <span>{formatYear(video.release)}</span>
              {video.country && (
                <>
                  <span>|</span>
                  <span>{formatCountry(video.country)}</span>
                </>
              )} */}
            </div>
          </div>
          {/* <div className="default-code-wrapper">
            <div className="default-code">{video.code_string}</div>
          </div> */}
        </div>
      </Link>
    </article>
  );
};

export default VideoRatingItem;
