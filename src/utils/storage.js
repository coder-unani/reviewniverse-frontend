import Cookies from "js-cookie";

// 로컬 환경에서 secure 옵션을 끄는 예제
const endpoints = {
  error: "/error",
};

// 로컬 스토리지 설정
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    window.location.href = endpoints.error;
  }
};

// 로컬 스토리지 가져오기
export const getLocalStorage = (key) => {
  try {
    let data = localStorage.getItem(key);
    return data;
  } catch (e) {
    window.location.href = endpoints.error;
  }
};

// 로컬 스토리지 삭제
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    window.location.href = endpoints.error;
  }
};

// 세션 스토리지 설정
export const setSessionStorage = (key, value) => {
  try {
    sessionStorage.setItem(key, value);
    return true;
  } catch (e) {
    window.location.href = endpoints.error;
  }
};

// 세션 스토리지 가져오기
export const getSessionStorage = (key) => {
  try {
    let data = sessionStorage.getItem(key);
    return data;
  } catch (e) {
    window.location.href = endpoints.error;
  }
};

// 세션 스토리지 삭제
export const removeSessionStorage = (key) => {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (e) {
    window.location.href = endpoints.error;
  }
};

// 쿠키 설정
export const setCookie = (name, value, options = {}) => {
  try {
    const cookieOptions = {
      secure: true,
      sameSite: "None",
      ...options,
    };
    Cookies.set(name, value, cookieOptions);
    return true;
  } catch (e) {
    window.location.href = endpoints.error;
  }
};

// 쿠키 가져오기
export const getCookie = (name) => {
  try {
    return Cookies.get(name);
  } catch (e) {
    window.location.href = endpoints.error;
  }
};

// 쿠키 삭제
export const removeCookie = (name, options = {}) => {
  try {
    const cookieOptions = {
      sameSite: "None",
      ...options,
    };
    Cookies.remove(name, cookieOptions);
    return true;
  } catch (e) {
    window.location.href = endpoints.error;
  }
};
