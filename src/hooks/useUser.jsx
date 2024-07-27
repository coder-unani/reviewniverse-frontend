import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { fetchUser } from "/src/api/users";

export const useUser = ({ userId }) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const res = await fetchUser({ userId });
      if (res.status === 200) {
        return res.data.user;
      } else if (res.status === 404) {
        if (res.message.detail === "USER_NOT_FOUND") {
          return null;
        } else {
          navigate("/error");
        }
      } else {
        navigate("/error");
      }
    },
  });
};
