// 날짜 포맷: YYYY-MM-DD를 YYYY.MM.DD로 변경
export const formatDate = (date) => {
  return date.replace(/-/g, ".");
};

// 날짜 포맷: 어떤 날짜 형식이 들어와도 년도만 반환
export const formatYear = (date) => {
  return date.split("-")[0];
};
