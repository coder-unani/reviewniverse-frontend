import React, { useState, useEffect, useRef } from "react";
import Review from "/src/components/Review";
import People from "/src/components/People";
import PhotoModal from "/src/components/Modal/PhotoModal";
import EnjoyModal from "/src/components/Modal/EnjoyModal";
import ReviewModal from "/src/components/Modal/ReviewModal";
import ConfirmModal from "/src/components/Modal/ConfirmModal";
import ProfileImage from "/src/components/Button/Profile/ProfileImage";
import { useParams, Link } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useVideoDetail } from "/src/hooks/useVideoDetail";
import { useVideoDetailSearch } from "/src/hooks/useVideoDetailSearch";
import { useVideoReviews } from "/src/hooks/useVideoReviews";
import { useVideoMyInfo } from "/src/hooks/useVideoMyInfo";
import { useVideoRating } from "/src/hooks/useVideoRating";
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
  RiStarFill,
  RiUserSmileLine,
  RiUserSmileFill,
  RiPencilFill,
  RiDeleteBinFill,
  RiArrowRightSLine,
  RiArrowLeftSLine,
} from "@remixicon/react";
import { isEmpty, includes } from "lodash";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { formatYear, formatUpperCase } from "/src/utils/format";
import {
  formatBackgroundImage,
  formatPoster,
  formatCountry,
  formatGenreArray,
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
  // 비디오 아이디
  const { contentId } = useParams();
  const videoId = parseInt(contentId);
  // 사용자 정보
  const { user } = useAuthContext();
  // TODO: 비디오 상세 정보
  // const { data: content, error: contentError, isLoading: contentIsLoading } = useVideoDetail({ videoId });
  const { data: content, error: contentError, isLoading: contentIsLoading } = useVideoDetailSearch({ videoId });
  // 비디오 리뷰 목록
  const {
    data: reviews,
    error: reviewsError,
    isLoading: reviewsIsLoading,
  } = useVideoReviews({ videoId, page: 1, pageSize: 8 });
  // 비디오 내 정보
  const { data: myInfo, error: myInfoError, isLoading: myInfoIsLoading } = useVideoMyInfo({ videoId, enabled: user });
  // 비디오 평가하기
  const { mutate: videoRating } = useVideoRating();
  // 비디오 좋아요
  const { mutate: videoLike } = useVideoLike();
  // 리뷰 좋아요
  const { mutate: reviewLike } = useReviewLike();
  // 리뷰 삭제
  const { mutate: reviewDelete } = useReviewDelete();

  const [photoModal, setPhotoModal] = useState({ isOpen: false, url: "" });
  const [enjoyModal, setEnjoyModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const emptyRatingRef = useRef(null);
  const fillRatingRef = useRef(null);

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
      setEnjoyModal(true);
      return;
    }
    videoLike({ videoId });
  };

  // 리뷰 작성
  const handleReviewCreate = () => {
    if (!user) {
      setEnjoyModal(true);
      return;
    }
    setReviewModal(true);
  };

  // 리뷰 수정
  const handleReviewUpdate = () => {
    setReviewModal(true);
  };

  // 리뷰 삭제
  const handleReviewDelete = async () => {
    // TODO: 삭제 확인 모달 추가
    // setConfirmModal(true);
    reviewDelete({ videoId, reviewId: myInfo.review.id });
  };

  // 리뷰 좋아요
  const handleReviewLike = async (reviewId) => {
    if (!user) {
      setEnjoyModal(true);
      return;
    }
    reviewLike({ videoId, reviewId });
  };

  // TODO: 리뷰 자세히 보기

  useEffect(() => {
    if (!content) return;
    console.log(content);
  }, [content]);

  // 헤더 스타일 변경
  useEffect(() => {
    const header = document.querySelector("header");
    const logo = document.querySelector(".logo");

    // 스크롤시 헤더 스타일 변경
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
    const emptyRating = emptyRatingRef.current;
    const fillRating = fillRatingRef.current;
    if (!emptyRating || !fillRating) return;

    if (myInfo && myInfo.rating) {
      fillRating.style.width = `${myInfo.rating * 10}%`;
    }

    const width = emptyRating.getBoundingClientRect().width;

    const handleMouseOver = (e) => {
      const mouseX = e.clientX - emptyRating.getBoundingClientRect().left;
      const ratio = Math.max(0, Math.min(mouseX / width, 1));
      const rating = Math.ceil(ratio * 10);
      fillRating.dataset.rating = rating;
      fillRating.style.width = `${rating * 10}%`;
    };

    const handleMouseOut = () => {
      if (myInfo && myInfo.rating) {
        return (fillRating.style.width = `${myInfo.rating * 10}%`);
      }
      fillRating.style.width = "0%";
      fillRating.dataset.rating = "0";
    };

    const handleClick = async () => {
      if (!user) {
        setEnjoyModal(true);
        return;
      }

      videoRating({ videoId, rating: fillRatingRef?.current.dataset.rating });
    };

    emptyRating.addEventListener("mouseover", handleMouseOver);
    emptyRating.addEventListener("mouseout", handleMouseOut);
    emptyRating.addEventListener("click", handleClick);

    return () => {
      emptyRating.removeEventListener("mouseover", handleMouseOver);
      emptyRating.removeEventListener("mouseout", handleMouseOut);
      emptyRating.removeEventListener("click", handleClick);
    };
  }, [content, user, myInfo]);

  if (contentIsLoading || reviewsIsLoading || myInfoIsLoading) return null;

  return (
    <main className="content-main">
      <section className="banner-wrapper">
        <figure className="banner">
          <LazyLoadImage src={formatBackgroundImage(content.thumbnail)} alt="배경 이미지" effect="blur" />
        </figure>
        <div className="main-info-wrapper">
          <div className="main-info">
            <div>
              <h2 className="title-kr">{content.title}</h2>
              <p className="title-og">{content.title_og || content.title}</p>
              <div className="sub-info">
                <div>
                  <span>{formatYear(content.release)}</span>
                  <span>|</span>
                  <span>{formatCountry(content.country)}</span>
                  <span>|</span>
                  <span>{formatUpperCase(content.notice_age)}</span>
                  <span>|</span>
                  <span>{content.runtime}</span>
                </div>
                <div>
                  <span>
                    {content.genre.map((genre, index) => (
                      <React.Fragment key={index}>
                        <Link to={`/genre?genre=${formatGenreArray(genre.name)}`}>{genre.name}</Link>
                        {index < content.genre.length - 1 && ", "}
                      </React.Fragment>
                    ))}
                  </span>
                </div>
                {!isEmpty(content.production) && (
                  <div>
                    <span>
                      {content.production.map((prodn, index) => (
                        <React.Fragment key={index}>
                          <Link to={`/production/${prodn.id}`} state={{ name: prodn.name }}>
                            {prodn.name}
                          </Link>
                          {index < content.production.length - 1 && ", "}
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
            <LazyLoadImage src={formatPoster(content.thumbnail)} alt="포스터" effect="blur" />
          </figure>
        </div>
        <div className="info">
          <div className="top">
            <div className="rating-wrapper">
              <div className="empty-rating" ref={emptyRatingRef}>
                <RiStarFill size={45} />
                <RiStarFill size={45} />
                <RiStarFill size={45} />
                <RiStarFill size={45} />
                <RiStarFill size={45} />
              </div>
              <div className="fill-rating" ref={fillRatingRef}>
                <RiStarFill size={45} />
                <RiStarFill size={45} />
                <RiStarFill size={45} />
                <RiStarFill size={45} />
                <RiStarFill size={45} />
              </div>
              <span id="ratingText">평가하기</span>
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
            <p>{content.synopsis}</p>
          </div>
        </div>
      </section>

      <section className="crew-wrapper">
        <div className="title">
          <h3>출연진</h3>
        </div>
        <div className="swiper-container">
          <Swiper {...crewSwiperConfig(".prev-actor", ".next-actor")}>
            {content.actor.map((actor, index) => (
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

      {!isEmpty(content.staff) && (
        <section className="crew-wrapper">
          <div className="title">
            <h3>제작진</h3>
          </div>
          <div className="swiper-container">
            <Swiper {...crewSwiperConfig(".prev-staff", ".next-staff")}>
              {content.staff.map((staff, index) => (
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
          {content.review_count > 0 && <span>{content.review_count}</span>}
        </div>
        {reviews.length === 0 && (
          <div className="no-review">
            <p>기록된 리뷰가 없습니다. 리뷰를 남겨보세요!</p>
          </div>
        )}
        {reviews.length > 0 && (
          <ul className="reviews">
            {reviews.slice(0, 8).map((review, index) => (
              <li key={index}>
                <Review
                  review={review}
                  isLike={myInfo && includes(myInfo.review_like, review.id)}
                  onLikeClick={handleReviewLike}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="gallery-wrapper">
        <div className="title">
          <h3>갤러리</h3>
        </div>
        <div className="swiper-container">
          <Swiper {...gallerySwiperConfig(".prev-gallery", ".next-gallery")}>
            {content.thumbnail.map((image, index) => (
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
      {reviewModal && <ReviewModal content={content} myReview={myInfo.review} onClose={toggleReviewModal} />}
      {confirmModal && <ConfirmModal onClose={toggleConfirmModal} />}
    </main>
  );
};

export default Content;
