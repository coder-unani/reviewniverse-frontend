import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  setCookie,
  getCookie,
  removeCookie,
} from "/src/utils/storage";
import { isEmpty } from "lodash";

const STORAGE_KEYS = {
  USER: "user",
  ACCESS_TOKEN: "access_token",
  RECENT_SEARCH_KEYWORDS: "RECENT_SEARCH_KEYWORDS",
};

// 유저 정보 설정
export const setStorageUser = (user) => {
  if (isEmpty(user)) return;
  setCookie(STORAGE_KEYS.USER, JSON.stringify(user), { path: "/" });
};

// 유저 정보 조회
export const getStorageUser = () => {
  const getUser = getCookie(STORAGE_KEYS.USER);
  return getUser ? JSON.parse(getUser) : null;
};

// 유저 정보 삭제
export const removeStorageUser = () => {
  removeCookie(STORAGE_KEYS.USER, { path: "/" });
};

// 액세스 토큰 설정
export const setStorageAccessToken = (access_token) => {
  if (!access_token) return;
  setCookie(STORAGE_KEYS.ACCESS_TOKEN, access_token, { path: "/" });
};

// 액세스 토큰 조회
export const getStorageAccessToken = () => {
  return getCookie(STORAGE_KEYS.ACCESS_TOKEN);
};

// 액세스 토큰 삭제
export const removeStorageAccessToken = () => {
  removeCookie(STORAGE_KEYS.ACCESS_TOKEN, { path: "/" });
};

// 최근 검색어 설정
export const setStorageKeyword = (keyword) => {
  if (!keyword) return;
  let data = getLocalStorage(STORAGE_KEYS.RECENT_SEARCH_KEYWORDS);
  data = data ? JSON.parse(data) : [];
  data = new Set(data);
  if (data.has(keyword)) data.delete(keyword);
  data = [keyword, ...data];
  setLocalStorage(STORAGE_KEYS.RECENT_SEARCH_KEYWORDS, JSON.stringify(data));
};

// 최근 검색어 조회
export const getStorageKeyword = () => {
  let data = getLocalStorage(STORAGE_KEYS.RECENT_SEARCH_KEYWORDS);
  data = data ? JSON.parse(data) : [];
  data = [...data];
  return data;
};

// 최근 검색어 갯수 제한
export const sliceStorageKeyword = (length) => {
  let data = getLocalStorage(STORAGE_KEYS.RECENT_SEARCH_KEYWORDS);
  data = data ? JSON.parse(data) : [];
  data = data.slice(0, length);
  setLocalStorage(STORAGE_KEYS.RECENT_SEARCH_KEYWORDS, JSON.stringify(data));
};

// 최근 검색어 전체 삭제
export const clearStorageKeyword = () => {
  removeLocalStorage(STORAGE_KEYS.RECENT_SEARCH_KEYWORDS);
};

// 최근 검색어 개별 삭제
export const removeStorageKeyword = (keyword) => {
  let data = getLocalStorage(STORAGE_KEYS.RECENT_SEARCH_KEYWORDS);
  data = data ? JSON.parse(data) : [];
  data = data.filter((data) => data !== keyword);
  setLocalStorage(STORAGE_KEYS.RECENT_SEARCH_KEYWORDS, JSON.stringify(data));
  return data;
};
