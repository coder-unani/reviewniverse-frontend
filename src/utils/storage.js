const endpoints = {
  error: "/error",
};

// 로컬 스토리지 가져오기
export const getLocalStorage = (key) => {
  try {
    let data = localStorage.getItem(key);
    data = data ? JSON.parse(data) : [];
    data = [...data];
    return data;
  } catch (e) {
    window.location.href = endpoints.error;
  }
};

// 로컬 스토리지 체크
export const checkLocalStorage = (key, value) => {
  try {
    let data = localStorage.getItem(key);
    if (!data) return false;
    data = JSON.parse(data);
    data = new Set(data);
    return data.has(value);
  } catch (e) {
    window.location.href = endpoints.error;
  }
};

// 로컬 스토리지 저장
export const setLocalStorage = (key, value) => {
  try {
    let data = localStorage.getItem(key);
    data = data ? JSON.parse(data) : [];
    data = new Set(data);
    data.add(value);
    data = [...data];
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    window.location.href = endpoints.error;
  }
};

// 로컬 스토리지 최근순 저장
export const recentSetLoaclStorage = (key, value) => {
  try {
    let data = localStorage.getItem(key);
    data = data ? JSON.parse(data) : [];
    data = new Set(data);
    if (data.has(value)) data.delete(value);
    data = [value, ...data];
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    window.location.href = endpoints.error;
  }
};

// 로컬 스토리지 원하는 길이만큼 자르기
export const sliceLocalStorage = (key, length) => {
  try {
    let data = localStorage.getItem(key);
    data = data ? JSON.parse(data) : [];
    data = data.slice(0, length);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    window.location.href = endpoints.error;
  }
};

// 로컬 스토리지 삭제
export const removeLocalStorage = (key, value) => {
  try {
    let data = localStorage.getItem(key);
    if (data) {
      data = JSON.parse(data);
      data = data.filter((i) => i !== value);
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (e) {
    window.location.href = endpoints.error;
  }
};

// 로컬 스토리지 비우기
export const clearLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    window.location.href = endpoints.error;
  }
};

// 세션 스토리지 가져오기
export const getSessionStorage = (key) => {
  try {
    let data = sessionStorage.getItem(key);
    data = data ? JSON.parse(data) : {};
    data = { ...data };
    return data;
  } catch (e) {
    window.location.href = endpoints.error;
  }
};

// 세션 스토리지 저장
export const setSessionStorage = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
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
