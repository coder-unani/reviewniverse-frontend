import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserUpdate } from "/src/api/users";
import { cLog, cError } from "/src/utils/test";

export const useUserUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => await fetchUserUpdate(variables),
    onSuccess: (data, variables) => {
      cLog("프로필이 수정되었습니다.");
      console.log(data);
      // sessionStorage.setItem("user", JSON.stringify(data.user));
    },
    onError: (error) => {
      cError(error);
    },
  });
};
