import { find, isEmpty } from "lodash";
import { VIDEO_ACTOR_TYPE, VIDEO_STAFF_TYPE, COUNTRY_CODE } from "/src/config/types";
import { DEFAULT_IMAGES } from "/src/config/images";

// 배경 이미지 포맷
export const formatBackgroundImage = (images) => {
  if (isEmpty(images)) return DEFAULT_IMAGES.noImage;
  // 썸네일 이미지 배열 중에서 code가 11인 이미지만 렌더링
  const backgroundImage = find(images, { code: "11" });
  return backgroundImage.url;
};

// 포스터 이미지 포맷
export const formatPoster = (images) => {
  if (isEmpty(images)) return DEFAULT_IMAGES.noImage;
  // 이미지 배열 중에서 code가 10인 이미지만 렌더링
  // code가 10인 이미지가 없을 경우 code가 11인 이미지 렌더링
  const thumbnail = find(images, { code: "10" }) ?? find(images, { code: "11" });
  return thumbnail.url;
};

// 국가 코드 포맷
export const formatCountry = (code) => {
  const lang = "ko";
  const country = COUNTRY_CODE[code];
  return country ? country[`name_${lang}`] : "국가";
};

// 장르 포맷
export const formatGenre = (genre) => {
  // 장르가 없을 경우 null 반환
  if (isEmpty(genre)) return null;
  // 장르 id가 92인 장르만 반환, 없으면 첫번째 장르 반환
  // const selectedGenre = find(genre, { id: 92 }) ?? find(genre, { id: 95 }) ?? genre[0];
  // 장르 (, ) join
  const gerneAll = genre.map((item) => item.name).join(", ");
  return gerneAll;
};

// 평점 포맷
export const formatRating = (rating) => {
  return parseFloat(rating / 2).toFixed(1);
};

// 출연진 타입 포맷
export const formatActorType = (code) => {
  const actorType = VIDEO_ACTOR_TYPE[code];
  return actorType || "출연진";
};

// 제작진 타입 포맷
export const formatStaffType = (code) => {
  const staffType = VIDEO_STAFF_TYPE[code];
  return staffType || "제작진";
};
