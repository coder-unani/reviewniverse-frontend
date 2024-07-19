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
  const providerCode = {
    email: "10",
    google: "11",
    facebook: "12",
    apple: "13",
    kakao: "14",
    naver: "15",
  };
  return providerCode[provider] || "10";
};

// 썸네일 이미지 포맷
export const formatThumbnail = (images) => {
  if (isEmpty(images)) return DEFAULT_IMAGES.noImage;
  if (isEmpty(images.url)) return images;
  return images.url;
};
/*
// 배경 이미지 포맷
export const formatBackgroundImage = (images) => {
  // 썸네일 이미지 배열 중에서 code가 11인 이미지만 렌더링
  const backgroundImage = images?.find((image) => image.code === "11");
  return backgroundImage?.url || DEFAULT_IMAGES.noImage;
};
*/

export const formatBackgroundImage = (images) => {
  if (isEmpty(images)) return DEFAULT_IMAGES.noImage;
  // images의 2번째 이미지
  return images[1];
};

/*
// 포스터 이미지 포맷
export const formatPoster = (images) => {
  // 이미지 배열 중에서 code가 10인 이미지만 렌더링
  const thumbnail = images?.find((image) => image.code === "10") ?? images?.find((image) => image.code === "11");
  return thumbnail?.url || DEFAULT_IMAGES.noImage;
};
*/

export const formatPoster = (images) => {
  if (isEmpty(images)) return DEFAULT_IMAGES.noImage;
  // images의 1번째 이미지
  return images[0];
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
  return actorType || "출연진";
};

// 제작진 역할 코드 포맷
export const formatStaffRoleCode = (code) => {
  const staffType = VIDEO_STAFF_CODE[code];
  return staffType || "제작진";
};
