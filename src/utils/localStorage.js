// 로컬 스토리지 가져오기
export const getLocalStorage = (key) => {
  let data = localStorage.getItem(key);
  data = data ? JSON.parse(data) : [];
  data = [...data];
  return data;
};

// 로컬 스토리지 체크
export const checkLocalStorage = (key, value) => {
  let data = localStorage.getItem(key);
  if (!data) return false;
  data = JSON.parse(data);
  data = new Set(data);
  return data.has(value);
};

// 로컬 스토리지 저장
export const saveLocalStorage = (key, value) => {
  let data = localStorage.getItem(key);
  data = data ? JSON.parse(data) : [];
  data = new Set(data);
  data.add(value);
  data = [...data];
  localStorage.setItem(key, JSON.stringify(data));
};

// 로컬 스토리지 최근순 저장
export const recentSaveLoaclStorage = (key, value) => {
  let data = localStorage.getItem(key);
  data = data ? JSON.parse(data) : [];
  data = new Set(data);
  if (data.has(value)) data.delete(value);
  data = [value, ...data];
  localStorage.setItem(key, JSON.stringify(data));
};

// 로컬 스토리지 원하는 길이만큼 자르기
export const sliceLocalStorage = (key, length) => {
  let data = localStorage.getItem(key);
  data = data ? JSON.parse(data) : [];
  data = data.slice(0, length);
  localStorage.setItem(key, JSON.stringify(data));
};

// 로컬 스토리지 삭제
export const deleteLocalStorage = (key, value) => {
  let data = localStorage.getItem(key);
  if (data) {
    data = JSON.parse(data);
    data = data.filter((i) => i !== value);
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// 로컬 스토리지 비우기
export const clearLocalStorage = (key) => {
  localStorage.removeItem(key);
};
