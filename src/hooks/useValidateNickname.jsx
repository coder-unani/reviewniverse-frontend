import { fetchValidateNickname } from "/src/api/users";

export const useValidateNickname = async ({ nickname }) => {
  try {
    const res = await fetchValidateNickname({ nickname });
    if (res.status === 200) {
      if (res.data) {
        return {
          status: res.data,
          code: "",
        };
      } else {
        return {
          status: res.data,
          code: "이미 사용중인 닉네임입니다.",
        };
      }
    } else {
      return {
        status: false,
        code: "닉네임 중복검사에 실패했습니다.",
      };
    }
  } catch (error) {
    return {
      status: false,
      code: "닉네임 중복검사에 실패했습니다.",
    };
  }
};
