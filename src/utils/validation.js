import { USER_CODE } from "/src/config/codes";
import { formatFileSize } from "/src/utils/format";

export const validateUser = (user) => {
  if (!USER_CODE.hasOwnProperty(user.code)) {
    return {
      status: false,
      code: "U002",
    };
  }

  if (!isValidEmail(user.email)) {
    return {
      status: false,
      code: "U003",
    };
  }

  if (user.code === "10") {
    if (!user.password) {
      return {
        status: false,
        code: "U004",
      };
    }
  } else {
    if (!user.sns_id) {
      return {
        status: false,
        code: "U005",
      };
    }
  }

  return {
    status: true,
    code: "U001",
  };
};

// provider value 유효성 검증 함수
export const isValidProvider = (provider) => {
  return Object.values(USER_CODE).includes(provider);
};

// 이메일 형식 검증 함수
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 파일 사이즈 유효성 검증 함수
export const isValidFileSize = (file, maxSize) => {
  const maxSizeBytes = formatFileSize(maxSize);
  return file.size <= maxSizeBytes;
};

// 파일 확장자 유효성 검증 함수
export const isValidFileType = (file, types) => {
  return types.includes(file.type);
};
