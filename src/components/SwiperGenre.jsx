import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Virtual } from "swiper/modules";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { EndpointManager, ENDPOINTS } from "/src/config/endpoints";
import { fMakeThumbnailUrl } from "/src/utils/formatContent";
import { isEmpty } from "lodash";
import ArrowLeftIcon from "/src/assets/button/arrow-left.svg?react";
import ArrowRightIcon from "/src/assets/button/arrow-right.svg?react";

const SwiperGenre = ({ children, content }) => {
  const [genres, setGenres] = useState([]);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef(null);
  const swiperConfig = {
    modules: [Navigation, Virtual],
    virtual: true,
    spaceBetween: 8,
    slidesPerView: 3,
    slidesPerGroup: 3,
    speed: 1000,
    allowTouchMove: true,
    breakpoints: {
      577: {
        slidesPerView: 4,
        slidesPerGroup: 4,
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

  if (isEmpty(genres)) return null;

  return (
    <section className="horizontal-videos-section">
      {children}
      <div className="horizontal-videos-wrapper">
        <Swiper className="horizontal-videos" {...swiperConfig}>
          {genres.map((genre, index) => (
            <SwiperSlide className="horizontal-video-item" key={genre.id} virtualIndex={index}>
              <Link
                to={EndpointManager.generateUrl(ENDPOINTS.GENRE, { genreId: genre.id })}
                state={{ name: genre.name }}
                className="genre-video-link"
                aria-label={genre.name}
              >
                <picture className="genre-thumbnail-wrapper">
                  <LazyLoadImage
                    className="genre-thumbnail-image"
                    src={fMakeThumbnailUrl(genre.image)}
                    alt={genre.name}
                    effect="blur"
                  />
                </picture>
                <h5 className="genre-video-title">#{genre.name}</h5>
              </Link>
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
