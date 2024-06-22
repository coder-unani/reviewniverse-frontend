import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HttpClient from "/src/utils/HttpClient";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { find, isEmpty } from "lodash";
import { cLog, cError } from "/src/utils/test";
import { RiArrowRightSLine } from "@remixicon/react";
import { formatDate, formatYear } from "/src/utils/format";

/**
 * TODO:
 * 1. ? 페이지네이션 추가
 * 2. 비디오 API 연동
 * 3. 세로 썸네일만 표시
 * 4. 100순위까지 표시
 * 5. 캐싱 처리
 * 6. 정렬 기준 추가 (조회수, 좋아요, 최신, 일간, 주간, 월간 등)
 * 7. no-image 이미지 추가
 * 8. 데이터 포맷 로직 추가
 */

const MainRanking = (props) => {
  const { type } = props;
  const [movies, setMovies] = useState([]);
  const page = 1;
  const pageSize = 20;

  useEffect(() => {
    try {
      const client = new HttpClient();
      client
        .get("https://comet.orbitcode.kr/v1/contents/videos", {
          p: page,
          ps: pageSize,
          t: type,
        })
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

  // 콘텐츠 썸네일 이미지 포맷
  const formatThumbnail = (images) => {
    // TODO: 이미지가 없을 경우 no-image 이미지 반환
    if (isEmpty(images)) return null;
    // 썸네일 이미지 배열 중에서 type이 10인 이미지만 렌더링
    // type이 10인 이미지가 없을 경우 type이 11인 이미지 렌더링
    const thumbnail =
      find(images, { type: "10" }) ?? find(images, { type: "11" });
    return thumbnail.url;
  };

  // 랭킹 숫자 포맷
  const formatNumber = (number) => {
    // 숫자 한자리씩 잘라서 배열에 저장
    const numbers = number.toString().split("");
    // 배열 반복해서 number-{}.svg 이미지 추가해서 반환
    return numbers.map((num, index) => (
      <img key={index} src={`/src/assets/number-${num}.svg`} alt={num} />
    ));
  };

  // contents 값이 없을 경우 null 반환
  if (isEmpty(movies)) return null;

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
            <Link to={`/contents/${movie.id}`}>
              <div className="img-wrapper">
                <figure className="thumbnail">
                  <LazyLoadImage
                    src={formatThumbnail(movie.thumbnail)}
                    alt="썸네일"
                    effect="blur"
                  />
                </figure>
                <div className="number">{formatNumber(index + 1)}</div>
              </div>
              <div className="info">
                <p className="title">{movie.title}</p>
                <div className="sub-title">
                  <span>{formatYear(movie.release)}</span>
                  <span>|</span>
                  <span>국가</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MainRanking;
