import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { formatProvider } from "/src/utils/formatContent";
import { SETTINGS } from "/src/config/settings";
import { MESSAGES } from "/src/config/messages";
import { cLog, cError } from "/src/utils/test";
import LoginLoading from "/src/components/LoginLoading";

const NaverCallback = () => {
  const { setSnsUser, login } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { naver } = window;

  useEffect(() => {
    try {
      const naverLogin = new naver.LoginWithNaverId({
        clientId: SETTINGS.NAVER_CLIENT_ID,
        callbackUrl: SETTINGS.NAVER_CALLBACK_URL,
        isPopup: false,
      });

      naverLogin.init();

      naverLogin.getLoginStatus(async (status) => {
        if (status) {
          const naverUser = naverLogin.user;

          const loginUser = {
            code: formatProvider("naver"),
            email: naverUser.email,
            sns_id: naverUser.id,
          };

          const res = await login(loginUser);
          if (!res.status) {
            if (res.code === "L003") {
              cLog(MESSAGES[res.code]);
              setSnsUser({
                code: loginUser.code,
                email: naverUser.email,
                sns_id: naverUser.id,
                nickname: naverUser.nickname,
                profile_image: naverUser.profile_image,
              });
            } else {
              cLog(MESSAGES[res.code]);
              navigate("/user/login");
            }
          }
        } else {
          cLog(MESSAGES["L002"]);
        }
      });
    } catch (error) {
      cLog(MESSAGES["L002"]);
      navigate("/user/login");
    }
  }, [location]);

  // TODO: 로그인 로딩 화면 구현
  return <LoginLoading />;
};

export default NaverCallback;
