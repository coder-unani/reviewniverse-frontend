import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HttpClient from "/src/utils/HttpClient";
import { find, filter, isEmpty, set } from "lodash";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { RiStarFill, RiUserSmileFill, RiPencilFill, RiThumbUpLine, RiThumbUpFill } from "@remixicon/react";
import { formatYear, formatNumber, diffDate, formatUpperCase } from "/src/utils/format";
import ProfileButton from "/src/components/Button/ProfileButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "/src/styles/Content.css";
import { cLog, cError } from "/src/utils/test";
import PhotoModal from "/src/components/Modal/PhotoModal";

/**
 * TODO:
 * 1. 비디오 API 연동
 * 2. 비디오 상세 정보 표시
 * 3. 로딩 화면 추가 (ex. Skeleton)
 * 4. 감독/출연진 정보 (개편예정)
 * 5. 좋아요 기능
 * 6. 리뷰 기능
 * 7. 포스터 클릭시 이미지 확대
 * 8. 갤러리 기능
 * 9. 컴포넌트 분리
 */

const Content = () => {
  const { contentId } = useParams();
  const [content, setContent] = useState({});
  const [reviews, setReviews] = useState([]);
  const [photoModal, setPhotoModal] = useState({ isOpen: false, url: "" });
  const noActorImg = "/src/assets/no-actor.png";
  const noImageImg = "/src/assets/no-image.png";

  // 장르 포맷
  const formatGenre = (genre) => {
    // 장르가 없을 경우 null 반환
    if (isEmpty(genre)) return null;
    // 장르 id가 92인 장르만 반환, 없으면 첫번째 장르 반환
    const selectedGenre = find(genre, { id: 92 }) ?? find(genre, { id: 95 }) ?? genre[0];
    // 장르 (, ) join
    const gerneAll = genre.map((item) => item.name).join(", ");
    return gerneAll;
  };

  // 배경 이미지 포맷
  const formatBackgroundImage = (images) => {
    if (isEmpty(images)) return noImageImg;
    // 썸네일 이미지 배열 중에서 type이 11인 이미지만 렌더링
    const backgroundImage = find(images, { type: "11" });
    return backgroundImage.url;
  };

  // 포스터 이미지 포맷
  const formatPoster = (images) => {
    if (isEmpty(images)) return noImageImg;
    // 이미지 배열 중에서 type이 10인 이미지만 렌더링
    // type이 10인 이미지가 없을 경우 type이 11인 이미지 렌더링
    const thumbnail = find(images, { type: "10" }) ?? find(images, { type: "11" });
    return thumbnail.url;
  };

  // 갤러리 이미지 포맷
  const formatGallery = (images) => {
    // 이미지 배열 중에서 type이 11인 이미지만 렌더링
    const gallery = filter(images, { type: "11" });
    return gallery;
  };

  // 모달창 열기
  const handleModalOpen = (url) => {
    setPhotoModal({ isOpen: true, url });
  };

  // 모달창 닫기
  const handleModalClose = () => {
    setPhotoModal({ isOpen: false, url: "" });
  };

  // 좋아요 버튼 클릭시 로그인 여부 확인

  // 로그인 안되어 있을 경우 로그인 필요 모달창 띄우기
  // 로그인 되어 있을 경우 회원 access token으로 좋아요 api 호출

  // 헤더 스타일 변경
  useEffect(() => {
    const header = document.querySelector("header");
    const logo = document.querySelector(".logo");

    // 스크롤시 헤더 스타일 변경
    const handleScroll = () => {
      if (window.scrollY > 100 && header.classList.contains("transparent")) {
        header.classList.remove("transparent");
        logo.src = "/src/assets/logo.svg";
      } else if (window.scrollY <= 100 && !header.classList.contains("transparent")) {
        header.classList.add("transparent");
        logo.src = "/src/assets/logo-w.svg";
      }
    };

    window.addEventListener("scroll", handleScroll);
    header.classList.add("transparent");
    logo.src = "/src/assets/logo-w.svg";

    // 컴포넌트 언마운트시 이벤트 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
      header.classList.remove("transparent");
      logo.src = "/src/assets/logo.svg";
    };
  }, []);

  // API 요청
  useEffect(() => {
    try {
      const client = new HttpClient();
      // 비디오 상세 정보 요청
      client.get(`https://comet.orbitcode.kr/v1/contents/videos/${contentId}`).then((res) => {
        if (res.status === 200 && res.code === "VIDEO_READ_SUCC") {
          setContent(res.data.data);
        } else {
          cLog("콘텐츠를 불러오는데 실패하였습니다.");
          return;
        }
      });

      // 비디오 리뷰 요청
      client.get(`https://comet.orbitcode.kr/v1/contents/videos/${contentId}/reviews`).then((res) => {
        if (res.status === 200 && res.code === "REVIEW_READ_SUCC") {
          setReviews(res.data.data);
        } else {
          cLog("리뷰를 불러오는데 실패하였습니다.");
          return;
        }
      });
    } catch (error) {
      cError(error);
    }
  }, [contentId]);

  if (isEmpty(content)) return null;

  return (
    <main className="content-main">
      <section className="banner-wrapper">
        <figure className="banner">
          <LazyLoadImage src={formatBackgroundImage(content.thumbnail) || noImageImg} alt="배경 이미지" effect="blur" />
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
            <LazyLoadImage src={formatPoster(content.thumbnail) || noImageImg} alt="포스터" effect="blur" />
          </figure>
        </div>
        <div className="info">
          <div className="top">
            <div className="rating-wrapper">
              <div className="rating">
                <RiStarFill size={45} />
                <RiStarFill size={45} />
                <RiStarFill size={45} />
                <RiStarFill size={45} />
                <RiStarFill size={45} />
              </div>
              <span id="ratingText">평가하기</span>
            </div>
            <div className="button-wrapper">
              <button className="like" type="button">
                <RiUserSmileFill size={22} />
                <span>좋아요</span>
              </button>
              <button className="review" type="button">
                <RiPencilFill size={22} />
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
              <figure className="profile">
                <LazyLoadImage src={actor.picture || noActorImg} alt={actor.name} effect="blur" />
              </figure>
              <div className="name-wrapper">
                <span className="name">{actor.name}</span>
                <span className="role">{actor.profile || "출연진"}</span>
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
                <figure className="profile">
                  <LazyLoadImage src={staff.picture || noActorImg} alt={staff.name} effect="blur" />
                </figure>
                <div className="name-wrapper">
                  <span className="name">{staff.name}</span>
                  <span className="role">{staff.profile || "제작진"}</span>
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
                <div className="rating">
                  <RiStarFill size={16} />
                  <span>3.5</span>
                </div>
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
            <SwiperSlide key={index} onClick={() => handleModalOpen(image.url)}>
              <figure className="photo">
                <LazyLoadImage src={image.url} alt="갤러리 이미지" effect="blur" />
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
        {photoModal.isOpen && <PhotoModal url={photoModal.url} onClose={handleModalClose} />}
      </section>
    </main>
  );
};

export default Content;
