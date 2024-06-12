import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import HttpClient from "/src/utils/HttpClient";
import Logo from "/src/assets/logo.svg";
import "/src/styles/Join.css";

const Join = () => {
  // 회원가입 유효성 검사
  const JoinSchema = Yup.object().shape({
    nickname: Yup.string().required("닉네임을 입력해주세요."),
    email: Yup.string()
      .required("이메일을 입력해주세요.")
      .email("이메일 형식이 아닙니다."),
    password: Yup.string().required("비밀번호를 입력해주세요."),
  });

  const defaultValues = {
    nickname: "",
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(JoinSchema),
    defaultValues,
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);

      // 회원가입 처리
      const client = new HttpClient();
      client
        .post("https://comet.orbitcode.kr/v1/users/create", {
          type: "10",
          email: data.email,
          password: data.password,
          nickname: data.nickname,
        })
        .then((res) => {
          console.log(res);
          // 실패
          if (res.status !== 200) {
            if (res.status == 400 || res.status == 401) {
              console.log("실패: ", res.message.detail);
            }
            return;
          }

          // 성공
          // const user = JSON.stringify(res.data.user);
          console.log("성공");
          // if (user && res.data.access_token && res.data.refresh_token) {
          //   sessionStorage.setItem("user", user);
          //   sessionStorage.setItem("access_token", res.data.access_token);
          //   sessionStorage.setItem("refresh_token", res.data.refresh_token);
          //   window.location.href = "/";
          // }
        });
    } catch (error) {
      console.error(error);
      reset();
    }
  });

  // 카카오 계정 연동 로그인 구현
  const handleKakaoLogin = () => {
    console.log("카카오 로그인");
  };

  // 구글 계정 연동 로그인 구현
  const handleGoogleLogin = () => {
    console.log("구글 로그인");
  };

  return (
    <div className="join-wrapper">
      <div className="join-header">
        <img src={Logo} className="logo" alt="logo" />
        <h2>회원가입</h2>
      </div>
      <form method={methods} onSubmit={onSubmit} className="join-form">
        <div>
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            type="nickname"
            name="nickname"
            placeholder="한글/영문 20자 이내로 입력해주세요."
            {...register("nickname", { required: true })}
          />
          {errors.nickname && <p>닉네임을 입력해주세요.</p>}
        </div>
        <div>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="이메일 주소를 입력해주세요."
            {...register("email", { required: true })}
          />
          {errors.email && <p>이메일 주소를 입력해주세요.</p>}
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="8자 이상 입력해주세요. (문자/숫자/기호 사용 가능)"
            {...register("password", { required: true })}
          />
          {errors.password && <p>비밀번호를 입력해주세요.</p>}
        </div>
        <button type="submit">가입하기</button>
      </form>
      <div className="join-sns">
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

export default Join;
