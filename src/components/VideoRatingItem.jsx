import React from "react";
import { Link } from "react-router-dom";
import RatingReview from "/src/components/RatingReview";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { fYear } from "/src/utils/format";
import { fVideoCode, fThumbnail, fCountry } from "/src/utils/formatContent";

const VideoRatingItem = ({ video }) => {
  return (
    <article className="default-video-item">
      <Link to={`/contents/${video.video.id}`}>
        <div className="default-thumbnail-container">
          <picture className="default-thumbnail-wrapper">
            <LazyLoadImage
              className="default-thumbnail"
              src={fThumbnail(video.video.thumbnail)}
              alt="썸네일"
              effect="blur"
            />
          </picture>
        </div>
        <div className="default-info-container">
          <div className="default-title-wrapper">
            <p className="default-title">{video.video.title}</p>
            <div className="default-subtitle">
              <RatingReview rating={video.rating} />
              {/* <span>{fYear(video.release)}</span>
              {video.country && (
                <>
                  <span>|</span>
                  <span>{fCountry(video.country)}</span>
                </>
              )} */}
            </div>
          </div>
          {/* <div className="default-code-wrapper">
            <div className="default-code">{fVideoCode(video.code)}</div>
          </div> */}
        </div>
      </Link>
    </article>
  );
};

export default VideoRatingItem;
