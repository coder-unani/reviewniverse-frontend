import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import HttpClient from "/src/utils/HttpClient";
import Logo from "/src/assets/logo.svg";
import "/src/styles/Join.css";

/**
 * @TODO
 * 1. 닉네임 중복 체크 (뒤에 난수 붙이면 중복 체크가 필요 없을 것 같음)
 * 2. 이메일 중복 체크 (blur, keyup 이벤트)
 * 3. ? 이메일 인증 (인증번호 발송, 인증번호 입력)
 * 3. 랜덤 닉네임 생성 (버튼 클릭 시)
 * 4. 유효성 검사 추가
 * 4-1. 닉네임: 한글, 영문, 숫자만 입력 가능, 2~20자
 * 4-2. 이메일: 이메일 형식, 5~50자
 * 4-3. 비밀번호: 영문 대/소문자, 숫자, 특수문자를 모두 포함, 8~22자
 * 4-4. input focus, blur 시 스타일 변경
 * 4-5. input validation error 시 스타일 변경
 * 4-6. input validation error 메시지 출력
 * 4-7. input validation error 시 버튼 비활성화
 * 4-8. input validation error 시 input focus
 * 4-9. input clear 버튼 추가
 * 4-10. 유효성 검사 환경 변수화
 * 5. 유효성 검사 통과 못할시 버튼 비활성화
 * 6. 약관동의 추가 (체크박스)
 * 7. 회원가입 성공 시 모달창 띄우기
 * 8. 카카오 계정 연동 로그인 구현
 * 9. 구글 계정 연동 로그인 구현
 */

const Join = () => {
  // 회원가입 유효성 검사
  const JoinSchema = Yup.object().shape({
    nickname: Yup.string()
      .min(2, "닉네임은 최소 2글자 이상입니다.")
      .max(20, "닉네임은 최대 20글자입니다.")
      .matches(
        /^[a-zA-Z가-힣0-9]*$/,
        "닉네임은 한글, 영문, 숫자만 입력 가능합니다."
      )
      .required("닉네임을 입력해주세요."),
    email: Yup.string()
      .min(5, "이메일은 최소 5자리 이상입니다.")
      .max(50, "이메일은 최대 50자리입니다.")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "이메일 형식이 아닙니다."
      )
      .required("이메일을 입력해주세요.")
      .email("이메일 형식이 아닙니다."),
    password: Yup.string()
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,22}[^\s]*$/,
        "비밀번호는 8~22자의 영문 대/소문자, 숫자, 특수문자를 모두 포함하여 입력해주세요."
      )
      .required("비밀번호를 입력해주세요."),
  });

  const defaultValues = {
    nickname: "",
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(JoinSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
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
          // 실패
          if (res.status !== 201) {
            if (res.status == 400 || res.status == 401) {
              console.log(res.message.detail);
            }
            return;
          }

          // 성공
          console.log(res.data.message);
          // 회원가입 성공 시 회원가입 성공 페이지로 이동
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
          <p className="error">{errors.nickname?.message}</p>
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
          <p className="error">{errors.email?.message}</p>
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="비밀번호를 입력해주세요."
            {...register("password", { required: true })}
          />
          <p className="error">{errors.password?.message}</p>
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
