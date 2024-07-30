import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginLoading from "/src/components/LoginLoading";
import { useAuthContext } from "/src/context/AuthContext";
import { formatProvider } from "/src/utils/formatContent";
import { SETTINGS } from "/src/config/settings";
import { MESSAGES } from "/src/config/messages";
import { showSuccessToast, showErrorToast } from "/src/components/Toast";

const NaverCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSnsUser, login } = useAuthContext();
  const { naver } = window;

  useEffect(() => {
    const handleNaverLogin = () => {
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
            if (res.status) {
              showSuccessToast(MESSAGES[res.code]);
              navigate("/");
            } else {
              if (res.code === "L003") {
                setSnsUser({
                  code: loginUser.code,
                  email: naverUser.email,
                  sns_id: naverUser.id,
                  nickname: naverUser.nickname,
                  profile_image: naverUser.profile_image,
                });
              } else {
                showErrorToast(MESSAGES[res.code]);
                navigate("/user/login");
              }
            }
          } else {
            showErrorToast(MESSAGES["L002"]);
            navigate("/user/login");
          }
        });
      } catch (error) {
        showErrorToast(MESSAGES["L002"]);
        navigate("/user/login");
      }
    };

    handleNaverLogin();
  }, [location]);

  // TODO: 로그인 로딩 화면 구현
  return <LoginLoading />;
};

export default NaverCallback;
