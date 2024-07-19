import { USER_CODE } from "/src/config/codes";

/**
 * TODO:
 * - 회원가입 validation
 * - 로그인 validation
 */

export const validateSnsUser = (user) => {
  let result = {
    status: true,
    message: "",
  };

  if (!USER_CODE.hasOwnProperty(user.code)) {
    return (result = {
      status: false,
      message: "INVALID_USER_CODE",
    });
  }

  if (!isValidEmail(user.email)) {
    return (result = {
      status: false,
      message: "INVALID_USER_EMAIL",
    });
  }

  if (!user.sns_id) {
    return (result = {
      status: false,
      message: "INVALID_USER_SNS_ID",
    });
  }

  return result;
};

// 이메일 형식 검증 함수
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
