import React, { useState, useEffect } from "react";
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
import { SETTINGS } from "/src/config/settings";
import { DEFAULT_IMAGES, DEFAULT_ICONS } from "/src/config/constants";
import { isEmpty, includes } from "lodash";
import { formatYear, formatUpperCase } from "/src/utils/format";
import {
  formatBackgroundImage,
  formatPoster,
  formatCountry,
  formatReleaseText,
  formatReleaseDate,
  formatGenreArray,
  formatRating,
  formatActorRoleCode,
  formatStaffRoleCode,
  formatRuntimeText,
} from "/src/utils/formatContent";
import "/src/styles/VideoDetail.css";

/**
 * TODO:
 * - 반응형 레이아웃
 * - 리뷰 무한 스크롤 (스와이퍼 삭제)
 * - 리뷰 없을 때 스타일 디벨롭
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

  const [photoModal, setPhotoModal] = useState({ isOpen: false, url: "" });
  const [enjoyModal, setEnjoyModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  // 비디오 정보 스와이퍼 설정
  const subInfoSwiperConfig = (prevEl, nextEl) => ({
    modules: [Navigation],
    spaceBetween: 12,
    slidesPerView: "auto",
    slidesPerGroup: 2,
    speed: 1000,
    navigation: { prevEl, nextEl },
    allowTouchMove: true,
  });

  // 출연진 스와이퍼 설정
  const crewSwiperConfig = (prevEl, nextEl) => ({
    modules: [Grid, Navigation],
    slidesPerView: 1,
    slidesPerGroup: 1,
    speed: 1000,
    grid: { rows: 2, fill: "column" },
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
        slidesPerView: 3,
        slidesPerGroup: 3,
        grid: { rows: 2, fill: "column" },
        allowTouchMove: false,
      },
      1281: {
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
    spaceBetween: 10,
    slidesPerView: 2.01,
    slidesPerGroup: 2,
    speed: 1000,
    navigation: { prevEl, nextEl },
    allowTouchMove: true,
    breakpoints: {
      577: {
        spaceBetween: 12,
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
  if (contentIsLoading || reviewsIsLoading || myInfoIsLoading) return <main className="detail-main"></main>;
  if (contentError || reviewsError || myInfoError) return navigate("/error");

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
        <meta property="og:url" content={`${SETTINGS.DOMAIN_URL}/content/${videoId}`} />
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

      <main className="detail-main">
        <section className="detail-info-wrapper">
          <figure className="background-image">
            <LazyLoadImage src={formatBackgroundImage(content.data.thumbnail)} alt="배경 이미지" effect="blur" />
          </figure>

          <div className="main-info-wrapper">
            <div className="main-info">
              <div className="info-right">
                <div className="info-title">
                  <p className="title-og">{content.data.title_og || content.data.title}</p>
                  <h2 className="title-kr">{content.data.title}</h2>
                </div>
                <ul className="info-genre">
                  {content.data.genre.map((genre, index) => (
                    <li key={index}>
                      <Link to={`/genre?genre=${formatGenreArray(genre.name)}`}>{genre.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="info-left">
                <div className="info-button">
                  <button type="button" className="like" onClick={handleLikeButton}>
                    <span className={`button-icon ${myInfo && myInfo.is_like ? "active" : ""}`}></span>
                  </button>
                  <button type="button" className="collection">
                    <span className="button-icon"></span>
                  </button>
                  <button type="button" className="review" onClick={handleReviewCreate}>
                    <span className="button-icon"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="sub-info-wrapper">
            <Swiper {...subInfoSwiperConfig(".prev-info", ".next-info")} className="sub-info">
              <SwiperSlide
                className="info-rating"
                data-index={content.data.rating > 0 ? Math.floor(formatRating(content.data.rating)) : 0}
              >
                <p className="sub-title">평점</p>
                <div className="sub-contents">
                  <p className="sub-content">{content.data.rating > 0 ? formatRating(content.data.rating) : "-"}</p>
                </div>
              </SwiperSlide>

              <SwiperSlide className="info-notice-age">
                <p className="sub-title">관람등급</p>
                <div className="sub-contents">
                  <p className="sub-content">{formatUpperCase(content.data.notice_age)}</p>
                </div>
              </SwiperSlide>

              <SwiperSlide className="info-release">
                <p className="sub-title">{formatReleaseText(content.data.code)}</p>
                <div className="sub-contents">
                  <p className="sub-content year">{formatYear(content.data.release)}</p>
                  {formatReleaseDate(content.data.release) && (
                    <p className="sub-content date">{formatReleaseDate(content.data.release)}</p>
                  )}
                </div>
              </SwiperSlide>

              <SwiperSlide className="info-country" data-index={content.data.country ? content.data.country.length : 0}>
                <p className="sub-title">제작국가</p>
                <div className="sub-contents">
                  {content.data.country ? (
                    content.data.country.map((country, index) => (
                      <p className="sub-content" key={index} data-indx={index + 1}>
                        {country.name_ko}
                      </p>
                    ))
                  ) : (
                    <p className="sub-content" data-index="0">
                      -
                    </p>
                  )}
                </div>
              </SwiperSlide>

              <SwiperSlide
                className="info-production"
                data-index={content.data.production ? content.data.production.length : 0}
              >
                <p className="sub-title">제작사</p>
                <div className="sub-contents">
                  {content.data.production ? (
                    content.data.production.map((prodn, index) => (
                      <Link
                        to={`/production/${prodn.id}`}
                        state={{ name: prodn.name }}
                        className="sub-content"
                        key={index}
                      >
                        {prodn.name}
                      </Link>
                    ))
                  ) : (
                    <p className="sub-content">-</p>
                  )}
                </div>
              </SwiperSlide>

              <SwiperSlide className="info-runtime">
                <p className="sub-title">{formatRuntimeText(content.data.code)}</p>
                <div className="sub-contents">
                  <p className="sub-content">{content.data.runtime}</p>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </section>

        <div className="detail-main-wrapper">
          <section className="detail-content-wrapper">
            <div className="poster-wrapper">
              <figure className="poster">
                <LazyLoadImage src={formatPoster(content.data.thumbnail)} alt="포스터" effect="blur" />
              </figure>
            </div>

            <div className="content-wrapper">
              {myInfo && !isEmpty(myInfo.review) && (
                <div className="my-review-wrapper">
                  <h4>내가 쓴 리뷰</h4>
                  <div className="my-review">
                    <ProfileImage image={user.profile_image} size={45} />
                    <div className="content" onClick={handleReviewCreate}>
                      <p>{myInfo.review.title}</p>
                    </div>
                    <div className="button-wrapper">
                      <button type="button" className="delete" onClick={handleReviewDelete}>
                        <img src={DEFAULT_ICONS.fillTrash} alt="삭제" />
                        <span>삭제</span>
                      </button>
                      |
                      <button type="button" className="update" onClick={handleReviewUpdate}>
                        <img src={DEFAULT_ICONS.fillUpdate} alt="수정" />
                        <span>수정</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="synopsis-wrapper">
                <h4>작품 소개</h4>
                <p>{content.data.synopsis}</p>
              </div>
            </div>

            <div className="more-wrapper">
              <div className="rating-wrapper">
                <h4>평가하기</h4>
                <div className="my-rating">
                  <span className="number" data-index={myInfo && myInfo.rating ? Math.floor(myInfo.rating / 2) : 0}>
                    {myInfo && myInfo.rating ? Math.floor(myInfo.rating / 2) : "-"}
                  </span>
                  <span>/</span>
                  <span>5</span>
                </div>
                <Rating2 videoId={videoId} myInfo={myInfo} toggleEnjoyModal={toggleEnjoyModal} />
              </div>

              {!isEmpty(content.data.platform) && (
                <div className="platform-wrapper">
                  <h4>보러가기</h4>
                  <div className="platforms">
                    {content.data.platform.map((platform, index) => {
                      if (platform.code === "50") {
                        return null;
                      }
                      return (
                        <button type="button" onClick={() => window.open(platform.url)} key={index}>
                          <img src={`/assets/platform/${platform.code}.png`} alt="플랫폼" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>

          {!isEmpty(content.data.actor) && (
            <section className="cast-wrapper">
              <h4>출연진</h4>
              <div className="swiper-container" data-length={content.data.actor.length}>
                <Swiper {...crewSwiperConfig(".prev-actor", ".next-actor")}>
                  {content.data.actor.map((actor, index) => (
                    <SwiperSlide key={index}>
                      <People crew={actor} target={"actor"} formatCode={formatActorRoleCode} key={index} />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className={`swiper-button-prev prev-actor`}>
                  <img src={DEFAULT_ICONS.arrowLeft} alt="왼쪽" />
                </div>
                <div className={`swiper-button-next next-actor`}>
                  <img src={DEFAULT_ICONS.arrowRight} alt="오른쪽" />
                </div>
              </div>
            </section>
          )}

          {!isEmpty(content.data.staff) && (
            <section className="cast-wrapper">
              <h4>제작진</h4>
              <div className="swiper-container" data-length={content.data.staff.length}>
                <Swiper {...crewSwiperConfig(".prev-staff", ".next-staff")}>
                  {content.data.staff.map((staff, index) => (
                    <SwiperSlide key={index}>
                      <People crew={staff} target={"staff"} formatCode={formatStaffRoleCode} key={index} />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className={`swiper-button-prev prev-staff`}>
                  <img src={DEFAULT_ICONS.arrowLeft} alt="왼쪽" />
                </div>
                <div className={`swiper-button-next next-staff`}>
                  <img src={DEFAULT_ICONS.arrowRight} alt="오른쪽" />
                </div>
              </div>
            </section>
          )}

          {!isEmpty(content.data.thumbnail) && (
            <section className="gallery-wrapper">
              <h4>갤러리</h4>
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
                  <img src={DEFAULT_ICONS.arrowLeft} alt="왼쪽" />
                </div>
                <div className="swiper-button-next next-gallery">
                  <img src={DEFAULT_ICONS.arrowRight} alt="오른쪽" />
                </div>
              </div>
            </section>
          )}

          <section className="review-wrapper">
            <div className="title">
              <h4>리뷰</h4>
              {content.data.review_count > 0 && <span>{content.data.review_count}</span>}
            </div>
            {isEmpty(reviews) ? (
              <div className="no-review">
                <p>기록된 리뷰가 없습니다. 첫번째 리뷰를 남겨보세요!</p>
                <button type="button" onClick={handleReviewCreate}>
                  리뷰 쓰기
                </button>
              </div>
            ) : (
              <div className="reviews">
                {reviews.map((review, index) => (
                  <Review
                    key={index}
                    review={review}
                    isLike={myInfo && includes(myInfo.review_like, review.id)}
                    onLikeClick={handleReviewLike}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {photoModal.isOpen && <PhotoModal url={photoModal.url} onClose={togglePhotoModal} />}
        {enjoyModal && <EnjoyModal onClose={toggleEnjoyModal} />}
        {reviewModal && <ReviewModal content={content.data} myReview={myInfo.review} onClose={toggleReviewModal} />}
        {confirmModal && <ConfirmModal onClose={toggleConfirmModal} />}
      </main>
    </>
  );
};

export default VideoDetail;
