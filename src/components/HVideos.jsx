import React, { useState, useEffect } from "react";
import VideoRankItem from "/src/components/VideoRankItem";
import VideoItem from "/src/components/VideoItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { RiArrowRightSLine, RiArrowLeftSLine } from "@remixicon/react";
import { isEmpty } from "lodash";
import "/src/styles/HVideos.css";

const HVideos = ({ content }) => {
  const [videos, setVideos] = useState([]);

  // 스와이퍼 설정
  const swiperConfig = (prevEl, nextEl) => ({
    modules: [Navigation],
    spaceBetween: 8,
    slidesPerView: 3.01,
    slidesPerGroup: 3,
    speed: 1000,
    navigation: { prevEl, nextEl },
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
  });

  useEffect(() => {
    if (!content) return;
    setVideos(content.content.list);
  }, [content]);

  if (isEmpty(videos)) return null;

  return (
    <section className="horizontal-videos-wrapper">
      <div className="title-wrapper">
        <h2 className="title">{content.title}</h2>
        {/* <button className="more">
          더보기
          <RiArrowRightSLine size={20} />
        </button> */}
      </div>
      <div className="swiper-container">
        <Swiper {...swiperConfig(`.prev-${content.scn_code}`, `.next-${content.scn_code}`)}>
          {content.content.template === "default"
            ? videos.map((video, index) => (
                <SwiperSlide key={index}>
                  <VideoItem video={video} index={index} />
                </SwiperSlide>
              ))
            : videos.map((video, index) => (
                <SwiperSlide key={index}>
                  <VideoRankItem video={video} index={index} />
                </SwiperSlide>
              ))}
        </Swiper>
        <div className={`swiper-button-prev prev-${content.scn_code}`}>
          <RiArrowLeftSLine size={24} />
        </div>
        <div className={`swiper-button-next next-${content.scn_code}`}>
          <RiArrowRightSLine size={24} />
        </div>
      </div>
    </section>
  );
};

export default HVideos;
