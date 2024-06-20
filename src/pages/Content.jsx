import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HttpClient from "/src/utils/HttpClient";
import { find, isEmpty } from "lodash";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { cLog, cError } from "/src/utils/test";
import "/src/styles/Content.css";

/**
 * TODO:
 * 1. 비디오 API 연동
 * 2. 비디오 상세 정보 표시
 * 3. 로딩 화면 추가 (ex. Skeleton)
 * 4. 감독/출연진 정보
 * 5. 좋아요 기능
 * 6. 리뷰 기능
 */

const Content = () => {
  const { contentId } = useParams();
  const [content, setContent] = useState({});

  useEffect(() => {
    const header = document.querySelector("header");
    header.classList.add("transparent");

    return () => {
      header.classList.remove("transparent");
    };
  }, []);

  useEffect(() => {
    try {
      const client = new HttpClient();
      client
        .get(`https://comet.orbitcode.kr/v1/contents/videos/${contentId}`)
        .then((res) => {
          if (res.status === 200 && res.code === "VIDEO_READ_SUCC") {
            setContent(res.data.data);
          } else {
            cLog("콘텐츠를 불러오는데 실패하였습니다.");
            return;
          }
        });
    } catch (error) {
      cError(error);
    }
  }, [contentId]);

  // 콘텐츠 썸네일 이미지 포맷
  const formatThumbnail = (images) => {
    // TODO: 이미지가 없을 경우 no-image 이미지 반환
    if (isEmpty(images)) return null;
    // 썸네일 이미지 배열 중에서 type이 10인 이미지만 렌더링
    // type이 10인 이미지가 없을 경우 type이 11인 이미지 렌더링
    const thumbnail =
      find(images, { type: "10" }) ?? find(images, { type: "11" });
    return thumbnail.url;
  };

  // 콘텐츠 배경 이미지 포맷
  const formatBackgroundImage = (images) => {
    // TODO: 이미지가 없을 경우 no-image 이미지 반환
    if (isEmpty(images)) return null;
    // 썸네일 이미지 배열 중에서 type이 11인 이미지만 렌더링
    // 없을 경우 no-image 이미지 반환
    const backgroundImage = find(images, { type: "11" });
    return backgroundImage.url;
  };

  // 장르 포맷
  const formatGenre = (genre) => {
    // 장르가 없을 경우 null 반환
    if (isEmpty(genre)) return null;
    // 장르 id가 92인 장르만 반환, 없으면 첫번째 장르 반환
    const selectedGenre =
      find(genre, { id: 92 }) ?? find(genre, { id: 95 }) ?? genre[0];
    // 장르 (, ) join
    // const gerneAll = genre.map((item) => item.name).join(", ");
    // return gerneAll;
    return selectedGenre.name;
  };

  if (isEmpty(content)) return null;

  cLog(content);

  return (
    <main className="main">
      <div className="info-wrapper">
        <figure className="background-image">
          <LazyLoadImage
            src={formatBackgroundImage(content.thumbnail)}
            alt="배경 썸네일"
            effect="blur"
          />
        </figure>
        <div className="img-wrapper">
          <figure className="thumbnail">
            <LazyLoadImage
              src={formatThumbnail(content.thumbnail)}
              alt="썸네일"
              effect="blur"
            />
          </figure>
        </div>
        <div className="title-wrapper">
          <h2 className="title-kr">{content.title}</h2>
          <p className="title-en">{content.title}</p>
          <div className="sub-info">
            <div>
              <span>{content.release}</span>
              <span>|</span>
              <span>국가</span>
              <span>|</span>
              <span>{formatGenre(content.genre)}</span>
            </div>
            <div>
              <span>{content.runtime}</span>
              <span>|</span>
              <span>{content.notice_age}</span>
            </div>
          </div>
          <div className="synopsis">
            <p>{content.synopsis}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Content;
