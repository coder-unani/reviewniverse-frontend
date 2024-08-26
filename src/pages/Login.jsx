import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "/src/components/Button/Back";
import { useAuthContext } from "/src/context/AuthContext";
import { useThemeContext } from "/src/context/ThemeContext";
import { SETTINGS } from "/src/config/settings";
import { DEFAULT_IMAGES } from "/src/config/constants";

/**
 * TODO:
 * - 네이버 로그인 SDK 사용하지 않기
 * - 페이스북 로그인 연동
 * - Apple 로그인 연동
 */

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { isMobile } = useThemeContext();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${
      SETTINGS.KAKAO_API_KEY
    }&redirect_uri=${encodeURIComponent(SETTINGS.KAKAO_CALLBACK_URL)}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  const handleGoogleLogin = () => {
    navigate("/user/auth/google/callback");
  };

  const handleNaverLogin = () => {
    const { naver } = window;
    const naverLogin = new naver.LoginWithNaverId({
      clientId: SETTINGS.NAVER_CLIENT_ID,
      callbackUrl: SETTINGS.NAVER_CALLBACK_URL,
      isPopup: false,
      loginButton: { color: "white", type: 1, height: 60 },
    });

    naverLogin.init();

    const loginButton = document.getElementById("naverIdLogin").firstChild;
    if (loginButton) {
      loginButton.click();
    }

    // TODO: 네이버 로그인 SDK 사용하지 않고 구현하려고 했으나, CORS 문제로 인해 실패 및 보류
    /*
    // CSRF 방지를 위한 상태 코드
    const state = Math.random().toString(36).substr(2, 11);
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${
      SETTINGS.NAVER_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(SETTINGS.NAVER_CALLBACK_URL)}&state=${state}`;
    window.location.href = naverAuthUrl;
    */
  };

  return (
    <main className="login-main-container">
      {isMobile && <BackButton />}
      <div className="login-header">
        <img className="login-header-logo" src={DEFAULT_IMAGES.logoWhite} alt="logo" />
        <h2 className="login-header-title">소셜 로그인</h2>
      </div>
      <div className="login-content">
        <button type="button" className="login-button kakao" onClick={handleKakaoLogin}>
          <img className="login-button-image" src={DEFAULT_IMAGES.kakao} alt="kakao" />
          카카오로 시작하기
        </button>
        <div id="naverIdLogin" style={{ display: "none" }} />
        <button type="button" className="login-button naver" onClick={handleNaverLogin}>
          <img className="login-button-image" src={DEFAULT_IMAGES.naver} alt="naver" />
          네이버로 시작하기
        </button>
        <button type="button" className="login-button google" onClick={handleGoogleLogin}>
          <img className="login-button-image" src={DEFAULT_IMAGES.google} alt="google" />
          구글로 시작하기
        </button>
      </div>
    </main>
  );
};

export default Login;
