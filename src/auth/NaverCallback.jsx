import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { settings } from "/src/config/settings";
import { cError } from "/src/utils/test";
import LoginLoading from "/src/components/LoginLoading";

const NaverCallback = () => {
  const { setSnsUser, signIn } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { naver } = window;

  useEffect(() => {
    try {
      const naverLogin = new naver.LoginWithNaverId({
        clientId: settings.NAVER_CLIENT_ID,
        callbackUrl: settings.NAVER_CALLBACK_URL,
        isPopup: false,
      });

      naverLogin.init();

      naverLogin.getLoginStatus(async (status) => {
        if (status) {
          const naverUser = naverLogin.user;

          const signInUser = {
            code: "15",
            email: naverUser.email,
            sns_id: naverUser.id,
          };

          const res = await signIn(signInUser);
          if (res) {
            // window.location.href = "/";
          } else {
            setSnsUser({
              code: "15",
              email: naverUser.email,
              sns_id: naverUser.id,
              nickname: naverUser.nickname,
              profile_image: naverUser.profile_image,
            });
          }
        } else {
          cError("Naver login failed");
        }
      });
    } catch (error) {
      cError("Naver login failed");
      navigate("/user/login");
    }
  }, [location]);

  // TODO: 로그인 로딩 화면 구현
  return <LoginLoading />;
};

export default NaverCallback;
