import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useThemeContext } from "/src/context/ThemeContext";
import { getAuth, signInWithPopup } from "firebase/auth";
import { auth, provider } from "/src/auth/firebase";
import BackButton from "/src/components/Button/Back";
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

  // TODO: 구글 계정 연동 로그인 구현 (파이어베이스 API 연동)
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
      sessionStorage.setItem("sns_user", JSON.stringify(googleUser));
      navigate("/user/auth/google");
    }
  };

  // TODO: 네이버 계정 연동 로그인 구현 (네이버 API 연동)
  const handleNaverLogin = () => {
    window.location.href = "https://comet.orbitcode.kr/v1/users/naver/login";
    // try {
    //   const client = new HttpClient();
    //   const res = client.get("http://0.0.0.0:8000/v1/users/naver/login");
    //   if (res.status === 200) {
    //     // 성공
    //     const user = JSON.stringify(formatUser(res.data.user));
    //     if (user && res.data.access_token && res.data.refresh_token) {
    //       sessionStorage.setItem("user", user);
    //       sessionStorage.setItem("access_token", res.data.access_token);
    //       sessionStorage.setItem("refresh_token", res.data.refresh_token);
    //       // TODO: 이전 페이지로 이동
    //       window.location.href = "/";
    //     }
    //   } else if (res.status !== 200) {
    //     // 실패
    //     if (res.status === 400 || res.status === 401) {
    //       // TODO: 에러 메시지 출력
    //       cLog("로그인에 실패하였습니다.");
    //     }
    //     return;
    //   }
    // } catch (error) {
    //   cError(error);
    // }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, []);

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
