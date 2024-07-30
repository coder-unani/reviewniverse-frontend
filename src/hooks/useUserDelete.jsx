import { fetchUserDelete } from "/src/api/users";

export const useUserDelete = async ({ userId }) => {
  try {
    const res = await fetchUserDelete({ userId });
    if (res.status === 204) {
      return {
        status: true,
        code: "회원탈퇴가 완료되었습니다.",
      };
    } else {
      return {
        status: false,
        code: "회원탈퇴에 실패했습니다.",
      };
    }
  } catch (error) {
    return {
      status: false,
      code: "회원탈퇴에 실패했습니다.",
    };
  }
};
