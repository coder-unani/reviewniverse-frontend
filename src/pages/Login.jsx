import React from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import HttpClient from "/src/utils/HttpClient";
import { formatUser } from "/src/utils/userFormat";
import { cLog } from "/src/utils/test";
import Logo from "/assets/logo.svg";
import KaKao from "/assets/kakao.png";
import Google from "/assets/google.png";
import "/src/styles/Login.css";

// TODO: authContext 사용하여 로그인 처리

const Login = () => {
  // 로그인 유효성 검사
  const LoginSchema = Yup.object().shape({
    email: Yup.string().required("이메일을 입력해주세요.").email("이메일 형식이 아닙니다."),
    password: Yup.string().required("비밀번호를 입력해주세요."),
  });

  const defaultValues = {
    email: "",
    password: "",
  };

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // 로그인 처리
      // TODO: URL 변수화 필요
      const client = new HttpClient();
      client
        .post("https://comet.orbitcode.kr/v1/users/login", {
          code: "10",
          email: data.email,
          password: data.password,
        })
        .then((res) => {
          // 실패
          if (res.status !== 200) {
            if (res.status === 400 || res.status === 401) {
              // TODO: 에러 메시지 출력
              cLog("로그인에 실패하였습니다.");
            }
            return;
          }

          // 성공
          const user = JSON.stringify(formatUser(res.data.user));
          if (user && res.data.access_token && res.data.refresh_token) {
            sessionStorage.setItem("user", user);
            sessionStorage.setItem("access_token", res.data.access_token);
            sessionStorage.setItem("refresh_token", res.data.refresh_token);

            // TODO: 이전 페이지로 이동
            window.location.href = "/";
          }
        });
    } catch (error) {
      cLog(error);
      reset();
    }
  });

  // TODO: 비밀번호 입력 후 엔터키 입력하면 로그인 처리 구현

  // TODO: 카카오 계정 연동 로그인 구현 (카카오디펠롭퍼스 API 연동)
  const handleKakaoLogin = () => {
    cLog("카카오 로그인");
  };

  // TODO: 구글 계정 연동 로그인 구현 (파이어베이스 API 연동)
  const handleGoogleLogin = () => {
    cLog("구글 로그인");
  };

  return (
    <div className="login-wrapper">
      <div className="login-header">
        <img src={Logo} className="logo" alt="logo" />
        <h2>로그인</h2>
      </div>
      <form method={methods} onSubmit={onSubmit} className="login-form">
        <div>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="이메일 주소를 입력해주세요."
            {...register("email", { required: true })}
          />
          {errors.email && <p className="error">이메일 주소를 입력해주세요.</p>}
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="비밀번호를 입력해주세요."
            {...register("password", {
              required: true,
            })}
          />
          {errors.password && <p className="error">비밀번호를 입력해주세요.</p>}
        </div>
        <button type="submit">로그인</button>
      </form>
      <div className="login-footer">
        <Link to="">비밀번호 찾기</Link>
        <Link to="">아이디 찾기</Link>
        <Link to="/user/join">회원가입</Link>
      </div>
      <div className="login-sns">
        <button type="button" className="kakao" onClick={handleKakaoLogin}>
          <img src={KaKao} alt="kakao" />
          카카오로 시작하기
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
