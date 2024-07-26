import React, { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import HttpClient from "/src/utils/HttpClient";
import { useAuthContext } from "/src/context/AuthContext";
import { settings } from "/src/config/settings";
import { cError } from "/src/utils/test";
import LoginLoading from "/src/components/LoginLoading";

const KakaoCallback = () => {
  const { setSnsUser, signIn } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleKakaoSignIn = async () => {
      try {
        const code = searchParams.get("code");
        if (code) {
          const client = new HttpClient();
          const tokenRes = await client.post(`https://kauth.kakao.com/oauth/token`, null, {
            grant_type: "authorization_code",
            client_id: settings.KAKAO_API_KEY,
            redirect_uri: settings.KAKAO_CALLBACK_URL,
            code: code,
          });

          const accessToken = tokenRes.data.access_token;
          client.setHeader({ Authorization: `Bearer ${accessToken}` });

          const userRes = await client.get(`https://kapi.kakao.com/v2/user/me`);
          const kakaoUser = userRes.data;

          const signInUser = {
            code: "14",
            email: kakaoUser.kakao_account.email,
            sns_id: kakaoUser.id.toString(),
          };

          const res = await signIn(signInUser);
          if (res) {
            // window.location.href = "/";
          } else {
            setSnsUser({
              code: "14",
              email: kakaoUser.kakao_account.email,
              sns_id: kakaoUser.id.toString(),
              nickname: kakaoUser.properties.nickname,
              profile_image: kakaoUser.properties.profile_image,
            });
          }
        }
      } catch (error) {
        cError("Kakao login failed");
        navigate("/user/login");
      }
    };

    handleKakaoSignIn();
  }, [searchParams, location]);

  // TODO: 로그인 로딩 화면 구현
  return <LoginLoading />;
};

export default KakaoCallback;
