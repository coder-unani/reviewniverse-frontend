import React, { useState, useRef } from "react";
import PhotoModal from "/src/components/Modal/Photo";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ArrowLeftIcon from "/src/assets/button/arrow-left.svg?react";
import ArrowRightIcon from "/src/assets/button/arrow-right.svg?react";

const SwiperGallery = ({ items }) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef(null);
  const [photoModal, setPhotoModal] = useState({ isOpen: false, url: "" });

  const gallerySwiperConfig = {
    modules: [Virtual],
    spaceBetween: 10,
    slidesPerView: 2.01,
    slidesPerGroup: 2,
    speed: 1000,
    virtual: true,
    allowTouchMove: true,
    breakpoints: {
      769: {
        spaceBetween: 12,
        slidesPerView: 3,
        slidesPerGroup: 3,
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

  const togglePhotoModal = (url = "") => {
    setPhotoModal({ isOpen: !photoModal.isOpen, url });
  };

  return (
    <>
      <article className="detail-gallery-wrapper">
        <Swiper className="detail-gallery" {...gallerySwiperConfig}>
          {items.map((image, index) => (
            <SwiperSlide
              className="detail-gallery-item"
              key={index}
              virtualIndex={index}
              onClick={() => togglePhotoModal(image)}
            >
              <picture className="detail-photo-wrapper">
                <LazyLoadImage className="detail-photo" src={image} alt="갤러리 이미지" effect="blur" />
              </picture>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          type="button"
          className="gallery-prev-button"
          onClick={() => swiperRef.current.slidePrev()}
          disabled={isBeginning}
        >
          <ArrowLeftIcon />
        </button>
        <button
          type="button"
          className="gallery-next-button"
          onClick={() => swiperRef.current.slideNext()}
          disabled={isEnd}
        >
          <ArrowRightIcon />
        </button>
      </article>

      {photoModal.isOpen && <PhotoModal url={photoModal.url} onClose={togglePhotoModal} />}
    </>
  );
};

export default SwiperGallery;
