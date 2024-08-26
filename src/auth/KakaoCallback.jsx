import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import LoginLoading from "/src/components/LoginLoading";
import HttpClient from "/src/utils/HttpClient";
import JoinAgree from "/src/components/JoinAgree";
import BackButton from "/src/components/Button/Back";
import { useAuthContext } from "/src/context/AuthContext";
import { useThemeContext } from "/src/context/ThemeContext";
import { fProviderCode } from "/src/utils/formatContent";
import { SETTINGS } from "/src/config/settings";
import { MESSAGES } from "/src/config/messages";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { showSuccessToast, showErrorToast } from "/src/components/Toast";
import { isEmpty } from "lodash";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, login, join } = useAuthContext();
  const { isMobile } = useThemeContext();
  const [snsUser, setSnsUser] = useState(null);
  const [isAgree, setIsAgree] = useState(false);
  const [agreeValues, setAgreeValues] = useState({});

  useEffect(() => {
    if (user) {
      showErrorToast(MESSAGES["L002"]);
      return navigate(`/user/${user.id}`);
    }
    handleKakaoLogin();
  }, [searchParams, location, user]);

  useEffect(() => {
    if (!snsUser || !isAgree || isEmpty(agreeValues)) return;
    handleSocialJoin(snsUser, agreeValues);
  }, [snsUser, isAgree, agreeValues]);

  const handleKakaoLogin = async () => {
    try {
      const code = searchParams.get("code");
      if (code) {
        const client = new HttpClient();
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

        // 가입여부 확인 (로그인)
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
            setSnsUser(null);
            navigate("/user/login");
            showErrorToast(MESSAGES[res.code]);
          }
        }
      }
    } catch (error) {
      setSnsUser(null);
      navigate("/user/login");
      showErrorToast(MESSAGES["L002"]);
    }
  };

  const handleSocialJoin = async (snsUser, agreeValues) => {
    try {
      const joinUser = {
        code: snsUser.code,
        email: snsUser.email,
        sns_id: snsUser.sns_id,
        nickname: snsUser.nickname,
        profile_image: snsUser.profile_image,
        is_privacy_agree: agreeValues.privacy,
        is_terms_agree: agreeValues.terms,
        is_age_agree: agreeValues.age,
        is_marketing_agree: agreeValues.marketing,
      };

      const res = await join(joinUser);
      if (res.status) {
        showSuccessToast(MESSAGES[res.code]);

        const loginUser = {
          code: joinUser.code,
          email: joinUser.email,
          sns_id: joinUser.sns_id,
        };

        const loginRes = await login(loginUser);
        if (loginRes.status) {
          // 회원 취향 등록 페이지로 이동
          navigate("/user/watchtype");
        } else {
          // 로그인 실패
          showErrorToast(MESSAGES[res.code]);
          navigate("/user/login");
        }
      } else {
        // 회원가입 실패
        showErrorToast(MESSAGES[res.code]);
        navigate("/user/login");
      }
    } catch {
    } finally {
      setSnsUser(null);
    }
  };

  const renderLoading = () => <LoginLoading />;

  const renderJoin = () => (
    <main className="join-main-container">
      {isMobile && <BackButton />}
      <div className="join-header">
        <img className="join-header-logo" src={DEFAULT_IMAGES.logoWhite} alt="logo" />
        <h2 className="join-header-title">SNS 간편 로그인</h2>
      </div>
      <JoinAgree setIsAgree={setIsAgree} setAgreeValues={setAgreeValues} />
    </main>
  );

  return snsUser ? renderJoin() : renderLoading();
};

export default KakaoCallback;
