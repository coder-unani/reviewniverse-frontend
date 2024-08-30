import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useThemeContext } from "/src/context/ThemeContext";
import { useDrag } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Autoplay, FreeMode, Parallax, EffectFade } from "swiper/modules";
import { LazyLoadImage } from "react-lazy-load-image-component";
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
    modules: [Thumbs, FreeMode],
    onSwiper: setThumbsSwiper, // 썸네일 슬라이더 인스턴스를 상태로 설정
    spaceBetween: 10,
    slidesPerView: "auto",
    speed: 1500,
    // FreeMode: true,
    loop: true,
    loopAddBlankSlides: false,
    watchSlidesProgress: true,
    allowTouchMove: true,
    grabCursor: true,
    breakpoints: {
      577: {
        spaceBetween: 12,
        slidesPerGroup: 2,
      },
      769: {
        spaceBetween: 18,
        slidesPerGroup: 3,
      },
      1281: {
        spaceBetween: 24,
        slidesPerGroup: 4,
      },
    },
  };

  // 프리뷰 비디오 데이터 설정
  useEffect(() => {
    if (!screensMA01) {
      return;
    }
    setPreviewVideo(screensMA01.content.list);
  }, [screensMA01]);

  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const bind = useDrag(
    ({ down, movement: [mx], cancel, tap, args: [videoId, index] }) => {
      if (tap) {
        // 터치가 짧게 이루어진 경우 (클릭으로 간주)
        handleLinkClick(videoId, index);
      } else if (down) {
        // 터치 중 스와이프가 발생하는 경우
        setIsDragging(true);
      } else {
        // 스와이프가 끝난 경우
        setIsDragging(false);
      }

      // 만약 스와이프 거리가 충분히 크지 않다면 움직임을 취소
      if (Math.abs(mx) < 10 && !down) {
        cancel();
      }

      api.start({ x: down ? mx : 0 });
    },
    { axis: "x", filterTaps: true }
  );

  // 썸네일 클릭 시 해당 슬라이드로 이동 후 다시 클릭 시 페이지 이동
  const handleLinkClick = (videoId, index) => {
    // e.preventDefault();
    if (!isDragging && index === activeThumbIndex) {
      const path = EndpointManager.generateUrl(ENDPOINTS.VIDEO_DETAIL, { videoId });
      navigate(path);
    }
  };

  // 썸네일 클릭 시 해당 슬라이드로 이동 후 다시 클릭 시 페이지 이동
  // 모바일에서는 onTouchEnd 이벤트로 처리
  // const handleLinkTouch = (e, videoId, index) => {
  //   e.preventDefault();
  //   if (index === activeThumbIndex) {
  //     const path = EndpointManager.generateUrl(ENDPOINTS.VIDEO_DETAIL, { videoId: videoId });
  //     navigate(path);
  //   }
  // };

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
                style={{ backgroundImage: `url(${fPreviewThumbnail(video.thumbnail)})` }}
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
                <animated.div className="preview-video-link" {...bind(video.id, index)} style={{ x }}>
                  <Link
                    to={EndpointManager.generateUrl(ENDPOINTS.VIDEO_DETAIL, { videoId: video.id })}
                    aria-label={video.title}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(video.id, index);
                    }}
                  >
                    <picture className="preview-thumbnail-wrapper">
                      <LazyLoadImage
                        className="preview-thumbnail-image"
                        src={fBackgroundImage(video.thumbnail, true)}
                        alt={video.title}
                        effect="blur"
                      />
                    </picture>
                  </Link>
                </animated.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
});

export default SwiperPreview;
