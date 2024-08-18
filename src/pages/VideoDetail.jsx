import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import VideoLikeButton from "/src/components/Button/VideoLike";
import CollectionButton from "/src/components/Button/Collection";
import ReviewButton from "/src/components/Button/Review";
import ReviewModal from "/src/components/Modal/Review";
import {
  PosterSection,
  SynopsisSection,
  MyRatingSection,
  PlatformSection,
  ActorSection,
  StaffSection,
  GallerySection,
  ReviewSection,
} from "/src/components/VideoDetailSections";
import { useModalContext } from "/src/context/ModalContext";
import { useVideoDetailContext } from "/src/context/VideoDetailContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { SETTINGS } from "/src/config/settings";
import { fYear, fUpperCase } from "/src/utils/format";
import {
  fBackgroundImage,
  fThumbnail,
  fReleaseText,
  fReleaseDate,
  fGenres,
  fRating,
  fRuntimeText,
} from "/src/utils/formatContent";

/**
 * TODO:
 * - 반응형 레이아웃
 * - 리뷰 무한 스크롤 (스와이퍼 삭제)
 * - 리뷰 스포일러 기능
 * - 리뷰 자세히 보기 (리뷰 모달?)
 * - react modal 라이브러리 사용하기 (갤러리 등)
 * - react tooltip 라이브러리 사용하기 (ex.평점 취소하기)
 * - 줄거리 더보기 기능
 */

const VideoDetail = () => {
  const { reviewModal, toggleReviewModal } = useModalContext();
  const { videoId, content, contentIsLoading, contentError, myInfo, myInfoIsLoading, myInfoError } =
    useVideoDetailContext();

  useEffect(() => {
    const header = document.querySelector("header");
    const handleScroll = () => {
      if (window.scrollY > 100 && header.classList.contains("transparent")) {
        header.classList.remove("transparent");
      } else if (window.scrollY <= 100 && !header.classList.contains("transparent")) {
        header.classList.add("transparent");
      }
    };
    window.addEventListener("scroll", handleScroll);
    header.classList.add("transparent");
    return () => {
      window.removeEventListener("scroll", handleScroll);
      header.classList.remove("transparent");
    };
  }, []);

  const subInfoSwiperConfig = {
    spaceBetween: 10,
    slidesPerView: "auto",
    slidesPerGroup: 2,
    speed: 1000,
    allowTouchMove: true,
    breakpoints: {
      769: {
        spaceBetween: 12,
      },
    },
  };

  // TODO: 고도화 필요
  if (contentIsLoading || myInfoIsLoading) return <main className="detail-main-container"></main>;

  const title = `${content.data.title} (${fYear(content.data.release)}) - 리뷰니버스`;
  const description = content.data.synopsis;
  const imageUrl = fThumbnail(content.data.thumbnail);
  const url = `${SETTINGS.DOMAIN_URL}/content/${videoId}`;
  const keywords = content.data.tag || "";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="keywords" content={keywords} data-rh="true" />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" data-rh="true" />
        <meta name="twitter:title" content={title} data-rh="true" />
        <meta name="twitter:description" content={description} data-rh="true" />
        <meta name="twitter:image" content={imageUrl} data-rh="true" />
        <meta name="kakao:title" content={title} data-rh="true" />
        <meta name="kakao:description" content={description} data-rh="true" />
        <meta name="kakao:image" content={imageUrl} data-rh="true" />
      </Helmet>

      <main className="detail-main-container">
        <section className="detail-main-section">
          <picture className="detail-background-wrapper">
            <div
              className="detail-background"
              style={{ backgroundImage: `url(${fBackgroundImage(content.data.thumbnail)})` }}
            />
          </picture>

          <div className="detail-main-info-container">
            <div className="detail-main-info-wrapper">
              <article className="detail-title-container">
                <article className="detail-title-wrapper">
                  <p className="detail-title-og">{content.data.title_og || content.data.title}</p>
                  <h2 className="detail-title-kr">{content.data.title}</h2>
                </article>
                <ul className="detail-genre-wrapper">
                  {content.data.genre.map((genre, index) => (
                    <li key={index}>
                      <Link to={`/genre?genre=${fGenres(genre.name)}`} className="detail-genre-link">
                        {genre.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="detail-control-container">
                <article className="detail-control-wrapper">
                  <VideoLikeButton />
                  <CollectionButton />
                  <ReviewButton />
                </article>
              </article>
            </div>
          </div>

          <div className="detail-sub-info-container">
            <Swiper className="detail-sub-info-wrapper" {...subInfoSwiperConfig}>
              <SwiperSlide
                className="detail-sub-info-item rating"
                data-index={content.data.rating > 0 ? Math.floor(fRating(content.data.rating)) : 0}
              >
                <p className="detail-sub-title">평점</p>
                <div className="detail-sub-content-wrapper">
                  <p className="detail-sub-content">{content.data.rating > 0 ? fRating(content.data.rating) : "-"}</p>
                </div>
              </SwiperSlide>

              <SwiperSlide className="detail-sub-info-item notice-age">
                <p className="detail-sub-title">관람등급</p>
                <div className="detail-sub-content-wrapper">
                  <p className="detail-sub-content">{fUpperCase(content.data.notice_age)}</p>
                </div>
              </SwiperSlide>

              <SwiperSlide className="detail-sub-info-item release">
                <p className="detail-sub-title">{fReleaseText(content.data.code)}</p>
                <div className="detail-sub-content-wrapper">
                  <p className="detail-sub-content year">{fYear(content.data.release)}</p>
                  {fReleaseDate(content.data.release) && (
                    <p className="detail-sub-content date">{fReleaseDate(content.data.release)}</p>
                  )}
                </div>
              </SwiperSlide>

              <SwiperSlide
                className="detail-sub-info-item country"
                data-index={content.data.country ? content.data.country.length : 0}
              >
                <p className="detail-sub-title">제작국가</p>
                <div className="detail-sub-content-wrapper">
                  {content.data.country ? (
                    content.data.country.map((country, index) => (
                      <p className="detail-sub-content" key={index} data-indx={index + 1}>
                        {country.name_ko}
                      </p>
                    ))
                  ) : (
                    <p className="detail-sub-content">-</p>
                  )}
                </div>
              </SwiperSlide>

              <SwiperSlide
                className="detail-sub-info-item production"
                data-index={content.data.production ? content.data.production.length : 0}
              >
                <p className="detail-sub-title">제작사</p>
                <div className="detail-sub-content-wrapper">
                  {content.data.production ? (
                    content.data.production.map((prodn, index) => (
                      <Link
                        to={`/production/${prodn.id}`}
                        state={{ name: prodn.name }}
                        className="detail-sub-content"
                        key={index}
                      >
                        {prodn.name}
                      </Link>
                    ))
                  ) : (
                    <p className="detail-sub-content">-</p>
                  )}
                </div>
              </SwiperSlide>

              <SwiperSlide className="detail-sub-info-item runtime">
                <p className="detail-sub-title">{fRuntimeText(content.data.code)}</p>
                <div className="detail-sub-content-wrapper">
                  <p className="detail-sub-content">{content.data.runtime}</p>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </section>

        <div className="detail-main-wrapper">
          <section className="detail-sub-section">
            <PosterSection />
            <SynopsisSection />
            <div className="detail-more-wrapper">
              <MyRatingSection />
              <PlatformSection />
            </div>
          </section>
          <ActorSection />
          <StaffSection />
          <GallerySection />
          <ReviewSection />
        </div>
      </main>

      {reviewModal && <ReviewModal content={content.data} myReview={myInfo.review} onClose={toggleReviewModal} />}
    </>
  );
};

export default VideoDetail;
