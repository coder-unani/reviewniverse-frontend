import React, { useState, useEffect, useRef } from "react";
import Review from "/src/components/Review";
import People from "/src/components/People";
import PhotoModal from "/src/components/Modal/PhotoModal";
import EnjoyModal from "/src/components/Modal/EnjoyModal";
import ReviewModal from "/src/components/Modal/ReviewModal";
import ConfirmModal from "/src/components/Modal/ConfirmModal";
import ProfileImage from "/src/components/Button/Profile/ProfileImage";
import Rating2 from "/src/components/Rating2";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useVideoDetail } from "/src/hooks/useVideoDetail";
import { useVideoReviews } from "/src/hooks/useVideoReviews";
import { useVideoMyInfo } from "/src/hooks/useVideoMyInfo";
import { useVideoLike } from "/src/hooks/useVideoLike";
import { useReviewDelete } from "/src/hooks/useReviewDelete";
import { useReviewLike } from "/src/hooks/useReviewLike";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import {
  RiUserSmileLine,
  RiUserSmileFill,
  RiPencilFill,
  RiDeleteBinFill,
  RiArrowRightSLine,
  RiArrowLeftSLine,
} from "@remixicon/react";
import { SETTINGS } from "/src/config/settings";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { isEmpty, includes } from "lodash";
import { formatYear, formatUpperCase } from "/src/utils/format";
import {
  formatBackgroundImage,
  formatPoster,
  formatCountry,
  formatGenreArray,
  formatRating,
  formatActorRoleCode,
  formatStaffRoleCode,
} from "/src/utils/formatContent";
import "/src/styles/Content.css";

/**
 * TODO:
 * 6. 리뷰 수정/삭제 기능 (삭제시 확인 모달 추가)
 * 7. 컴포넌트 분리
 * 8. 리뷰 페이지네이션 추가
 * 9. 리뷰 리스트는 정렬 기본은 좋아요 순
 */

const Content = () => {
  const navigate = useNavigate();
  const { contentId } = useParams();
  const videoId = parseInt(contentId);
  const { user } = useAuthContext();
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
  const { mutate: reviewLike } = useReviewLike();
  const { mutate: reviewDelete } = useReviewDelete();
  const ratingNumberRef = useRef(null);

  const [photoModal, setPhotoModal] = useState({ isOpen: false, url: "" });
  const [enjoyModal, setEnjoyModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  // 출연진 스와이퍼 설정
  const crewSwiperConfig = (prevEl, nextEl) => ({
    modules: [Grid, Navigation],
    slidesPerView: 1,
    slidesPerGroup: 1,
    speed: 1000,
    grid: { rows: 3, fill: "column" },
    navigation: { prevEl, nextEl },
    allowTouchMove: true,
    breakpoints: {
      577: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        grid: { rows: 3, fill: "column" },
        allowTouchMove: false,
      },
      1025: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        grid: { rows: 3, fill: "column" },
        allowTouchMove: false,
      },
    },
  });

  // 리뷰 스와이터 설정
  const reviewSwiperConfig = (prevEl, nextEl) => ({
    modules: [Grid, Navigation],
    spaceBetween: 4,
    slidesPerView: 1,
    slidesPerGroup: 1,
    speed: 1000,
    grid: { rows: 1, fill: "column" },
    navigation: { prevEl, nextEl },
    allowTouchMove: true,
    breakpoints: {
      577: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        grid: { rows: 2, fill: "column" },
        allowTouchMove: false,
      },
      1025: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        grid: { rows: 2, fill: "column" },
        allowTouchMove: false,
      },
    },
  });

  // 갤러리 스와이퍼 설정
  const gallerySwiperConfig = (prevEl, nextEl) => ({
    modules: [Navigation],
    spaceBetween: 8,
    slidesPerView: 2.01,
    slidesPerGroup: 2,
    speed: 1000,
    navigation: { prevEl, nextEl },
    allowTouchMove: true,
    breakpoints: {
      577: {
        spaceBetween: 10,
        slidesPerView: 3,
        slidesPerGroup: 3,
        allowTouchMove: false,
      },
    },
  });

  // 사진 모달창 토글
  const togglePhotoModal = (url = "") => {
    setPhotoModal({ isOpen: !photoModal.isOpen, url });
  };

  // 로그인 필요 모달창 토글
  const toggleEnjoyModal = () => {
    setEnjoyModal(!enjoyModal);
  };

  // 리뷰 모달창 토글
  const toggleReviewModal = () => {
    setReviewModal(!reviewModal);
  };

  // 확인 모달창 토글
  const toggleConfirmModal = () => {
    setConfirmModal(!confirmModal);
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
    reviewDelete({ videoId, reviewId: myInfo.review.id, userId: user.id });
  };

  // 리뷰 좋아요
  const handleReviewLike = async (reviewId) => {
    if (!user) {
      toggleEnjoyModal();
      return;
    }
    reviewLike({ videoId, reviewId, userId: user.id });
  };

  // TODO: 리뷰 자세히 보기

  // 헤더 스타일 변경
  useEffect(() => {
    const header = document.querySelector("header");
    const logo = document.querySelector(".logo");

    const handleScroll = () => {
      if (window.scrollY > 100 && header.classList.contains("transparent")) {
        header.classList.remove("transparent");
        logo.src = DEFAULT_IMAGES.logo;
      } else if (window.scrollY <= 100 && !header.classList.contains("transparent")) {
        header.classList.add("transparent");
        logo.src = DEFAULT_IMAGES.logoWhite;
      }
    };

    window.addEventListener("scroll", handleScroll);
    header.classList.add("transparent");
    logo.src = DEFAULT_IMAGES.logoWhite;

    return () => {
      window.removeEventListener("scroll", handleScroll);
      header.classList.remove("transparent");
      logo.src = DEFAULT_IMAGES.logo;
    };
  }, []);

  useEffect(() => {
    const ratingNumber = ratingNumberRef.current;
    if (!ratingNumber || !content || contentIsLoading) return;
    ratingNumber.classList.remove("high", "middle", "low");
    if (content.data.rating > 6) {
      ratingNumber.classList.add("high");
    } else if (content.data.rating > 4) {
      ratingNumber.classList.add("middle");
    } else {
      ratingNumber.classList.add("low");
    }
  });

  useEffect(() => {
    if (!content) return;
    if (!content.status) {
      if (content.code === "V002") {
        navigate("/404-not-found");
      } else {
        navigate("/error");
      }
      return;
    }
  }, [content]);

  // TODO: 고도화 필요
  if (contentIsLoading || reviewsIsLoading || myInfoIsLoading) return null;
  if (contentError || reviewsError || myInfoError) return null;

  if (!content.status) return null;

  return (
    <>
      <Helmet>
        <title>
          {content.data.title} ({formatYear(content.data.release)}) - 리뷰니버스
        </title>
        <meta name="keywords" content={content.data.tag || ""} data-rh="true" />
        <meta name="description" content={content.data.synopsis} />
        <meta
          property="og:title"
          content={`${content.data.title} (${formatYear(content.data.release)}) - 리뷰니버스`}
        />
        <meta property="og:description" content={content.data.synopsis} />
        <meta property="og:image" content={formatPoster(content.data.thumbnail)} />
        <meta property="og:url" content={`${SETTINGS.DOMAIN_URL}/content/${contentId}`} />
        <meta name="twitter:card" content="summary_large_image" data-rh="true" />
        <meta
          name="twitter:title"
          content={`${content.data.title} (${formatYear(content.data.release)}) - 리뷰니버스`}
          data-rh="true"
        />
        <meta name="twitter:description" content={content.data.synopsis} data-rh="true" />
        <meta name="twitter:image" content={formatPoster(content.data.thumbnail)} data-rh="true" />
        <meta
          name="kakao:title"
          content={`${content.data.title} (${formatYear(content.data.release)}) - 리뷰니버스`}
          data-rh="true"
        />
        <meta name="kakao:description" content={content.data.synopsis} data-rh="true" />
        <meta name="kakao:image" content={formatPoster(content.data.thumbnail)} data-rh="true" />
      </Helmet>
      <main className="content-main">
        <section className="banner-wrapper">
          <figure className="banner">
            <LazyLoadImage src={formatBackgroundImage(content.data.thumbnail)} alt="배경 이미지" effect="blur" />
          </figure>
          <div className="main-info-wrapper">
            <div className="main-info">
              <div>
                <h2 className="title-kr">{content.data.title}</h2>
                <p className="title-og">{content.data.title_og || content.data.title}</p>
                <div className="sub-info">
                  <div>
                    <span>{formatYear(content.data.release)}</span>
                    <span>|</span>
                    <span>{formatCountry(content.data.country)}</span>
                    <span>|</span>
                    <span>{formatUpperCase(content.data.notice_age)}</span>
                    <span>|</span>
                    <span>{content.data.runtime}</span>
                  </div>
                  <div>
                    <span>
                      {content.data.genre.map((genre, index) => (
                        <React.Fragment key={index}>
                          <Link to={`/genre?genre=${formatGenreArray(genre.name)}`}>{genre.name}</Link>
                          {index < content.data.genre.length - 1 && ", "}
                        </React.Fragment>
                      ))}
                    </span>
                  </div>
                  {!isEmpty(content.data.production) && (
                    <div>
                      <span>
                        {content.data.production.map((prodn, index) => (
                          <React.Fragment key={index}>
                            <Link to={`/production/${prodn.id}`} state={{ name: prodn.name }}>
                              {prodn.name}
                            </Link>
                            {index < content.data.production.length - 1 && ", "}
                          </React.Fragment>
                        ))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="info-wrapper">
          <div className="poster-wrapper">
            <figure className="poster">
              <LazyLoadImage src={formatPoster(content.data.thumbnail)} alt="포스터" effect="blur" />
            </figure>
          </div>
          <div className="info">
            <div className="top">
              <div className="rating-wrapper">
                <div className="rating-text">
                  {content.data.rating > 0 ? (
                    <>
                      <span id="ratingNumber" ref={ratingNumberRef}>
                        {formatRating(content.data.rating)}
                      </span>
                      <span id="fullRating">/ 5</span>
                    </>
                  ) : (
                    <span id="emptyNumber">아직 기록된 평점이 없습니다.</span>
                  )}
                </div>
                <Rating2 videoId={videoId} myInfo={myInfo} toggleEnjoyModal={toggleEnjoyModal} />
              </div>

              <div className="button-wrapper">
                <button
                  className={`like ${myInfo && myInfo.is_like ? "active" : ""}`}
                  type="button"
                  onClick={handleLikeButton}
                >
                  {myInfo && myInfo.is_like ? <RiUserSmileFill size={32} /> : <RiUserSmileLine size={32} />}
                  <span>좋아요</span>
                </button>
                <button className="review" type="button" onClick={handleReviewCreate}>
                  <RiPencilFill size={32} />
                  <span>리뷰쓰기</span>
                </button>
              </div>
            </div>

            {myInfo && !isEmpty(myInfo.review) && (
              <div className="my-review-wrapper">
                <h4>내가 쓴 리뷰</h4>
                <div className="my-review">
                  <ProfileImage image={user.profile_image} size={56} />
                  <div className="content" onClick={handleReviewCreate}>
                    <p>{myInfo.review.title}</p>
                  </div>
                  <div className="button-wrapper">
                    <button type="button" className="delete" onClick={handleReviewDelete}>
                      <RiDeleteBinFill size={18} />
                      <span>삭제</span>
                    </button>
                    |
                    <button type="button" className="update" onClick={handleReviewUpdate}>
                      <RiPencilFill size={18} />
                      <span>수정</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="bottom">
              <p>{content.data.synopsis}</p>
            </div>
          </div>
        </section>

        <section className="crew-wrapper">
          <div className="title">
            <h3>출연진</h3>
          </div>
          <div className="swiper-container">
            <Swiper {...crewSwiperConfig(".prev-actor", ".next-actor")}>
              {content.data.actor.map((actor, index) => (
                <SwiperSlide key={index}>
                  <People crew={actor} target={"actor"} formatCode={formatActorRoleCode} key={index} />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className={`swiper-button-prev prev-actor`}>
              <RiArrowLeftSLine size={24} />
            </div>
            <div className={`swiper-button-next next-actor`}>
              <RiArrowRightSLine size={24} />
            </div>
          </div>
        </section>

        {!isEmpty(content.data.staff) && (
          <section className="crew-wrapper">
            <div className="title">
              <h3>제작진</h3>
            </div>
            <div className="swiper-container">
              <Swiper {...crewSwiperConfig(".prev-staff", ".next-staff")}>
                {content.data.staff.map((staff, index) => (
                  <SwiperSlide key={index}>
                    <People crew={staff} target={"staff"} formatCode={formatStaffRoleCode} key={index} />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className={`swiper-button-prev prev-staff`}>
                <RiArrowLeftSLine size={24} />
              </div>
              <div className={`swiper-button-next next-staff`}>
                <RiArrowRightSLine size={24} />
              </div>
            </div>
          </section>
        )}

        <section className="review-wrapper">
          <div className="title">
            <h3>리뷰</h3>
            {content.data.review_count > 0 && <span>{content.data.review_count}</span>}
          </div>
          {isEmpty(reviews) ? (
            <div className="no-review">
              <p>기록된 리뷰가 없습니다. 리뷰를 남겨보세요!</p>
            </div>
          ) : (
            <div className="swiper-container">
              <Swiper {...reviewSwiperConfig(".prev-review", ".next-review")}>
                {reviews.map((review, index) => (
                  <SwiperSlide key={index}>
                    <Review
                      review={review}
                      isLike={myInfo && includes(myInfo.review_like, review.id)}
                      onLikeClick={handleReviewLike}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className={`swiper-button-prev prev-review`}>
                <RiArrowLeftSLine size={24} />
              </div>
              <div className={`swiper-button-next next-review`}>
                <RiArrowRightSLine size={24} />
              </div>
            </div>
          )}
        </section>

        <section className="gallery-wrapper">
          <div className="title">
            <h3>갤러리</h3>
          </div>
          <div className="swiper-container">
            <Swiper {...gallerySwiperConfig(".prev-gallery", ".next-gallery")}>
              {content.data.thumbnail.map((image, index) => (
                <SwiperSlide key={index} onClick={() => togglePhotoModal(image)}>
                  <figure className="photo">
                    <LazyLoadImage src={image} alt="갤러리 이미지" effect="blur" />
                  </figure>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="swiper-button-prev prev-gallery">
              <RiArrowLeftSLine size={24} />
            </div>
            <div className="swiper-button-next next-gallery">
              <RiArrowRightSLine size={24} />
            </div>
          </div>
        </section>

        {photoModal.isOpen && <PhotoModal url={photoModal.url} onClose={togglePhotoModal} />}
        {enjoyModal && <EnjoyModal onClose={toggleEnjoyModal} />}
        {reviewModal && <ReviewModal content={content.data} myReview={myInfo.review} onClose={toggleReviewModal} />}
        {confirmModal && <ConfirmModal onClose={toggleConfirmModal} />}
      </main>
    </>
  );
};

export default Content;
