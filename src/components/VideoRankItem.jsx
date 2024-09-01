import React from "react";
import { Link } from "react-router-dom";
import { EndpointManager, ENDPOINTS } from "/src/config/endpoints";
import { fYear } from "/src/utils/format";
import { fThumbnail, fCountry, fRatingColor, fRatingText } from "/src/utils/formatContent";

const VideoRankItem = React.memo(({ video, index }) => {
  const path = EndpointManager.generateUrl(ENDPOINTS.VIDEO_DETAIL, { videoId: video.id });

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
    <Link to={path} className="default-video-item" aria-label={video.title}>
      <div className="default-thumbnail-container">
        <picture className="rank-thumbnail-wrapper">
          <img
            className="swiper-lazy default-thumbnail"
            src={fThumbnail(video.thumbnail)}
            srcSet={fThumbnail(video.thumbnail)}
            alt={video.title}
            loading="lazy"
          />
        </picture>
        <div className="default-code-wrapper">
          <div className="default-code">{video.code_string}</div>
        </div>
        <div className="rank-number-wrapper">{fRankingNumber(index + 1)}</div>
      </div>
      <div className="rank-info-container">
        <p className="default-title">{video.title}</p>
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
          <div className="default-rating-wrapper" data-color={fRatingColor(video.rating)}>
            <div className="default-rating-square"></div>
            <span className="default-rating">{fRatingText(video.rating)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

export default VideoRankItem;
