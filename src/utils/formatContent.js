import { isEmpty } from "lodash";
import {
  USER_CODE,
  SCREEN_MAIN_ID,
  VIDEO_ACTOR_CODE,
  VIDEO_STAFF_CODE,
  COUNTRY_CODE,
  VIDEO_PLATFORM_CODE,
} from "/src/config/codes";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { SETTINGS } from "/src/config/settings";

// 유저 코드 포맷
export const fUserCode = (code) => {
  const userCode = USER_CODE[code];
  return userCode || "10";
};

// 비디오 코드 포맷
export const fVideoCode = (code) => {
  return code === "10" ? "영화" : "시리즈";
};

// 스크린 데이터 포맷
export const fScreenCode = (screens, code) => {
  // SCREEN_MAIN_ID에 code가 포함되어 있는지 확인
  if (!SCREEN_MAIN_ID.includes(code)) return null;
  return screens.find((screen) => screen.code === code);
};

// provider 포맷
export const fProviderCode = (provider) => {
  const providerCode = Object.keys(USER_CODE).find((key) => USER_CODE[key] === provider);
  return providerCode || "";
};

// 플랫폼 포맷
export const fPlatformCode = (code) => {
  const platformType = VIDEO_PLATFORM_CODE[code];
  return platformType || "플랫폼";
};

// 플랫폼 배열에서 코드가 50미만인 것만 필터링
export const fPlatformFilter = (platforms) => {
  if (isEmpty(platforms)) return [];
  return platforms.filter((platform) => parseInt(platform.code) < 50);
};

// 출연진 역할 코드 포맷
export const fActorCode = (code) => {
  const actorType = VIDEO_ACTOR_CODE[code];
  return actorType || "출연";
};

// 제작진 역할 코드 포맷
export const fStaffCode = (code) => {
  const staffType = VIDEO_STAFF_CODE[code];
  return staffType || "제작";
};

export const fMakeImageUrl = (image, prefix = null) => {
  if (prefix) return `${SETTINGS.IMAGE_DOMAIN}${prefix}/${image}`;
  return `${SETTINGS.IMAGE_DOMAIN}${image}`;
};

// 프리뷰 썸네일 포맷
export const fPreviewThumbnail = (images) => {
  if (isEmpty(images)) return DEFAULT_IMAGES.noImage;
  if (Array.isArray(images)) {
    if (images[2]) return fMakeImageUrl(images[2]);
    if (images[1]) return fMakeImageUrl(images[1]);
    return fMakeImageUrl(images[0]);
  }
  return fMakeImageUrl(images);
};

// 썸네일 이미지 포맷
export const fThumbnail = (images) => {
  if (isEmpty(images)) return DEFAULT_IMAGES.noImage;
  if (Array.isArray(images)) return fMakeImageUrl(images[0], SETTINGS.IMAGE_RESIZE_R5);
  return fMakeImageUrl(images, SETTINGS.IMAGE_RESIZE_R5);
};

// 배경 이미지 포맷
export const fBackgroundImage = (images) => {
  if (isEmpty(images)) return DEFAULT_IMAGES.noImage;
  if (Array.isArray(images)) return fMakeImageUrl(images[1]);
  return fMakeImageUrl(images);
};

// 장르 포맷
export const fGenres = (genre) => {
  // '영화', '시리즈', '프로그램' 단어 제거
  const trimGenre = genre.replace(/영화|시리즈|프로그램/g, "").trim();
  if (!trimGenre) return null;
  // 한글, 알파벳, 숫자, 공백을 제외한 모든 특수 문자 제거
  const formatGenre = trimGenre.replace(/[^\w\s가-힣()]/g, "");
  // 단어들을 배열로 분리하고 빈 값 필터링
  const arrayGenre = formatGenre.split(/\s+/).filter(Boolean);
  // 배열을 문자열로 결합
  return arrayGenre.join(",");
};

// 장르 포맷 (액션, 드라마, 로맨스)
export const fGenreJoin = (genre) => {
  if (isEmpty(genre)) return null;
  const joinGenre = genre.map((item) => item.name).join(", ");
  return joinGenre;
};

// 평점 포맷
export const fRating = (rating) => {
  return parseFloat(rating / 2).toFixed(1);
};

// TODO: 관람등급 포맷

// 개봉일자, 공개일자 텍스트 포맷
export const fReleaseText = (code) => {
  return code === "10" ? "개봉일자" : "공개일자";
};

// 날짜 포맷: 어떤 날짜 형식이 들어와도 월, 일만 반환 (MM.DD)
export const fReleaseDate = (date) => {
  if (!date) return "";
  return date.split("-").slice(1).join(".");
};

// 국가 포맷 (한국,일본,미국)
export const fCountry = (country) => {
  if (isEmpty(country)) return "국가";
  if (!Array.isArray(country)) return country;
  const countryAll = country.map((item) => item.name_ko).join(", ");
  return countryAll;
};

// 제작사 포맷
export const fProductionJoin = (production) => {
  if (isEmpty(production)) return null;
  const joinProduction = production.map((item) => item.name).join(", ");
  return joinProduction;
};

// 상영시간, 시리즈 텍스트 포맷
export const fRuntimeText = (code) => {
  return code === "10" ? "상영시간" : "시리즈";
};
