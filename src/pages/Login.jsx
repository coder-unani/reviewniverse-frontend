import React from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Logo from "/src/assets/logo.svg";
import "/src/styles/Login.css";

/**
 * @todo
 * - 이메일, 비밀번호 유효성 검사
 * - 로그인 API 연동
 * - 로그인 성공 시 메인 페이지로 이동
 * - 로그인 실패 시 에러 메시지 출력
 * - 비밀번호 찾기, 회원가입 페이지로 이동
 * - input focus, blur 시 스타일 변경
 * - input validation error 시 스타일 변경
 * - input validation error 메시지 출력
 * - input validation error 시 버튼 비활성화
 * - input validation error 시 input focus
 * - input clear 버튼 추가
 */

const Login = () => {
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("이메일을 입력해주세요.")
      .email("이메일 형식이 아닙니다."),
    password: Yup.string().required("비밀번호를 입력해주세요."),
  });

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await login?.(data.email, data.password);r
      console.log(data);
    } catch (error) {
      console.log(error);
      reset();
    }
  });

  const handleKakaoLogin = () => {
    console.log("카카오 로그인");
  };

  const handleGoogleLogin = () => {
    console.log("구글 로그인");
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
            type="email"
            name="email"
            placeholder="이메일 주소를 입력해주세요."
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            name="password"
            placeholder="8자 이상 입력해주세요. (문자/숫자/기호 사용 가능)"
          />
        </div>
        <button type="submit">로그인</button>
      </form>
      {/* <div className="login-footer">
        <a href="/forgot-password">비밀번호 찾기</a>
        <a href="/signup">회원가입</a>
      </div> */}
      <div className="login-sns">
        <button type="button" className="kakao" onClick={handleKakaoLogin}>
          <img src="/src/assets/kakao.png" alt="kakao" />
          카카오로 시작하기
        </button>
        <button type="button" className="google" onClick={handleGoogleLogin}>
          <img src="/src/assets/google.png" alt="google" />
          구글로 시작하기
        </button>
      </div>
    </div>
  );
};

export default Login;
