import { find, isEmpty } from "lodash";
import { VIDEO_ACTOR_CODE, VIDEO_STAFF_CODE, COUNTRY_CODE, VIDEO_PLATFORM_CODE } from "/src/config/types";
import { DEFAULT_IMAGES } from "/src/config/images";

// 배경 이미지 포맷
export const formatBackgroundImage = (images) => {
  // 썸네일 이미지 배열 중에서 code가 11인 이미지만 렌더링
  const backgroundImage = images?.find((image) => image.code === "11");
  return backgroundImage?.url || DEFAULT_IMAGES.noImage;
};

// 포스터 이미지 포맷
export const formatPoster = (images) => {
  // 이미지 배열 중에서 code가 10인 이미지만 렌더링
  const thumbnail = images?.find((image) => image.code === "10") ?? images?.find((image) => image.code === "11");
  return thumbnail?.url || DEFAULT_IMAGES.noImage;
};

/*
// 국가 코드 포맷
export const formatCountry = (code) => {
  const lang = "ko";
  const country = COUNTRY_CODE[code];
  return country ? country[`name_${lang}`] : "국가";
};
*/

// 국가 포맷
export const formatCountry = (country) => {
  if (isEmpty(country)) return "국가";
  const countryAll = country.map((item) => item.name_ko).join(", ");
  return countryAll;
};

// 장르 포맷
export const formatGenre = (genre) => {
  if (isEmpty(genre)) return null;
  const gerneAll = genre.map((item) => item.name).join(", ");
  return gerneAll;
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

// 출연진 타입 포맷
export const formatActorType = (code) => {
  const actorType = VIDEO_ACTOR_CODE[code];
  return actorType || "출연진";
};

// 제작진 타입 포맷
export const formatStaffType = (code) => {
  const staffType = VIDEO_STAFF_CODE[code];
  return staffType || "제작진";
};
