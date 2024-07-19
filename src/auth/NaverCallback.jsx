import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { cError } from "/src/utils/test";
const { naver } = window;

const NaverCallback = () => {
  const { signIn } = useAuthContext();
  const navigate = useNavigate();

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
          // 가입되어 있지 않다면 유저 정보를 가지고 회원가입 페이지로 이동
          const setUser = {
            ...snsUser,
            nickname: naverUser.nickname,
            profile_image: naverUser.profile_image,
          };
          sessionStorage.setItem("sns_user", JSON.stringify(setUser));
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
