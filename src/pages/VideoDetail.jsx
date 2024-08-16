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

  const { enjoyModal, reviewModal, confirmModal, toggleEnjoyModal, toggleReviewModal, toggleConfirmModal } =
    useModalContext();

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
          {content.data.title} ({fYear(content.data.release)}) - 리뷰니버스
        </title>
        <meta name="keywords" content={content.data.tag || ""} data-rh="true" />
        <meta name="description" content={content.data.synopsis} />
        <meta property="og:title" content={`${content.data.title} (${fYear(content.data.release)}) - 리뷰니버스`} />
        <meta property="og:description" content={content.data.synopsis} />
        <meta property="og:image" content={fThumbnail(content.data.thumbnail)} />
        <meta property="og:url" content={`${SETTINGS.DOMAIN_URL}/content/${videoId}`} />
        <meta name="twitter:card" content="summary_large_image" data-rh="true" />
        <meta
          name="twitter:title"
          content={`${content.data.title} (${fYear(content.data.release)}) - 리뷰니버스`}
          data-rh="true"
        />
        <meta name="twitter:description" content={content.data.synopsis} data-rh="true" />
        <meta name="twitter:image" content={fThumbnail(content.data.thumbnail)} data-rh="true" />
        <meta
          name="kakao:title"
          content={`${content.data.title} (${fYear(content.data.release)}) - 리뷰니버스`}
          data-rh="true"
        />
        <meta name="kakao:description" content={content.data.synopsis} data-rh="true" />
        <meta name="kakao:image" content={fThumbnail(content.data.thumbnail)} data-rh="true" />
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
              <div className="detail-title-container">
                <div className="detail-title-wrapper">
                  <p className="detail-title-og">{content.data.title_og || content.data.title}</p>
                  <h2 className="detail-title-kr">{content.data.title}</h2>
                </div>
                <ul className="detail-genre-wrapper">
                  {content.data.genre.map((genre, index) => (
                    <li key={index}>
                      <Link to={`/genre?genre=${fGenres(genre.name)}`} className="detail-genre-link">
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
            <article className="detail-poster-container">
              <picture className="detail-poster-wrapper">
                <LazyLoadImage
                  className="detail-poster"
                  src={fThumbnail(content.data.thumbnail)}
                  alt="포스터"
                  effect="blur"
                />
              </picture>
            </article>

            <article className="detail-content-container">
              <div className="detail-synopsis-wrapper">
                <h4 className="detail-main-title">작품 소개</h4>
                <summary className="detail-synopsis">{content.data.synopsis}</summary>
              </div>
            </article>

            <article className="detail-more-container">
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
                <RatingVideo videoId={videoId} myInfo={myInfo} toggleEnjoyModal={toggleEnjoyModal} />
              </div>

              {!isEmpty(content.data.platform) && (
                <article className="detail-platform-wrapper">
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
                </article>
              )}
            </article>
          </section>

          {!isEmpty(content.data.actor) && (
            <SwiperCast
              data={{
                title: "출연진",
                items: content.data.actor,
                target: "actor",
                formatCode: fActorCode,
              }}
            >
              <h4 className="detail-main-title">출연진</h4>
            </SwiperCast>
          )}

          {!isEmpty(content.data.staff) && (
            <SwiperCast
              data={{
                items: content.data.staff,
                target: "staff",
                formatCode: fStaffCode,
              }}
            >
              <h4 className="detail-main-title">제작진</h4>
            </SwiperCast>
          )}

          {!isEmpty(content.data.thumbnail) && (
            <SwiperGallery
              data={{
                items: content.data.thumbnail,
              }}
            >
              <h4 className="detail-main-title">갤러리</h4>
            </SwiperGallery>
          )}

          <section className="detail-review-section">
            <h4 className="detail-main-title">
              리뷰
              {reviews.total > 0 && (
                <span className="detail-review-total">{reviews.total > 999 ? "999+" : reviews.total}</span>
              )}
            </h4>
            <ReviewWrapper />
            {!isEmpty(reviews.data) && (
              <div className="detail-review-wrapper">
                {reviews.data.map((review, index) => (
                  <VideoReviewItem key={index} videoId={videoId} review={review} />
                ))}
              </div>
            )}
          </section>
        </div>

        {reviewModal && <ReviewModal content={content.data} myReview={myInfo.review} onClose={toggleReviewModal} />}
      </main>
    </>
  );
};

export default VideoDetail;
