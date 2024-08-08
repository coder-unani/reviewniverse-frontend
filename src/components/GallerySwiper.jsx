import React, { useState, useRef } from "react";
import PhotoModal from "/src/components/Modal/PhotoModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ArrowLeftIcon from "/src/assets/button/arrow-left.svg?react";
import ArrowRightIcon from "/src/assets/button/arrow-right.svg?react";

const GallerySwiper = ({ data }) => {
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
      <section className="gallery-wrapper">
        <h4>{data.title}</h4>
        <div className="swiper-container">
          <Swiper {...gallerySwiperConfig}>
            {data.items.map((image, index) => (
              <SwiperSlide key={index} virtualIndex={index} onClick={() => togglePhotoModal(image)}>
                <figure className="photo">
                  <LazyLoadImage src={image} alt="갤러리 이미지" effect="blur" />
                </figure>
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

      {photoModal.isOpen && <PhotoModal url={photoModal.url} onClose={togglePhotoModal} />}
    </>
  );
};

export default GallerySwiper;
