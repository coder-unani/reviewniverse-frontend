import React, { useState, useRef } from "react";
import People from "/src/components/People";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import ArrowLeftIcon from "/src/assets/button/arrow-left.svg?react";
import ArrowRightIcon from "/src/assets/button/arrow-right.svg?react";

const CastSwiper = ({ data }) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef(null);

  const castSwiperConfig = {
    modules: [Grid],
    slidesPerView: 1,
    slidesPerGroup: 1,
    speed: 1000,
    grid: { rows: 2, fill: "column" },
    allowTouchMove: true,
    breakpoints: {
      577: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        grid: { rows: 2, fill: "column" },
        allowTouchMove: false,
      },
      1025: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        grid: { rows: 2, fill: "column" },
        allowTouchMove: false,
      },
      1281: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        grid: { rows: 2, fill: "column" },
        allowTouchMove: false,
      },
    },
    onSwiper: (swiper) => {
      swiperRef.current = swiper;
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    },
    onSlideChange: (swiper) => {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    },
  };

  return (
    <section className="cast-wrapper">
      <h4>{data.title}</h4>
      <div className="swiper-container" data-length={data.items.length}>
        <Swiper {...castSwiperConfig}>
          {data.items.map((item, index) => (
            <SwiperSlide key={index}>
              <People crew={item} target={data.target} formatCode={data.formatCode} />
            </SwiperSlide>
          ))}
        </Swiper>
        <button onClick={() => swiperRef.current.slidePrev()} className="swiper-button-prev" disabled={isBeginning}>
          <ArrowLeftIcon />
        </button>
        <button onClick={() => swiperRef.current.slideNext()} className="swiper-button-next" disabled={isEnd}>
          <ArrowRightIcon />
        </button>
      </div>
    </section>
  );
};

export default CastSwiper;
