import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { setSessionStorage } from "/src/utils/storage";
import { cError } from "/src/utils/test";

const NaverCallback = () => {
  const { signIn } = useAuthContext();
  const navigate = useNavigate();
  const { naver } = window;

  useEffect(() => {
    const naverLogin = new naver.LoginWithNaverId({
      clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
      callbackUrl: import.meta.env.VITE_NAVER_CALLBACK_URL,
      isPopup: false,
    });

    naverLogin.init();

    naverLogin.getLoginStatus(async (status) => {
      if (status) {
        const naverUser = naverLogin.user;

        const snsUser = {
          code: "15",
          email: naverUser.email,
          sns_id: naverUser.id,
        };

        const res = await signIn(snsUser);
        if (res) {
          window.location.href = "/";
        } else {
          const setUser = {
            ...snsUser,
            nickname: naverUser.nickname,
            profile_image: naverUser.profile_image,
          };

          setSessionStorage("sns_user", setUser);
          navigate("/user/auth/naver/callback");
        }
      } else {
        cError("Naver login failed");
      }
    });
  }, [navigate]);

  return <div>Loading...</div>;
};

export default NaverCallback;
