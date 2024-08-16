import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fDate } from "/src/utils/format";
import { fPreviewThumbnail, fBackgroundImage, fReleaseText } from "/src/utils/formatContent";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const SwiperPreview = React.memo(({ screensMA01 }) => {
  const [previewVideo, setPreviewVideo] = useState("");
  const swiperRef = useRef(null);

  const previewSwiperConfig = {
    modules: [Autoplay],
    spaceBetween: 10,
    slidesPerView: "auto",
    speed: 1000,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    loop: true,
    allowTouchMove: true,
    breakpoints: {
      577: {
        spaceBetween: 12,
      },
      769: {
        spaceBetween: 18,
      },
      1281: {
        spaceBetween: 24,
      },
    },
    onSwiper: (swiper) => {
      swiperRef.current = swiper;
    },
    onSlideChange: (swiper) => {
      if (screensMA01 && screensMA01.content.list.length > 0) {
        const activeIndex = swiper.realIndex;
        setPreviewVideo(screensMA01.content.list[activeIndex]);
      }
    },
  };

  useEffect(() => {
    if (screensMA01 && screensMA01.content.list.length > 0) {
      setPreviewVideo(screensMA01.content.list[0]);
    }
  }, [screensMA01]);

  return (
    <>
      <picture className="preview-background-wrapper">
        {previewVideo && (
          <div
            className="preview-background"
            style={{ backgroundImage: `url(${fPreviewThumbnail(previewVideo.thumbnail)})` }}
          />
        )}
      </picture>

      <div className="preview-info-container">
        {previewVideo && (
          <div className="preview-info-wrapper">
            <div className="preview-title-wrapper">
              <div className="preview-title">
                {/* <p className="title">{screensMA01.title}</p> */}
                <p className="preview-title-og">{previewVideo.title_og}</p>
                <h2 className="preview-title-kr">{previewVideo.title}</h2>
              </div>
            </div>
            <div className="preview-release-wrapper">
              <div className="preview-release">
                <span>{fReleaseText(previewVideo.code)}</span>
                <span>|</span>
                <span>{fDate(previewVideo.release)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="preview-videos-container">
        {screensMA01 && (
          <div className="preview-videos-wrapper">
            <Swiper className="preview-videos" {...previewSwiperConfig}>
              {screensMA01.content.list.map((video, index) => (
                <SwiperSlide className="preview-video-item" key={index}>
                  {({ isActive }) => (
                    <Link to={`/contents/${video.id}`} className="preview-video-link">
                      <picture className={`preview-thumbnail-wrapper ${isActive ? "active" : ""}`}>
                        <LazyLoadImage
                          className="preview-thumbnail-image"
                          src={fBackgroundImage(video.thumbnail)}
                          alt={video.title}
                          effect="blur"
                        />
                      </picture>
                      {/* <div className="preview-card">
                        <span className="new">NEW</span>
                      </div> */}
                    </Link>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </>
  );
});

export default SwiperPreview;
