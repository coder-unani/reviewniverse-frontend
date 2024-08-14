import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import VideoRating from "/src/components/VideoRating";
import ProfileImage from "/src/components/Button/Profile/ProfileImage";
import CastSwiper from "/src/components/CastSwiper";
import GallerySwiper from "/src/components/GallerySwiper";
import VideoReviewItem from "/src/components/VideoReviewItem";
import EnjoyModal from "/src/components/Modal/EnjoyModal";
import ReviewModal from "/src/components/Modal/ReviewModal";
import ConfirmModal from "/src/components/Modal/ConfirmModal";
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
import "swiper/css";
import { SETTINGS } from "/src/config/settings";
import { isEmpty, includes } from "lodash";
import { formatYear, formatUpperCase } from "/src/utils/format";
import {
  formatBackgroundImage,
  formatPoster,
  formatReleaseText,
  formatReleaseDate,
  formatGenreArray,
  formatRating,
  formatActorRoleCode,
  formatStaffRoleCode,
  formatRuntimeText,
} from "/src/utils/formatContent";
import { showSuccessToast } from "/src/components/Toast";
import { Tooltip } from "react-tooltip";
import FillTrashIcon from "/src/assets/button/fill-trash.svg?react";
import FillUpdateIcon from "/src/assets/button/fill-update.svg?react";

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
  const { mutateAsync: reviewLike } = useReviewLike();
  const { mutateAsync: reviewDelete } = useReviewDelete();

  const [enjoyModal, setEnjoyModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

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
    const res = await reviewDelete({ videoId, reviewId: myInfo.review.id, userId: user.id });
    if (res.status) {
      showSuccessToast(res.code);
    }
  };

  // 리뷰 좋아요
  const handleReviewLike = async (reviewId) => {
    if (!user) {
      toggleEnjoyModal();
      return;
    }
    await reviewLike({ videoId, reviewId, userId: user.id });
  };

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

  const NoReviewWrapper = ({ message }) => {
    return (
      <div className="detail-no-review-wrapper">
        <p className="no-review-text">{message}</p>
        <button type="button" className="no-review-button" onClick={handleReviewCreate}>
          리뷰 쓰기
        </button>
      </div>
    );
  };

  const ReviewWrapper = () => {
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

    if (message) return <NoReviewWrapper message={message} />;

    return (
      <div className="detail-my-review-wrapper">
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
            data-tooltip-id="myReviewDeleteButton"
            data-tooltip-content="삭제"
            className="my-review-delete-button"
            onClick={handleReviewDelete}
          >
            <FillTrashIcon className="my-review-button-icon" />
          </button>
          <button
            type="button"
            className="my-review-update-button"
            data-tooltip-id="myReviewUpdateButton"
            data-tooltip-content="수정"
            onClick={handleReviewUpdate}
          >
            <FillUpdateIcon className="my-review-button-icon" />
          </button>
        </div>
        <Tooltip id="myReviewDeleteButton" className="my-reivew-delete-tooltip" place="bottom" effect="solid" />
        <Tooltip id="myReviewUpdateButton" className="my-reivew-update-tooltip" place="bottom" effect="solid" />
      </div>
    );
  };

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

      <main className="detail-main-container">
        <section className="detail-main-section">
          <figure className="detail-background-wrapper">
            <div
              className="detail-background"
              style={{ backgroundImage: `url(${formatBackgroundImage(content.data.thumbnail)})` }}
            />
          </figure>

          <div className="detail-main-info-container">
            <div className="detail-main-info-wrapper">
              <div className="detail-title-container">
                <div className="detail-title-wrapper">
                  <p className="detail-title-og">{content.data.title_og || content.data.title}</p>
                  <h2 className="detail-title-kr">{content.data.title}</h2>
                </div>
                <ul className="detail-genre-wrapper">
                  {content.data.genre.map((genre, index) => (
                    <li key={index}>
                      <Link to={`/genre?genre=${formatGenreArray(genre.name)}`} className="detail-genre-link">
                        {genre.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="detail-control-container">
                <div className="detail-control-wrapper">
                  <button type="button" className="detail-control like" onClick={handleLikeButton}>
                    <span className={`detail-control-icon ${myInfo && myInfo.is_like ? "active" : ""}`}></span>
                  </button>
                  <button type="button" className="detail-control collection">
                    <span className="detail-control-icon"></span>
                  </button>
                  <button type="button" className="detail-control review" onClick={handleReviewCreate}>
                    <span className="detail-control-icon"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-sub-info-container">
            <Swiper className="detail-sub-info-wrapper" {...subInfoSwiperConfig}>
              <SwiperSlide
                className="detail-sub-info-item rating"
                data-index={content.data.rating > 0 ? Math.floor(formatRating(content.data.rating)) : 0}
              >
                <p className="detail-sub-title">평점</p>
                <div className="detail-sub-content-wrapper">
                  <p className="detail-sub-content">
                    {content.data.rating > 0 ? formatRating(content.data.rating) : "-"}
                  </p>
                </div>
              </SwiperSlide>

              <SwiperSlide className="detail-sub-info-item notice-age">
                <p className="detail-sub-title">관람등급</p>
                <div className="detail-sub-content-wrapper">
                  <p className="detail-sub-content">{formatUpperCase(content.data.notice_age)}</p>
                </div>
              </SwiperSlide>

              <SwiperSlide className="detail-sub-info-item release">
                <p className="detail-sub-title">{formatReleaseText(content.data.code)}</p>
                <div className="detail-sub-content-wrapper">
                  <p className="detail-sub-content year">{formatYear(content.data.release)}</p>
                  {formatReleaseDate(content.data.release) && (
                    <p className="detail-sub-content date">{formatReleaseDate(content.data.release)}</p>
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
                <p className="detail-sub-title">{formatRuntimeText(content.data.code)}</p>
                <div className="detail-sub-content-wrapper">
                  <p className="detail-sub-content">{content.data.runtime}</p>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </section>

        <div className="detail-main-wrapper">
          <section className="detail-sub-section">
            <div className="detail-poster-container">
              <figure className="detail-poster-wrapper">
                <LazyLoadImage
                  className="detail-poster"
                  src={formatPoster(content.data.thumbnail)}
                  alt="포스터"
                  effect="blur"
                />
              </figure>
            </div>

            <div className="detail-content-container">
              <div className="detail-synopsis-wrapper">
                <h4 className="detail-main-title">작품 소개</h4>
                <p className="detail-synopsis">{content.data.synopsis}</p>
              </div>
            </div>

            <div className="detail-more-container">
              <div className="detail-my-rating-wrapper">
                <h4 className="detail-main-title">평가하기</h4>
                <div className="detail-my-rating">
                  <span
                    className="my-rating-text number"
                    data-index={myInfo && myInfo.rating ? Math.floor(myInfo.rating / 2) : 0}
                  >
                    {myInfo && myInfo.rating ? Math.floor(myInfo.rating / 2) : "-"}
                  </span>
                  <span className="my-rating-text">/</span>
                  <span className="my-rating-text">5</span>
                </div>
                <VideoRating videoId={videoId} myInfo={myInfo} toggleEnjoyModal={toggleEnjoyModal} />
              </div>

              {!isEmpty(content.data.platform) && (
                <div className="detail-platform-wrapper">
                  <h4 className="detail-main-title">보러가기</h4>
                  <div className="detail-platform">
                    {content.data.platform.map((platform, index) => {
                      if (parseInt(platform.code) >= 50) {
                        return null;
                      }
                      return (
                        <button
                          type="button"
                          className="platform-button"
                          onClick={() => window.open(platform.url)}
                          key={index}
                        >
                          <img className="platform-image" src={`/assets/platform/${platform.code}.png`} alt="플랫폼" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>

          {!isEmpty(content.data.actor) && (
            <CastSwiper
              data={{
                title: "출연진",
                items: content.data.actor,
                target: "actor",
                formatCode: formatActorRoleCode,
              }}
            >
              <h4 className="detail-main-title">출연진</h4>
            </CastSwiper>
          )}

          {!isEmpty(content.data.staff) && (
            <CastSwiper
              data={{
                items: content.data.staff,
                target: "staff",
                formatCode: formatStaffRoleCode,
              }}
            >
              <h4 className="detail-main-title">제작진</h4>
            </CastSwiper>
          )}

          {!isEmpty(content.data.thumbnail) && (
            <GallerySwiper
              data={{
                items: content.data.thumbnail,
              }}
            >
              <h4 className="detail-main-title">갤러리</h4>
            </GallerySwiper>
          )}

          <section className="detail-review-section">
            <h4 className="detail-main-title">
              리뷰
              {reviews.total > 0 && (
                <span className="detail-review-total">{reviews.total > 999 ? "999+" : reviews.total}</span>
              )}
            </h4>
            <ReviewWrapper />
            {/* 리뷰 리스트 */}
            {!isEmpty(reviews.data) && (
              <div className="detail-review-wrapper">
                {reviews.data.map((review, index) => (
                  <VideoReviewItem
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

        {enjoyModal && <EnjoyModal onClose={toggleEnjoyModal} />}
        {reviewModal && <ReviewModal content={content.data} myReview={myInfo.review} onClose={toggleReviewModal} />}
        {confirmModal && <ConfirmModal onClose={toggleConfirmModal} />}
      </main>
    </>
  );
};

export default VideoDetail;
