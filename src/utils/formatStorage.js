import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  getSessionStorage,
  setSessionStorage,
  removeSessionStorage,
  setCookie,
  getCookie,
  removeCookie,
} from "/src/utils/storage";

// SNS 유저 정보 설정
export const setStorageSnsUser = (sns_user) => {
  // setSessionStorage("sns_user", JSON.stringify(sns_user));
  setCookie("sns_user", JSON.stringify(sns_user), { path: "/" });
};

// SNS 유저 정보 가져오기
export const getStorageSnsUser = () => {
  // const getSnsUser = getSessionStorage("sns_user");
  const getSnsUser = getCookie("sns_user");
  return getSnsUser ? JSON.parse(getSnsUser) : null;
};

// SNS 유저 정보 삭제
export const removeStorageSnsUser = () => {
  // removeSessionStorage("sns_user");
  removeCookie("sns_user", { path: "/" });
};

// 유저 정보 설정
export const setStorageUser = (user) => {
  // setSessionStorage("user", JSON.stringify(user));
  setCookie("user", JSON.stringify(user), { path: "/" });
};

// 유저 정보 가져오기
export const getStorageUser = () => {
  // const getUser = getSessionStorage("user");
  const getUser = getCookie("user");
  return getUser ? JSON.parse(getUser) : null;
};

// 유저 정보 삭제
export const removeStorageUser = () => {
  // removeSessionStorage("user");
  removeCookie("user", { path: "/" });
};

// 액세스 토큰 설정
export const setStorageAccessToken = (access_token) => {
  // setSessionStorage("access_token", access_token);
  setCookie("access_token", access_token, { path: "/" });
};

// 액세스 토큰 가져오기
export const getStorageAccessToken = () => {
  // return getSessionStorage("access_token");
  return getCookie("access_token");
};

// 액세스 토큰 삭제
export const removeStorageAccessToken = () => {
  // removeSessionStorage("access_token");
  removeCookie("access_token", { path: "/" });
};

// 최근 검색 키워드 설정
export const setStorageKeyword = (keyword) => {
  let data = getLocalStorage("RECENT_SEARCH_KEYWORDS");
  data = data ? JSON.parse(data) : [];
  data = new Set(data);
  if (data.has(keyword)) data.delete(keyword);
  data = [keyword, ...data];
  setLocalStorage("RECENT_SEARCH_KEYWORDS", JSON.stringify(data));
};

// 최근 검색 키워드 가져오기
export const getStorageKeyword = () => {
  let data = getLocalStorage("RECENT_SEARCH_KEYWORDS");
  data = data ? JSON.parse(data) : [];
  data = [...data];
  return data;
};

// 최근 검색 키워드 갯수 제한
export const sliceStorageKeyword = (length) => {
  let data = getLocalStorage("RECENT_SEARCH_KEYWORDS");
  data = data ? JSON.parse(data) : [];
  data = data.slice(0, length);
  setLocalStorage("RECENT_SEARCH_KEYWORDS", JSON.stringify(data));
};

// 최근 검색 키워드 삭제
export const removeStorageKeyword = () => {
  removeLocalStorage("RECENT_SEARCH_KEYWORDS");
};
