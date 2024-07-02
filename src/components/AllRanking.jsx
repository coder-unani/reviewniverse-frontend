import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HttpClient from "/src/utils/HttpClient";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { isEmpty } from "lodash";
import { RiArrowRightSLine, RiArrowLeftSLine } from "@remixicon/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { formatYear } from "/src/utils/format";
import { formatPoster, formatCountry } from "/src/utils/contentFormat";
import { cLog, cError } from "/src/utils/test";
import "/src/styles/AllRanking.css";

/**
 * TODO:
 * 1. ? 페이지네이션 추가 -> 무한 스크롤로 변경
 * 2. 메인 랭킹은 swiper로 변경
 * 4. 100순위까지 표시 -> 1차 20순위만 표시
 * 5. 캐싱 처리
 * 6. 정렬 기준 추가 (조회수, 좋아요, 최신, 일간, 주간, 월간 등)
 * 8. 데이터 포맷 로직 추가
 */

const API_BASE_URL = "https://comet.orbitcode.kr/v1";

const AllRanking = (props) => {
  const { type } = props;
  const [movies, setMovies] = useState([]);
  const page = 1;
  const pageSize = 20;

  // 스와이퍼 설정
  const swiperConfig = {
    modules: [Navigation],
    spaceBetween: 12,
    slidesPerView: 3,
    slidesPerGroup: 3,
    speed: 1000,
    navigation: {
      prevEl: ".swiper-button-prev",
      nextEl: ".swiper-button-next",
    },
    allowTouchMove: false,
    breakpoints: {
      769: {
        slidesPerView: 4,
        slidesPerGroup: 4,
      },
      1025: {
        slidesPerView: 5,
        slidesPerGroup: 5,
      },
    },
  };

  // 랭킹 숫자 포맷
  const formatRankingNumber = (number) => {
    // 숫자 한자리씩 잘라서 배열에 저장
    const numbers = number.toString().split("");
    // 배열 반복해서 number-{}.svg 이미지 추가해서 반환
    return numbers.map((num, index) => <img key={index} src={`/assets/number-${num}.svg`} alt={num} />);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new HttpClient();
        const res = await client.get(`${API_BASE_URL}/contents/videos`, {
          p: page,
          ps: pageSize,
          t: type,
          ob: "rating_desc",
        });
        if (res.status === 200) {
          // res.code === "VIDEO_SEARCH_SUCC"
          setMovies(res.data.data);
        } else {
          cLog("영화 목록을 불러오는데 실패하였습니다.");
          return;
        }
      } catch (error) {
        cError(error);
      }
    };

    fetchData();
  }, []);

  if (isEmpty(movies)) return null;

  return (
    <section className="all-ranking-wrapper">
      <div className="title-wrapper">
        <h2 className="title">👥👤👥👤뭐야...👤👤👥👥👥웅👥성👥👥👤재밌잖아...👤👥👤👤...(웅성웅성)👤👥👥👤</h2>
        {/* <button className="more">
          더보기
          <RiArrowRightSLine size={20} />
        </button> */}
      </div>
      <div className="ranking-wrapper">
        <div className="swiper-container">
          <Swiper {...swiperConfig}>
            {movies.map((movie, index) => (
              <SwiperSlide className="content" key={index}>
                <Link to={`/contents/${movie.id}`}>
                  <div className="img-wrapper">
                    <figure className="thumbnail">
                      <LazyLoadImage src={formatPoster(movie.thumbnail)} alt="썸네일" effect="blur" />
                    </figure>
                    <div className="number">{formatRankingNumber(index + 1)}</div>
                  </div>
                  <div className="info">
                    <p className="title">{movie.title}</p>
                    <div className="sub-title">
                      <span>{formatYear(movie.release)}</span>
                      <span>|</span>
                      <span>{formatCountry(movie.country)}</span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-button-prev">
            <RiArrowLeftSLine size={24} />
          </div>
          <div className="swiper-button-next">
            <RiArrowRightSLine size={24} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllRanking;
