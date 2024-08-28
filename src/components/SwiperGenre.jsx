import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { fMakeImageUrl } from "/src/utils/formatContent";
import { SETTINGS } from "/src/config/settings";
import { isEmpty } from "lodash";
import ArrowLeftIcon from "/src/assets/button/arrow-left.svg?react";
import ArrowRightIcon from "/src/assets/button/arrow-right.svg?react";
import LayoutIcon from "/src/assets/button/outline-layout.svg?react";

const SwiperGenre = ({ content }) => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef(null);
  const swiperConfig = {
    modules: [Navigation],
    spaceBetween: 8,
    slidesPerView: 3,
    slidesPerGroup: 3,
    speed: 1000,
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
    setGenres(content);
  }, [content]);

  // 장르 클릭 시 해당 장르 페이지로 이동
  const handleLinkClick = (genre) => {
    // TODO: 장르 아이디로 이동하도록 수정
    navigate(`/genre?genre=${genre}`);
  };

  if (isEmpty(genres)) return null;

  return (
    <section className="horizontal-videos-section">
      <div className="horizontal-title-wrapper">
        <h2 className="horizontal-title genre">
          <LayoutIcon />
          장르
        </h2>
      </div>
      <div className="horizontal-videos-wrapper">
        <Swiper className="horizontal-videos" {...swiperConfig}>
          {genres.map((genre) => (
            <SwiperSlide className="horizontal-video-item" key={genre.id}>
              <a
                className="genre-video-link"
                onClick={() => handleLinkClick(genre.name)}
                role="button"
                aria-label={genre.name}
              >
                <picture className="genre-thumbnail-wrapper">
                  <LazyLoadImage
                    className="genre-thumbnail-image"
                    src={fMakeImageUrl(genre.image, SETTINGS.IMAGE_RESIZE_R5)}
                    alt={genre.name}
                    effect="blur"
                  />
                </picture>
                <h5 className="genre-video-title">#{genre.name}</h5>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          type="button"
          className="horizontal-prev-button genre"
          onClick={() => swiperRef.current.slidePrev()}
          disabled={isBeginning}
        >
          <ArrowLeftIcon />
        </button>
        <button
          type="button"
          className="horizontal-next-button genre"
          onClick={() => swiperRef.current.slideNext()}
          disabled={isEnd}
        >
          <ArrowRightIcon />
        </button>
      </div>
    </section>
  );
};

export default SwiperGenre;
