import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import HttpClient from "/src/utils/HttpClient";
import { find, filter, isEmpty, set } from "lodash";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  RiStarFill,
  RiUserSmileLine,
  RiUserSmileFill,
  RiPencilFill,
  RiThumbUpLine,
  RiThumbUpFill,
} from "@remixicon/react";
import { formatYear, formatNumber, diffDate, formatUpperCase } from "/src/utils/format";
import ProfileButton from "/src/components/Button/ProfileButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "/src/styles/Content.css";
import { cLog, cError } from "/src/utils/test";
import PhotoModal from "/src/components/Modal/PhotoModal";
import EnjoyModal from "/src/components/Modal/EnjoyModal";
import ReviewModal from "/src/components/Modal/ReviewModal";
import { VIDEO_ACTOR_TYPE } from "/src/config/actorTypes";

const IMAGES = {
  noActor: "/src/assets/no-actor.png",
  noImage: "/src/assets/no-image.png",
  logo: "/src/assets/logo.svg",
  logoWhite: "/src/assets/logo-w.svg",
};

const API_BASE_URL = "https://comet.orbitcode.kr/v1";

/**
 * TODO:
 * 1. 평가하기 기능
 * 2. 감독/출연진 정보 (개편예정)
 * 3. 리뷰 기능
 * 4. 해당 사용자의 리뷰 작성 여부 확인
 * 5. 리뷰 작성되어 있으면 내가 쓴 코멘트 표시
 * 6. 리뷰 수정/삭제 기능
 * 7. 컴포넌트 분리
 */

const Content = () => {
  const { contentId } = useParams();
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [content, setContent] = useState({});
  const [reviews, setReviews] = useState([]);
  const [photoModal, setPhotoModal] = useState({ isOpen: false, url: "" });
  const [enjoyModal, setEnjoyModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const ratingRef = useRef();

  // 토큰 검증
  const tokenValidation = async () => {
    const access_token = sessionStorage.getItem("access_token");
    if (!access_token) return false;

    const client = new HttpClient(access_token);

    try {
      const res = await client.get(`${API_BASE_URL}/token`);
      if (res.status === 200) {
        return true;
      } else {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("access_token");
        setUser(null);
        return false;
      }
    } catch (error) {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("access_token");
      setUser(null);
      return false;
    }
  };

  // 장르 포맷
  const formatGenre = (genre) => {
    // 장르가 없을 경우 null 반환
    if (isEmpty(genre)) return null;
    // 장르 id가 92인 장르만 반환, 없으면 첫번째 장르 반환
    // const selectedGenre = find(genre, { id: 92 }) ?? find(genre, { id: 95 }) ?? genre[0];
    // 장르 (, ) join
    const gerneAll = genre.map((item) => item.name).join(", ");
    return gerneAll;
  };

  // 배경 이미지 포맷
  const formatBackgroundImage = (images) => {
    if (isEmpty(images)) return IMAGES.noImage;
    // 썸네일 이미지 배열 중에서 type이 11인 이미지만 렌더링
    const backgroundImage = find(images, { type: "11" });
    return backgroundImage.url;
  };

  // 포스터 이미지 포맷
  const formatPoster = (images) => {
    if (isEmpty(images)) return IMAGES.noImage;
    // 이미지 배열 중에서 type이 10인 이미지만 렌더링
    // type이 10인 이미지가 없을 경우 type이 11인 이미지 렌더링
    const thumbnail = find(images, { type: "10" }) ?? find(images, { type: "11" });
    return thumbnail.url;
  };

  // 평점 포맷
  const formatRating = (rating) => {
    return parseFloat(rating / 2);
  };

  // 배우 타입 포맷
  const formatActorType = (type) => {
    const actorType = find(VIDEO_ACTOR_TYPE, (item) => item[0] === type);
    return actorType ? actorType[1] : "출연진";
  };

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

  const handleLikeButton = async () => {
    // 로그인 여부 확인
    if (!user) {
      setEnjoyModal(true);
      return;
    }

    // 토큰 검증
    if (!isValidToken) {
      setEnjoyModal(true);
      return;
    }

    // 로그인 되어 있을 경우 회원 access token으로 좋아요 api 호출
    try {
      const access_token = sessionStorage.getItem("access_token");
      const client = new HttpClient(access_token);
      const res = await client.post(`${API_BASE_URL}/contents/videos/${contentId}/like`);
      if (res.status === 200 && res.code === "VIDEO_LIKE_UPDATE_SUCC") {
        setIsLike(res.data.data.is_like);
      } else {
        cLog("좋아요를 누르는데 실패하였습니다.");
      }
    } catch (error) {
      cError(error);
    }
  };

  const handleReviewButton = () => {
    // 로그인 여부 확인
    if (!user) {
      setEnjoyModal(true);
      return;
    }

    // 토큰 검증
    if (!isValidToken) {
      setEnjoyModal(true);
      return;
    }

    setReviewModal(true);
  };

  // 평점 mouseover 이벤트
  ratingRef.current?.addEventListener("mouseover", (e) => {
    const rating = e.target;
    const ratingText = document.getElementById("ratingText");

    console.log("mouseover");
  });

  useEffect(() => {
    // 헤더 스타일 변경
    const header = document.querySelector("header");
    const logo = document.querySelector(".logo");

    // 스크롤시 헤더 스타일 변경
    const handleScroll = () => {
      if (window.scrollY > 100 && header.classList.contains("transparent")) {
        header.classList.remove("transparent");
        logo.src = IMAGES.logo;
      } else if (window.scrollY <= 100 && !header.classList.contains("transparent")) {
        header.classList.add("transparent");
        logo.src = IMAGES.logoWhite;
      }
    };

    window.addEventListener("scroll", handleScroll);
    header.classList.add("transparent");
    logo.src = IMAGES.logoWhite;

    // 컴포넌트 언마운트시 이벤트 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
      header.classList.remove("transparent");
      logo.src = IMAGES.logo;
    };
  }, []);

  // API 요청
  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new HttpClient();
        const [contentRes, reviewRes] = await Promise.all([
          client.get(`${API_BASE_URL}/contents/videos/${contentId}`),
          client.get(`${API_BASE_URL}/contents/videos/${contentId}/reviews`),
        ]);

        if (contentRes.status === 200 && contentRes.code === "VIDEO_READ_SUCC") {
          setContent(contentRes.data.data);
        } else {
          cLog("콘텐츠를 불러오는데 실패하였습니다.");
          return;
        }

        if (reviewRes.status === 200 && reviewRes.code === "REVIEW_READ_SUCC") {
          setReviews(reviewRes.data.data);
        } else {
          cLog("리뷰를 불러오는데 실패하였습니다.");
          return;
        }

        const isValid = await tokenValidation();
        setIsValidToken(isValid);

        if (isValid) {
          const access_token = sessionStorage.getItem("access_token");
          const client = new HttpClient(access_token);
          const myInfoRes = await client.post(`${API_BASE_URL}/contents/videos/${contentId}/myinfo`);
          if (myInfoRes.status === 200 && myInfoRes.code === "VIDEO_MYINFO_READ_SUCC") {
            setIsLike(myInfoRes.data.data.is_like);
          } else {
            cLog("사용자 콘텐츠 관련 정보를 불러오는데 실패하였습니다.");
            return;
          }
        }
      } catch (error) {
        cError(error);
      }
    };

    fetchData();
  }, [contentId]);

  if (isEmpty(content)) return null;

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
              <p className="title-en">{content.title}</p>
              <div className="sub-info">
                <div>
                  <span>{formatYear(content.release)}</span>
                  <span>|</span>
                  <span>국가</span>
                  <span>|</span>
                  <span>{formatGenre(content.genre)}</span>
                </div>
                <div>
                  <span>{content.runtime}</span>
                  <span>|</span>
                  <span>{formatUpperCase(content.notice_age)}</span>
                </div>
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
              <div className="rating" ref={ratingRef}>
                <RiStarFill size={45} />
                <RiStarFill size={45} />
                <RiStarFill size={45} />
                <RiStarFill size={45} />
                <RiStarFill size={45} />
              </div>
              <span id="ratingText">평가하기</span>
            </div>
            <div className="button-wrapper">
              <button className={`like ${isLike ? "active" : ""}`} type="button" onClick={handleLikeButton}>
                {isLike ? <RiUserSmileFill size={32} /> : <RiUserSmileLine size={32} />}
                <span>좋아요</span>
              </button>
              <button className="review" type="button" onClick={handleReviewButton}>
                <RiPencilFill size={32} />
                <span>리뷰쓰기</span>
              </button>
              {/* <span id="likeText">
                {formatNumber(content.like_count)}명이 좋아해요!
              </span> */}
            </div>
          </div>
          <div className="bottom">
            <p>{content.synopsis}</p>
          </div>
        </div>
      </section>
      <section className="actor-wrapper">
        <h3>출연진</h3>
        <div className="actors">
          {content.actor.map((actor) => (
            <div className="actor" key={actor.id}>
              <figure className="image">
                <LazyLoadImage src={actor.picture || IMAGES.noActor} alt={actor.name} effect="blur" />
              </figure>
              <div className="name-wrapper">
                <span className="name">{actor.name}</span>
                <div className="role">
                  <span>{formatActorType(actor.type)}</span>
                  {actor.role && (
                    <>
                      <span>|</span>
                      <span>{actor.role}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {!isEmpty(content.staff) && (
        <section className="staff-warpper">
          <h3>제작진</h3>
          <div className="staffs">
            {content.staff.map((staff) => (
              <div className="staff" key={staff.id}>
                <figure className="image">
                  <LazyLoadImage src={staff.picture || IMAGES.noActor} alt={staff.name} effect="blur" />
                </figure>
                <div className="name-wrapper">
                  <span className="name">{staff.name}</span>
                  <div className="role">
                    <span>{staff.profile || "제작진"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="review-wrapper">
        <div className="title">
          <h3>리뷰</h3>
          <span>{content.review_count}</span>
        </div>
        <ul className="reviews">
          {reviews.slice(0, 8).map((review, index) => (
            <li className="review" key={index}>
              <div className="top">
                <ProfileButton image={review.user_profile_img} nickname={review.user_nickname} />
                {review.rating && (
                  <div className="rating">
                    <RiStarFill size={16} />
                    <span>{formatRating(review.rating)}</span>
                  </div>
                )}
              </div>
              <div className="content">
                <p>{review.title}</p>
              </div>
              <div className="bottom">
                <span>{diffDate(review.created_at)}</span>
                <button className="like">
                  <RiThumbUpLine size={16} />
                  <span>{review.like_count}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="gallery-wrapper">
        <div className="title">
          <h3>갤러리</h3>
        </div>
        <Swiper modules={[Navigation]} spaceBetween={10} slidesPerView={3} navigation>
          {content.thumbnail.map((image, index) => (
            <SwiperSlide key={index} onClick={() => togglePhotoModal(image.url)}>
              <figure className="photo">
                <LazyLoadImage src={image.url} alt="갤러리 이미지" effect="blur" />
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      {photoModal.isOpen && <PhotoModal url={photoModal.url} onClose={togglePhotoModal} />}
      {enjoyModal && <EnjoyModal onClose={toggleEnjoyModal} />}
      {reviewModal && <ReviewModal onClose={toggleReviewModal} />}
    </main>
  );
};

export default Content;
