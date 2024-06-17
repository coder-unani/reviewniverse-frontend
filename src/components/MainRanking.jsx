import React, { useState, useEffect } from "react";
import HttpClient from "/src/utils/HttpClient";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { RiArrowRightSLine } from "@remixicon/react";
import { cLog, cError } from "/src/utils/test";

/**
 * TODO:
 * 1. ? 페이지네이션 추가
 * 2. 비디오 API 연동
 * 3. 세로 썸네일만 표시
 * 4. 100순위까지 표시
 * 5. 캐싱 처리
 * 6. 정렬 기준 추가 (조회수, 좋아요, 최신, 일간, 주간, 월간 등)
 */

const MainRanking = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    try {
      const client = new HttpClient();
      client
        .get("https://comet.orbitcode.kr/v1/contents/videos")
        .then((res) => {
          if (res.status === 200 && res.code === "VIDEO_SEARCH_SUCC") {
            setMovies(res.data.data);
          } else {
            cLog("영화 목록을 불러오는데 실패하였습니다.");
            return;
          }
        });
    } catch (error) {
      cError(error);
    }
  }, []);

  // 랭킹 숫자 포맷
  const formatNumber = (number) => {
    // 숫자 한자리씩 잘라서 배열에 저장
    const numbers = number.toString().split("");

    // 배열 반복해서 number-{}.svg 이미지 추가해서 반환
    return numbers.map((num, index) => (
      <img key={index} src={`/src/assets/number-${num}.svg`} alt={num} />
    ));
  };

  return (
    <section className="container">
      <div className="title-wrapper">
        {/* <h2 className="title">리뷰니버스 순위</h2> */}
        {/* <button className="more">
          더보기
          <RiArrowRightSLine size={20} />
        </button> */}
      </div>
      <div className="content-wrapper">
        {movies.map((movie, index) => (
          <article className="content" key={index}>
            <div className="img-wrapper">
              <figure className="thumbnail">
                <LazyLoadImage
                  src={movie.thumbnail[0].url}
                  alt="썸네일"
                  effect="blur"
                />
              </figure>
              <div className="number">{formatNumber(index + 1)}</div>
            </div>
            <div className="info">
              <p className="title">{movie.title}</p>
              <div className="sub-title">
                <span>{movie.release}</span>
                <span>|</span>
                <span>국가</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MainRanking;
