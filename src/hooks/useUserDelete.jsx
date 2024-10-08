import { useMutation } from "@tanstack/react-query";
import { fetchUserDelete } from "/src/api/users";
import { cLog, cError } from "/src/utils/test";

export const useUserDelete = () => {
  return useMutation({
    mutationFn: async (variables) => await fetchUserDelete(variables),
    onSuccess: (res, variables) => {
      if (res.status === 204) {
        cLog("회원 탈퇴가 완료되었습니다.");
      } else {
        throw new Error("회원 탈퇴에 실패했습니다.");
      }
    },
    onError: (error) => {
      cError(error.message);
    },
  });
};
