import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import HttpClient from "/src/utils/HttpClient";
import { isEmpty } from "lodash";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { RiStarFill, RiUserSmileLine, RiUserSmileFill, RiPencilFill } from "@remixicon/react";
import { formatYear, formatUpperCase } from "/src/utils/format";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "/src/styles/Content.css";
import { cLog, cError } from "/src/utils/test";
import PhotoModal from "/src/components/Modal/PhotoModal";
import EnjoyModal from "/src/components/Modal/EnjoyModal";
import ReviewModal from "/src/components/Modal/ReviewModal";
import {
  formatBackgroundImage,
  formatPoster,
  formatCountry,
  formatGenre,
  formatActorType,
  formatStaffType,
} from "/src/utils/contentFormat";
import Review from "/src/components/Review";
import Crew from "/src/components/Crew";
import { DEFAULT_IMAGES } from "/src/config/images";
import MyReview from "/src/components/MyReview";

const API_BASE_URL = "https://comet.orbitcode.kr/v1";

/**
 * TODO:
 * 2. 배우, 제작진 타입 정렬
 * 3. 리뷰 기능
 * 4. 해당 사용자의 리뷰 작성 여부 확인
 * 5. 리뷰 작성되어 있으면 내가 쓴 코멘트 표시
 * 6. 리뷰 수정/삭제 기능
 * 7. 컴포넌트 분리
 * 8. 리뷰 리스트는 좋아요 순으로 정렬
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
  const [myInfo, setMyInfo] = useState({});
  const [myReview, setMyReview] = useState({});
  const [isValidToken, setIsValidToken] = useState(false);
  const emptyRatingRef = useRef(null);
  const fillRatingRef = useRef(null);

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
      if (res.status === 200) {
        // res.code === "VIDEO_LIKE_UPDATE_SUCC"
        setMyInfo({ ...myInfo, is_like: res.data.data.is_like });
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

  useEffect(() => {
    // 헤더 스타일 변경
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

    // 컴포넌트 언마운트시 이벤트 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
      header.classList.remove("transparent");
      logo.src = DEFAULT_IMAGES.logo;
    };
  }, []);

  useEffect(() => {
    const fetchContent = async (client) => {
      try {
        const [contentRes, reviewRes] = await Promise.all([
          client.get(`${API_BASE_URL}/contents/videos/${contentId}`),
          client.get(`${API_BASE_URL}/contents/videos/${contentId}/reviews`, {
            p: 1,
            ps: 8,
          }),
        ]);

        let isSuccess = true;

        if (contentRes.status === 200) {
          // contentRes.code === "VIDEO_READ_SUCC"
          setContent(contentRes.data.data);
        } else {
          cLog("콘텐츠를 불러오는데 실패하였습니다.");
          isSuccess = false;
        }

        if (reviewRes.status === 200) {
          // reviewRes.code === "REVIEW_READ_SUCC"
          setReviews(reviewRes.data.data);
        } else {
          cLog("리뷰를 불러오는데 실패하였습니다.");
          isSuccess = false;
        }

        return isSuccess;
      } catch (error) {
        cError(error);
        return false;
      }
    };

    const fetchMyInfo = async (client) => {
      try {
        const myInfoRes = await client.post(`${API_BASE_URL}/contents/videos/${contentId}/myinfo`);
        if (myInfoRes.status === 200) {
          // myInfoRes.code === "VIDEO_MYINFO_READ_SUCC"
          setMyInfo(myInfoRes.data.data);
        } else {
          cLog("사용자 콘텐츠 관련 정보를 불러오는데 실패하였습니다.");
        }
      } catch (error) {
        cError(error);
      }
    };

    const fetchData = async () => {
      const client = new HttpClient();
      await fetchContent(client);

      const isValid = await tokenValidation();
      setIsValidToken(isValid);

      if (isValid) {
        const access_token = sessionStorage.getItem("access_token");
        const clientWithToken = new HttpClient(access_token);
        fetchMyInfo(clientWithToken);
      }
    };

    fetchData();
  }, [contentId]);

  useEffect(() => {
    if (isEmpty(myInfo) || isEmpty(reviews) || !myInfo.review) return;

    const findMyReview = reviews.find((review) => review.id === myInfo.review);
    setMyReview(findMyReview);
  }, [reviews, myInfo]);

  useEffect(() => {
    const emptyRating = emptyRatingRef.current;
    const fillRating = fillRatingRef.current;
    if (!emptyRating || !fillRating) return;

    if (myInfo.rating) {
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
      if (myInfo.rating) return (fillRating.style.width = `${myInfo.rating * 10}%`);
      fillRating.style.width = "0%";
      fillRating.dataset.rating = "0";
    };

    const handleClick = async () => {
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
        const rating = fillRatingRef?.current.dataset.rating;
        const access_token = sessionStorage.getItem("access_token");
        const client = new HttpClient(access_token);
        const res = await client.post(`${API_BASE_URL}/contents/videos/${contentId}/ratings`, {}, { rating });
        if (res.status === 204) {
          if (res.code === "RATING_CREATE_SUCC" || res.code === "RATING_UPDATE_SUCC") {
            setMyInfo({ ...myInfo, rating });
          } else if (res.code === "RATING_DELETE_SUCC") {
            setMyInfo({ ...myInfo, rating: 0 });
          }
        } else {
          cLog("평가하기 실패");
        }
      } catch (error) {
        cError(error);
      }
    };

    emptyRating.addEventListener("mouseover", handleMouseOver);
    emptyRating.addEventListener("mouseout", handleMouseOut);
    emptyRating.addEventListener("click", handleClick);

    return () => {
      emptyRating.removeEventListener("mouseover", handleMouseOver);
      emptyRating.removeEventListener("mouseout", handleMouseOut);
      emptyRating.removeEventListener("click", handleClick);
    };
  }, [content, isValidToken, user, myInfo]);

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
                  <span>{formatCountry(content.country)}</span>
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
              <button className={`like ${myInfo.is_like ? "active" : ""}`} type="button" onClick={handleLikeButton}>
                {myInfo.is_like ? <RiUserSmileFill size={32} /> : <RiUserSmileLine size={32} />}
                <span>좋아요</span>
              </button>
              <button className="review" type="button" onClick={handleReviewButton}>
                <RiPencilFill size={32} />
                <span>리뷰쓰기</span>
              </button>
            </div>
          </div>
          {!isEmpty(myReview) && <MyReview myReview={myReview} />}
          <div className="bottom">
            <p>{content.synopsis}</p>
          </div>
        </div>
      </section>
      <section className="crew-wrapper">
        <h3>출연진</h3>
        <div className="crews">
          {content.actor.map((actor, index) => (
            <Crew crew={actor} type={formatActorType} key={index} />
          ))}
        </div>
      </section>
      {!isEmpty(content.staff) && (
        <section className="crew-wrapper">
          <h3>제작진</h3>
          <div className="crews">
            {content.staff.map((staff, index) => (
              <Crew crew={staff} type={formatStaffType} key={index} />
            ))}
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
                <Review review={review} />
              </li>
            ))}
          </ul>
        )}
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
      {reviewModal && <ReviewModal content={content} onClose={toggleReviewModal} />}
    </main>
  );
};

export default Content;
