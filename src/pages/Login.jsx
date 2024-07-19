import React, { useEffect } from "react";
import BackButton from "/src/components/Button/Back";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useThemeContext } from "/src/context/ThemeContext";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "/src/auth/firebase";
import { setSessionStorage } from "/src/utils/storage";
import Logo from "/assets/logo.svg";
import KaKao from "/assets/kakao.png";
import Naver from "/assets/naver.png";
import Google from "/assets/google.png";
import "/src/styles/Login.css";
import { cLog, cError } from "/src/utils/test";

// TODO: authContext 사용하여 로그인 처리

const Login = () => {
  const { user, signIn } = useAuthContext();
  const { isMobile } = useThemeContext();
  const navigate = useNavigate();

  // TODO: 카카오 계정 연동 로그인 구현 (카카오디펠롭퍼스 API 연동)
  const handleKakaoLogin = () => {
    cLog("카카오 로그인");
  };

  // 구글 계정 연동 로그인 구현
  const handleGoogleLogin = async () => {
    const googleRes = await signInWithPopup(auth, provider);
    const googleUser = googleRes.user;

    const snsUser = {
      code: "11",
      email: googleUser.email,
      sns_id: googleUser.uid,
    };

    const res = await signIn(snsUser);
    if (res) {
      window.location.href = "/";
    } else {
      // 가입되어 있지 않다면 유저 정보를 가지고 회원가입 페이지로 이동
      const setUser = {
        ...snsUser,
        nickname: googleUser.displayName,
        profile_image: googleUser.photoURL,
      };

      setSessionStorage("sns_user", setUser);
      navigate("/user/auth/google/callback");
    }
  };

  // 네이버 계정 연동 로그인 구현
  const handleNaverLogin = () => {
    const { naver } = window;
    const naverLogin = new naver.LoginWithNaverId({
      clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
      callbackUrl: import.meta.env.VITE_NAVER_CALLBACK_URL,
      isPopup: false, // 팝업 방식으로 로그인 페이지가 열리도록 설정
      loginButton: { color: "white", type: 1, height: 60 },
    });

    naverLogin.init();

    // 실제 로그인 페이지로 리디렉션하는 부분
    const loginButton = document.getElementById("naverIdLogin").firstChild;
    if (loginButton) {
      loginButton.click();
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <div className="login-wrapper">
      {isMobile && <BackButton />}
      <div className="login-header">
        <img src={Logo} className="logo" alt="logo" />
        <h2>로그인</h2>
      </div>
      <div className="login-sns">
        <button type="button" className="kakao" onClick={handleKakaoLogin}>
          <img src={KaKao} alt="kakao" />
          카카오로 시작하기
        </button>
        <div id="naverIdLogin" style={{ display: "none" }} />
        <button type="button" className="naver" onClick={handleNaverLogin}>
          <img src={Naver} alt="naver" />
          네이버로 시작하기
        </button>
        <button type="button" className="google" onClick={handleGoogleLogin}>
          <img src={Google} alt="google" />
          구글로 시작하기
        </button>
      </div>
    </div>
  );
};

export default Login;
