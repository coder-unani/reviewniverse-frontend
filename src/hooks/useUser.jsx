import { fetchUser } from "/src/api/users";
import { cLog, cError } from "/src/utils/test";

export const useUser = async ({ userId }) => {
  try {
    const res = await fetchUser({ userId });
    if (res.status === 200) {
      return {
        status: true,
        code: "",
        data: res.data.user,
      };
    } else if (res.status === 404) {
      if (res.message.detail === "USER_NOT_FOUND") {
        return {
          status: false,
          code: "탈퇴한 회원입니다.",
          data: null,
        };
      } else {
        return {
          status: false,
          code: "회원정보를 가져오는데 실패했습니다.",
          data: null,
        };
      }
    } else {
      return {
        status: false,
        code: "회원정보를 가져오는데 실패했습니다.",
        data: null,
      };
    }
  } catch (error) {
    return {
      status: false,
      code: "회원정보를 가져오는데 실패했습니다.",
      data: null,
    };
  }
};
