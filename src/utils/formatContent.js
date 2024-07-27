import { isEmpty } from "lodash";
import { USER_CODE, VIDEO_ACTOR_CODE, VIDEO_STAFF_CODE, COUNTRY_CODE, VIDEO_PLATFORM_CODE } from "/src/config/codes";
import { DEFAULT_IMAGES } from "/src/config/constants";

// 유저 코드 포맷
export const formatUserCode = (code) => {
  const userCode = USER_CODE[code];
  return userCode || "10";
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

export const formatBackgroundImage = (images) => {
  if (isEmpty(images)) return DEFAULT_IMAGES.noImage;
  // images의 2번째 이미지
  return images[1];
};

export const formatPoster = (images) => {
  if (isEmpty(images)) return DEFAULT_IMAGES.noImage;
  // images의 1번째 이미지
  return images[0];
};

// 국가 포맷
export const formatCountry = (country) => {
  if (isEmpty(country)) return "국가";
  if (!Array.isArray(country)) return country;
  const countryAll = country.map((item) => item.name_ko).join(", ");
  return countryAll;
};

// 장르 포맷
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
