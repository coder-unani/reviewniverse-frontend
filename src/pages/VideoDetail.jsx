import React, { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import RatingVideo from "/src/components/RatingVideo";
import ProfileImage from "/src/components/Button/Profile/Image";
import SwiperCast from "/src/components/SwiperCast";
import SwiperGallery from "/src/components/SwiperGallery";
import VideoReviewItem from "/src/components/VideoReviewItem";
import ReviewModal from "/src/components/Modal/Review";
import { useAuthContext } from "/src/context/AuthContext";
import { useModalContext } from "/src/context/ModalContext";
import { useVideoDetail } from "/src/hooks/useVideoDetail";
import { useVideoReviews } from "/src/hooks/useVideoReviews";
import { useVideoMyInfo } from "/src/hooks/useVideoMyInfo";
import { useVideoLike } from "/src/hooks/useVideoLike";
import { useReviewDelete } from "/src/hooks/useReviewDelete";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { SETTINGS } from "/src/config/settings";
import { isEmpty, includes } from "lodash";
import { fYear, fUpperCase } from "/src/utils/format";
import {
  fBackgroundImage,
  fThumbnail,
  fReleaseText,
  fReleaseDate,
  fGenres,
  fRating,
  fPlatformFilter,
  fActorCode,
  fStaffCode,
  fRuntimeText,
} from "/src/utils/formatContent";
import { showSuccessToast } from "/src/components/Toast";
import { Tooltip } from "react-tooltip";
import FillTrashIcon from "/src/assets/button/fill-trash.svg?react";
import FillUpdateIcon from "/src/assets/button/fill-update.svg?react";

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
  const navigate = useNavigate();
  const { videoId: id } = useParams();
  const videoId = parseInt(id);
  const { user } = useAuthContext();
  const { enjoyModal, reviewModal, confirmModal, toggleEnjoyModal, toggleReviewModal, toggleConfirmModal } =
    useModalContext();
  const { data: content, error: contentError, isLoading: contentIsLoading } = useVideoDetail({ videoId });
  const {
    data: reviews,
    error: reviewsError,
    isLoading: reviewsIsLoading,
  } = useVideoReviews({ videoId, page: 1, pageSize: 8 });
  const {
    data: myInfo,
    error: myInfoError,
    isLoading: myInfoIsLoading,
  } = useVideoMyInfo({ videoId, userId: user?.id, enabled: user });
  const { mutate: videoLike } = useVideoLike();
  const { mutateAsync: reviewDelete } = useReviewDelete();

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

  useEffect(() => {
    if (!content) return;
    if (!content.status) {
      const path = content.code === "V002" ? "/404-not-found" : "/error";
      navigate(path);
    }
  }, [content, navigate]);

  // 비디오 정보 스와이퍼 설정
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

  // 비디오 좋아요
  const handleLikeButton = async () => {
    if (!user) {
      toggleEnjoyModal();
      return;
    }
    videoLike({ videoId, userId: user.id });
  };

  // 리뷰 작성
  const handleReviewCreate = () => {
    if (!user) {
      toggleEnjoyModal();
      return;
    }
    toggleReviewModal();
  };

  // 리뷰 수정
  const handleReviewUpdate = () => {
    toggleReviewModal();
  };

  // 리뷰 삭제
  const handleReviewDelete = async () => {
    // TODO: 삭제 확인 모달 추가
    // setConfirmModal(true);
    const res = await reviewDelete({ videoId, reviewId: myInfo.review.id, userId: user.id });
    if (res.status) {
      showSuccessToast(res.code);
    }
  };

  const MetaSection = () => {
    const title = `${content.data.title} (${fYear(content.data.release)}) - 리뷰니버스`;
    const description = content.data.synopsis;
    const imageUrl = fThumbnail(content.data.thumbnail);
    const url = `${SETTINGS.DOMAIN_URL}/content/${videoId}`;
    const keywords = content.data.tag || "";

    return (
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
    );
  };

  const PosterSection = () => {
    const thumbnail = fThumbnail(content.data.thumbnail);

    return (
      <section className="detail-poster-section">
        <picture className="detail-poster-wrapper">
          <LazyLoadImage className="detail-poster" src={thumbnail} alt="포스터" effect="blur" />
        </picture>
      </section>
    );
  };

  const SynopsisSection = () => {
    const renderSynopsis = () => (
      <section className="detail-synopsis-section">
        <h4 className="detail-main-title">작품 소개</h4>
        <summary className="detail-synopsis">{content.data.synopsis}</summary>
      </section>
    );

    return isEmpty(content.data.synopsis) ? null : renderSynopsis();
  };

  const MyRatingSection = () => {
    const rating = myInfo && myInfo.rating ? Math.floor(myInfo.rating / 2) : 0;
    const ratingText = rating > 0 ? rating : "-";

    return (
      <section className="detail-my-rating-section">
        <h4 className="detail-main-title">평가하기</h4>
        <div className="detail-my-rating">
          <span className="my-rating-text number" data-index={rating}>
            {ratingText}
          </span>
          <span className="my-rating-text">/</span>
          <span className="my-rating-text">5</span>
        </div>
        <RatingVideo videoId={videoId} myInfo={myInfo} toggleEnjoyModal={toggleEnjoyModal} />
      </section>
    );
  };

  const PlatformSection = () => {
    const platforms = fPlatformFilter(content.data.platform);

    const renderPlatform = () => (
      <section className="detail-platform-section">
        <h4 className="detail-main-title">보러가기</h4>
        <article className="detail-platform-wrapper">
          {platforms.map((platform, index) => (
            <button type="button" className="detail-platform" onClick={() => window.open(platform.url)} key={index}>
              <img className="platform-image" src={`/assets/platform/${platform.code}.png`} alt="플랫폼" />
            </button>
          ))}
        </article>
      </section>
    );

    return isEmpty(platforms) ? null : renderPlatform();
  };

  const ActorSection = () => {
    const renderActor = () => (
      <section className="detail-cast-section">
        <h4 className="detail-main-title">출연진</h4>
        <SwiperCast items={content.data.actor} target={"actor"} formatCode={fActorCode} />
      </section>
    );

    return isEmpty(content.data.actor) ? null : renderActor();
  };

  const StaffSection = () => {
    const renderStaff = () => (
      <section className="detail-cast-section">
        <h4 className="detail-main-title">제작진</h4>
        <SwiperCast items={content.data.staff} target={"staff"} formatCode={fStaffCode} />
      </section>
    );

    return isEmpty(content.data.staff) ? null : renderStaff();
  };

  const GallerySection = () => {
    const renderGallery = () => (
      <section className="detail-gallery-section">
        <h4 className="detail-main-title">갤러리</h4>
        <SwiperGallery items={content.data.thumbnail} />
      </section>
    );

    return isEmpty(content.data.thumbnail) ? null : renderGallery();
  };

  const MyReviewWrapper = () => {
    const getMessage = () => {
      let message = "";
      if (!myInfo) {
        message = "로그인 후 리뷰를 기록할 수 있어요!";
      } else if (isEmpty(reviews.data)) {
        message = (
          <>
            기록된 리뷰가 없습니다. <em>첫번째</em> 리뷰를 남겨보세요!
          </>
        );
      } else if (isEmpty(myInfo.review)) {
        message = "기록된 리뷰가 없습니다. 리뷰를 남겨보세요!";
      }
      return message;
    };

    const renderNoReview = (message) => (
      <article className="detail-no-review-wrapper">
        <p className="no-review-text">{message}</p>
        <button type="button" className="no-review-button" onClick={handleReviewCreate}>
          리뷰 쓰기
        </button>
      </article>
    );

    const renderMyReview = () => (
      <article className="detail-my-review-wrapper">
        <div className="my-review-title-wrapper">
          <ProfileImage image={user.profile_image} size={36} />
          <p className="my-review-title" onClick={handleReviewCreate}>
            {myInfo.review.title}
          </p>
          {/* <div className="my-review-content-wrapper">
            <p className="my-review-title" onClick={handleReviewCreate}>
              {myInfo.review.title}
            </p>
            <p>{myInfo.review.created_at}</p>
          </div> */}
        </div>
        <div className="my-review-button-wrapper">
          <button
            type="button"
            data-tooltip-id="myReviewDeleteTooltip"
            data-tooltip-content="삭제"
            className="my-review-delete-button"
            onClick={handleReviewDelete}
          >
            <FillTrashIcon className="my-review-button-icon" />
          </button>
          <button
            type="button"
            className="my-review-update-button"
            data-tooltip-id="myReviewUpdateTooltip"
            data-tooltip-content="수정"
            onClick={handleReviewUpdate}
          >
            <FillUpdateIcon className="my-review-button-icon" />
          </button>
        </div>
        <Tooltip id="myReviewDeleteTooltip" className="my-reivew-delete-tooltip" place="bottom" effect="solid" />
        <Tooltip id="myReviewUpdateTooltip" className="my-reivew-update-tooltip" place="bottom" effect="solid" />
      </article>
    );

    const message = getMessage();
    return message ? renderNoReview(message) : renderMyReview();
  };

  const ReviewSection = () => {
    const renderReviewTotal = () => {
      if (reviews.total <= 0) return null;
      const total = reviews.total > 999 ? "999+" : reviews.total;
      return <span className="detail-review-total">{total}</span>;
    };

    const renderReviews = () => {
      if (isEmpty(reviews.data)) return null;
      return (
        <article className="detail-review-wrapper">
          {reviews.data.map((review) => (
            <VideoReviewItem key={review.id} videoId={videoId} review={review} />
          ))}
        </article>
      );
    };

    return (
      <section className="detail-review-section">
        <h4 className="detail-main-title">
          리뷰
          {renderReviewTotal()}
        </h4>
        <MyReviewWrapper />
        {renderReviews()}
      </section>
    );
  };

  // TODO: 고도화 필요
  if (contentIsLoading || reviewsIsLoading || myInfoIsLoading) return <main className="detail-main"></main>;
  if (contentError || reviewsError || myInfoError) return navigate("/error");

  if (!content.status) return null;

  return (
    <>
      <MetaSection />

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
                  <button type="button" className="detail-control like" onClick={handleLikeButton}>
                    <span className={`detail-control-icon ${myInfo && myInfo.is_like ? "active" : ""}`}></span>
                  </button>
                  <button type="button" className="detail-control collection">
                    <span className="detail-control-icon"></span>
                  </button>
                  <button type="button" className="detail-control review" onClick={handleReviewCreate}>
                    <span className="detail-control-icon"></span>
                  </button>
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

        {reviewModal && <ReviewModal content={content.data} myReview={myInfo.review} onClose={toggleReviewModal} />}
      </main>
    </>
  );
};

export default VideoDetail;
