import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  setCookie,
  getCookie,
  removeCookie,
} from "/src/utils/storage";

// 유저 정보 설정
export const setStorageUser = (user) => {
  setCookie("user", JSON.stringify(user), { path: "/" });
};

// 유저 정보 가져오기
export const getStorageUser = () => {
  const getUser = getCookie("user");
  return getUser ? JSON.parse(getUser) : null;
};

// 유저 정보 삭제
export const removeStorageUser = () => {
  removeCookie("user", { path: "/" });
};

// 액세스 토큰 설정
export const setStorageAccessToken = (access_token) => {
  setCookie("access_token", access_token, { path: "/" });
};

// 액세스 토큰 가져오기
export const getStorageAccessToken = () => {
  return getCookie("access_token");
};

// 액세스 토큰 삭제
export const removeStorageAccessToken = () => {
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
