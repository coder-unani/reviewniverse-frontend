import { fetchUserUpdate } from "/src/api/users";
import { cLog, cError } from "/src/utils/test";

export const useUserUpdate = async ({ userId, updateData }) => {
  try {
    const res = await fetchUserUpdate({ userId, updateData });
    if (res.status === 204) {
      return {
        status: true,
        code: "프로필이 수정되었습니다.",
      };
    } else {
      return {
        status: false,
        code: "프로필 수정에 실패했습니다.",
      };
    }
  } catch (error) {
    return {
      status: false,
      code: "프로필 수정에 실패했습니다.",
    };
  }
};
