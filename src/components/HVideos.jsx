import React, { useState, useEffect, useRef } from "react";
import VideoRankItem from "/src/components/VideoRankItem";
import VideoItem from "/src/components/VideoItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Virtual } from "swiper/modules";
import "swiper/css";
import ArrowLeftIcon from "/src/assets/button/arrow-left.svg?react";
import ArrowRightIcon from "/src/assets/button/arrow-right.svg?react";
import { isEmpty } from "lodash";

const HVideos = ({ children, content, template }) => {
  const [videos, setVideos] = useState([]);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef(null);

  const swiperConfig = {
    modules: [Navigation, Virtual],
    spaceBetween: 8,
    slidesPerView: 3.01,
    slidesPerGroup: 3,
    speed: 1000,
    virtual: true,
    allowTouchMove: true,
    breakpoints: {
      577: {
        slidesPerView: 3,
        allowTouchMove: false,
      },
      769: {
        spaceBetween: 10,
        slidesPerView: 4,
        slidesPerGroup: 4,
        allowTouchMove: false,
      },
      1025: {
        spaceBetween: 12,
        slidesPerView: 5,
        slidesPerGroup: 5,
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

  useEffect(() => {
    if (!content) return;
    setVideos(content);
  }, [content]);

  if (isEmpty(videos)) return null;

  return (
    <section className="horizontal-videos-wrapper">
      {children}
      <div className="swiper-container">
        <Swiper {...swiperConfig}>
          {template === "default"
            ? videos.map((video, index) => (
                <SwiperSlide key={index} virtualIndex={index}>
                  <VideoItem video={video} index={index} />
                </SwiperSlide>
              ))
            : videos.map((video, index) => (
                <SwiperSlide key={index} virtualIndex={index}>
                  <VideoRankItem video={video} index={index} />
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

export default HVideos;
