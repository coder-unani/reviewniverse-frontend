import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useThemeContext } from "/src/context/ThemeContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Autoplay, Parallax, EffectFade } from "swiper/modules";
import { EndpointManager, ENDPOINTS } from "/src/config/endpoints";
import { fDate } from "/src/utils/format";
import { fPreviewThumbnail, fBackgroundImage, fReleaseText } from "/src/utils/formatContent";
import { isEmpty } from "lodash";

// TODO: 페이지네이션 표시?

const SwiperPreview = React.memo(({ screensMA01 }) => {
  const navigate = useNavigate();
  const { isMobile } = useThemeContext();
  const [previewVideo, setPreviewVideo] = useState("");
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // 메인 슬라이더 설정
  const mainSwiperConfig = {
    modules: [Thumbs, Autoplay, Parallax, EffectFade],
    thumbs: { swiper: thumbsSwiper }, // 썸네일 슬라이더와 연결
    slidesPerView: "auto",
    speed: 1000,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    effect: "fade",
    parallax: true,
    loop: true,
    onSlideChange: (swiper) => {
      setActiveThumbIndex(swiper.realIndex);

      // 모바일에서 활성화된 슬라이드가 썸네일 슬라이더의 맨 앞으로 오도록 설정
      if (!thumbsSwiper || !isMobile) {
        return;
      }
      thumbsSwiper.slideToLoop(swiper.realIndex, 1000, false);
    },
  };

  // 썸네일 슬라이더 설정
  const thumbSwiperConfig = {
    modules: [Thumbs],
    onSwiper: setThumbsSwiper, // 썸네일 슬라이더 인스턴스를 상태로 설정
    spaceBetween: 10,
    slidesPerView: "auto",
    speed: 1500,
    loop: true,
    watchSlidesProgress: true,
    allowTouchMove: true,
    grabCursor: true,
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
    onTouchMove: () => {
      setIsDragging(true);
    },
    onTouchEnd: () => {
      setIsDragging(false);
    },
  };

  // 프리뷰 비디오 데이터 설정
  useEffect(() => {
    if (!screensMA01) {
      return;
    }
    setPreviewVideo(screensMA01.content.list);
  }, [screensMA01]);

  // 썸네일 클릭 시 해당 슬라이드로 이동 후 다시 클릭 시 페이지 이동
  const handleLinkClick = (e, videoId, index) => {
    e.preventDefault();
    if (!isDragging && index === activeThumbIndex) {
      const path = EndpointManager.generateUrl(ENDPOINTS.VIDEO_DETAIL, { videoId });
      navigate(path);
    }
  };

  // 썸네일 클릭 시 해당 슬라이드로 이동 후 다시 클릭 시 페이지 이동
  // 모바일에서는 클릭 이벤트가 발생하지 않아 터치 이벤트로 대체
  const handleLinkTouch = (e, videoId, index) => {
    e.preventDefault();
    if (!isDragging && index === activeThumbIndex) {
      const path = EndpointManager.generateUrl(ENDPOINTS.VIDEO_DETAIL, { videoId });
      navigate(path);
    }
  };

  if (isEmpty(previewVideo)) {
    return null;
  }

  return (
    <>
      <Swiper className="preview-main-videos" {...mainSwiperConfig}>
        {previewVideo.map((video) => (
          <SwiperSlide key={video.id}>
            <picture className="preview-background-wrapper">
              <div
                className="preview-background"
                style={{ backgroundImage: `url(${fPreviewThumbnail(video.thumbnail, isMobile)})` }}
              />
            </picture>

            <div className="preview-info-container">
              <div className="preview-info-wrapper">
                <div className="preview-title-wrapper">
                  <div className="preview-title">
                    <p className="preview-title-og" data-swiper-parallax="-150">
                      {video.title_og || video.title}
                    </p>
                    <h2 className="preview-title-kr" data-swiper-parallax="-250">
                      {video.title}
                    </h2>
                  </div>
                </div>
                <div className="preview-release-wrapper">
                  <div className="preview-release" data-swiper-parallax="-200">
                    <span>{fReleaseText(video.code)}</span>
                    <span>|</span>
                    <span>{fDate(video.release)}</span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="preview-videos-container">
        <div className="preview-videos-wrapper">
          <Swiper className="preview-videos" {...thumbSwiperConfig}>
            {previewVideo.map((video, index) => (
              <SwiperSlide className="preview-video-item" key={video.id}>
                <Link
                  to={EndpointManager.generateUrl(ENDPOINTS.VIDEO_DETAIL, { videoId: video.id })}
                  className="preview-video-link"
                  aria-label={video.title}
                  onClick={(e) => handleLinkClick(e, video.id, index)}
                  onTouchEnd={(e) => handleLinkTouch(e, video.id, index)}
                >
                  <picture className="preview-thumbnail-wrapper">
                    <img
                      className="preview-thumbnail-image"
                      src={fBackgroundImage(video.thumbnail, true)}
                      alt={video.title}
                      loading="lazy"
                    />
                    {/* <LazyLoadImage
                      className="preview-thumbnail-image"
                      src={fBackgroundImage(video.thumbnail, true)}
                      alt={video.title}
                      effect="blur"
                    /> */}
                  </picture>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
});

export default SwiperPreview;
