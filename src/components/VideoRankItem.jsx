import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { fYear } from "/src/utils/format";
import { fThumbnail, fCountry, fRatingColor, fRatingText } from "/src/utils/formatContent";

const VideoRankItem = ({ video, index }) => {
  // 랭킹 숫자 포맷
  const fRankingNumber = (number) => {
    // 숫자 한자리씩 잘라서 배열에 저장
    const numbers = number.toString().split("");
    // 배열 반복해서 number/{}.svg 이미지 추가해서 반환
    return numbers.map((num, index) => (
      <img className="rank-number" data-number={num} src={`/assets/number/${num}.svg`} alt={num} key={index} />
    ));
  };

  return (
    <article className="rank-video-item">
      <Link to={`/contents/${video.id}`} aria-label={video.title}>
        <div className="rank-thumbnail-container">
          <picture className="rank-thumbnail-wrapper">
            <LazyLoadImage className="rank-thumbnail" src={fThumbnail(video.thumbnail)} alt="썸네일" effect="blur" />
          </picture>
          <div className="rank-code-wrapper">
            <div className="rank-code">{video.code_string}</div>
          </div>
          <div className="rank-number-wrapper">{fRankingNumber(index + 1)}</div>
        </div>
        <div className="rank-info-container">
          <div className="rank-title-wrapper">
            <p className="rank-title">{video.title}</p>
          </div>
          <div className="rank-subtitle-wrapper">
            <div className="rank-subtitle">
              <span>{fYear(video.release)}</span>
              {video.country && (
                <>
                  <span>|</span>
                  <span>{fCountry(video.country)}</span>
                </>
              )}
            </div>
            <div className="rank-rating-wrapper" data-color={fRatingColor(video.rating)}>
              <div className="rank-rating-square"></div>
              <span className="rank-rating">{fRatingText(video.rating)}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default VideoRankItem;
