import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { formatYear } from "/src/utils/format";
import { formatThumbnail, formatCountry } from "/src/utils/formatContent";

const VideoRankItem = ({ video, index }) => {
  // 랭킹 숫자 포맷
  const formatRankingNumber = (number) => {
    // 숫자 한자리씩 잘라서 배열에 저장
    const numbers = number.toString().split("");
    // 배열 반복해서 number/{}.svg 이미지 추가해서 반환
    return numbers.map((num, index) => (
      <img key={index} src={`/assets/number/${num}.svg`} alt={num} data-number={num} />
    ));
  };

  return (
    <article className="rank-video-item">
      <Link to={`/contents/${video.id}`}>
        <div className="img-wrapper">
          <figure className="thumbnail">
            <LazyLoadImage src={formatThumbnail(video.thumbnail)} alt="썸네일" effect="blur" />
          </figure>
          <div className="number">{formatRankingNumber(index + 1)}</div>
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

export default VideoRankItem;
