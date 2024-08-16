import React, { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import LoginLoading from "/src/components/LoginLoading";
import HttpClient from "/src/utils/HttpClient";
import { useAuthContext } from "/src/context/AuthContext";
import { fProviderCode } from "/src/utils/formatContent";
import { SETTINGS } from "/src/config/settings";
import { MESSAGES } from "/src/config/messages";
import { showSuccessToast, showErrorToast } from "/src/components/Toast";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { setSnsUser, login } = useAuthContext();

  useEffect(() => {
    const handleKakaoLogin = async () => {
      try {
        const code = searchParams.get("code");
        if (code) {
          const client = new HttpClient();
          client.unsetHeader("X-Device-Identifier");
          const tokenRes = await client.post(`https://kauth.kakao.com/oauth/token`, null, {
            grant_type: "authorization_code",
            client_id: SETTINGS.KAKAO_API_KEY,
            redirect_uri: SETTINGS.KAKAO_CALLBACK_URL,
            code: code,
          });
          const accessToken = tokenRes.data.access_token;

          client.setHeader({ Authorization: `Bearer ${accessToken}` });
          const userRes = await client.get(`https://kapi.kakao.com/v2/user/me`);
          const kakaoUser = userRes.data;

          const loginUser = {
            code: fProviderCode("kakao"),
            email: kakaoUser.kakao_account.email,
            sns_id: kakaoUser.id.toString(),
          };

          const res = await login(loginUser);
          if (res.status) {
            showSuccessToast(MESSAGES[res.code]);
            navigate("/");
          } else {
            if (res.code === "L003") {
              setSnsUser({
                code: loginUser.code,
                email: kakaoUser.kakao_account.email,
                sns_id: kakaoUser.id.toString(),
                nickname: kakaoUser.properties.nickname,
                profile_image: kakaoUser.properties.profile_image,
              });
            } else {
              // TODO: 이메일/닉네임 유효성 검사
              showErrorToast(MESSAGES[res.code]);
              navigate("/user/login");
            }
          }
        }
      } catch (error) {
        showErrorToast(MESSAGES["L002"]);
        navigate("/user/login");
      }
    };

    handleKakaoLogin();
  }, [searchParams, location]);

  // TODO: 로그인 로딩 화면 구현
  return <LoginLoading />;
};

export default KakaoCallback;
