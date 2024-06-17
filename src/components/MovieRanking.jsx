import React from "react";
import { RiArrowRightSLine } from "@remixicon/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

const MovieRanking = (props) => {
  const { title } = props;

  const swiperConfig = {
    modules: [Navigation],
    spaceBetween: 20,
    slidesPerView: 5,
    navigation: true,
  };

  return (
    <section className="container">
      <div className="title-wrapper">
        <h2 className="title">{title}</h2>
        <button className="more">
          더보기
          <RiArrowRightSLine size={20} />
        </button>
      </div>
      <Swiper {...swiperConfig}>
        {new Array(10).fill(1).map((_, index) => (
          <SwiperSlide key={index}>
            <div className="img-wrapper">
              <figure className="thumbnail">
                <img src="" alt="" />
              </figure>
              <div className="number">
                <img src={`/src/assets/number-${index + 1}.svg`} alt="1" />
              </div>
            </div>
            <div className="info">
              <p title="title">영화/시리즈 제목</p>
              <div className="sub-title">
                <span>제작년도</span>
                <span>|</span>
                <span>국가</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default MovieRanking;
