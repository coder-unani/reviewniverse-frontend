import { isEmpty } from "lodash";
import { USER_CODE, VIDEO_ACTOR_CODE, VIDEO_STAFF_CODE, COUNTRY_CODE, VIDEO_PLATFORM_CODE } from "/src/config/codes";
import { DEFAULT_IMAGES } from "/src/config/constants";

// 유저 코드 포맷
export const formatUserCode = (code) => {
  const userCode = USER_CODE[code];
  return userCode || "10";
};

// screens 데이터 포맷
export const formatScreens = (screens, code) => {
  return screens.find((screen) => screen.code === code);
};

// provider 포맷
export const formatProvider = (provider) => {
  const providerCode = Object.keys(USER_CODE).find((key) => USER_CODE[key] === provider);
  return providerCode || "";
};

// 썸네일 이미지 포맷
export const formatThumbnail = (images) => {
  if (isEmpty(images)) return DEFAULT_IMAGES.noImage;
  if (isEmpty(images.url)) return images;
  return images.url;
};

// 배경 이미지 포맷
export const formatBackgroundImage = (images) => {
  if (isEmpty(images)) return DEFAULT_IMAGES.noImage;
  // images의 2번째 이미지
  return images[1];
};

// 포스터 이미지 포맷
export const formatPoster = (images) => {
  if (isEmpty(images)) return DEFAULT_IMAGES.noImage;
  // images의 1번째 이미지
  return images[0];
};

// 프리뷰 썸네일 포맷
export const formatPreviewThumbnail = (images) => {
  if (isEmpty(images)) return DEFAULT_IMAGES.noImage;
  if (images[2]) return images[2];
  if (images[1]) return images[1];
  return images[0];
};

// TODO: 관람등급 포맷

// 공개일자, 개봉일자 텍스트 포맷
export const formatReleaseText = (code) => {
  return code === "10" ? "개봉일자" : "공개일자";
};

// 날짜 포맷: 어떤 날짜 형식이 들어와도 월, 일만 반환 (MM.DD)
export const formatReleaseDate = (date) => {
  if (!date) return "";
  return date.split("-").slice(1).join(".");
};

// 국가 포맷 (한국,일본,미국)
export const formatCountry = (country) => {
  if (isEmpty(country)) return "국가";
  if (!Array.isArray(country)) return country;
  const countryAll = country.map((item) => item.name_ko).join(", ");
  return countryAll;
};

// 장르 포맷 (액션,드라마,로맨스)
export const formatGenre = (genre) => {
  if (isEmpty(genre)) return null;
  const gerneAll = genre.map((item) => item.name).join(", ");
  return gerneAll;
};

// 장르 포맷
export const formatGenreArray = (genre) => {
  // '영화', '시리즈', '프로그램' 단어 제거
  const cleanedGenre = genre.replace(/영화|시리즈|프로그램/g, "").trim();
  if (!cleanedGenre) return null;

  // 한글, 알파벳, 숫자, 공백을 제외한 모든 특수 문자 제거
  const sanitizedGenre = cleanedGenre.replace(/[^\w\s가-힣()]/g, "");

  // 단어들을 배열로 분리하고 빈 값 필터링
  const genreArray = sanitizedGenre.split(/\s+/).filter(Boolean);

  // 배열을 문자열로 결합
  return genreArray.join(",");
};

// 제작사 포맷
export const formatProduction = (production) => {
  if (isEmpty(production)) return null;
  const productionAll = production.map((item) => item.name).join(", ");
  return productionAll;
};

// 플랫폼 포맷
export const formatPlatform = (code) => {
  const platformType = VIDEO_PLATFORM_CODE[code];
  return platformType || "플랫폼";
};

// 평점 포맷
export const formatRating = (rating) => {
  return parseFloat(rating / 2).toFixed(1);
};

// 출연진 역할 코드 포맷
export const formatActorRoleCode = (code) => {
  const actorType = VIDEO_ACTOR_CODE[code];
  return actorType || "출연";
};

// 제작진 역할 코드 포맷
export const formatStaffRoleCode = (code) => {
  const staffType = VIDEO_STAFF_CODE[code];
  return staffType || "제작";
};

// 시리즈, 상영시간 텍스트 포맷
export const formatRuntimeText = (code) => {
  return code === "10" ? "상영시간" : "시리즈";
};
