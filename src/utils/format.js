import { isEmpty } from "lodash";

// 날짜 포맷: 어떤 날짜 형식이 들어와도 년도만 반환
export const formatYear = (date) => {
  // date null 일 경우
  if (!date) return "";
  return date.split("-")[0];
};

// 날짜 포맷: YYYY-MM-DD를 YYYY.MM.DD로 변경
export const formatDate = (date) => {
  return date.replace(/-/g, ".");
};

// 날짜 포맷: {}일 전, {}시간 전, {}분 전, 방금 전으로 변경, 하루 이상이면 날짜로 변경
export const diffDate = (date) => {
  const now = new Date();
  const target = new Date(date);
  const diff = now - target;
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);

  if (day >= 1) {
    const targetYear = target.getFullYear();
    const targetMonth = String(target.getMonth() + 1).padStart(2, "0");
    const targetDate = String(target.getDate()).padStart(2, "0");
    return `${targetYear}.${targetMonth}.${targetDate}`;
  } else if (hour > 0) {
    return `${hour}시간 전`;
  } else if (min > 0) {
    return `${min}분 전`;
  } else {
    return "방금 전";
  }
};

// 숫자 포맷: 1000단위 콤마 추가
export const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 문자 포맷: 대문자로 변경
export const formatUpperCase = (text) => {
  return text.toUpperCase();
};

// 문자 포맷: 주어진 자릿수만큼 문자열 자르기
export const formatSlice = (text, length) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};

// 클릭한 input의 입력값 삭제
export const clearInput = (e) => {
  e.target.value = "";
};

// 배열의 랜덤 요소 가져오기
export const arrayRandomValue = (array) => {
  if (isEmpty(array)) return false;
  const randomNum = Math.floor(Math.random() * array.length);
  return array[randomNum];
};
