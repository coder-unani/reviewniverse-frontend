import { fetchWatchType } from "/src/api/users";

export const useWatchTypeCreate = async ({ userId, watchType }) => {
  try {
    const res = await fetchWatchType({ userId, watchType });
    if (res.status === 201) {
      return {
        status: true,
        code: "회원성향이 등록되었습니다.",
      };
    } else {
      return {
        status: false,
        code: "회원성향을 등록하는데 실패했습니다.",
      };
    }
  } catch (error) {
    return {
      status: false,
      code: "회원성향을 등록하는데 실패했습니다.",
    };
  }
};
