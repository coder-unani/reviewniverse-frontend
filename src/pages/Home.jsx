import React from "react";
import { RiArrowRightSLine } from "@remixicon/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "/src/styles/Home.css";

const Home = () => {
  const swiperConfig = {
    modules: [Navigation],
    spaceBetween: 20,
    slidesPerView: 5,
    navigation: true,
  };

  return (
    <main className="main">
      <section className="container">
        <div className="title-wrapper">
          <h2 className="title">🎬 박스오피스 순위</h2>
          <button className="more">
            더보기
            <RiArrowRightSLine size={20} />
          </button>
        </div>
        <Swiper {...swiperConfig}>
          {new Array(10).fill(1).map((_, index) => (
            <SwiperSlide key={index}>
              <div className="img">
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
    </main>
  );
};

export default Home;
