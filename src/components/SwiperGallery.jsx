import React, { useState, useRef } from "react";
import PhotoModal from "/src/components/Modal/Photo";
import { useVideoDetailContext } from "/src/context/VideoDetailContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ArrowLeftIcon from "/src/assets/button/arrow-left.svg?react";
import ArrowRightIcon from "/src/assets/button/arrow-right.svg?react";

const SwiperGallery = () => {
  const { content } = useVideoDetailContext();
  const items = content.data.thumbnail;
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [photoModal, setPhotoModal] = useState({ isOpen: false, url: "" });
  const swiperRef = useRef(null);

  const gallerySwiperConfig = {
    spaceBetween: 10,
    slidesPerView: 2.01,
    slidesPerGroup: 2,
    speed: 1000,
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
            <SwiperSlide className="detail-gallery-item" key={index} onClick={() => togglePhotoModal(image)}>
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
