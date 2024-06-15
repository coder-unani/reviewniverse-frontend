import React, { useEffect } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import HttpClient from "/src/utils/HttpClient";

const JoinForm = (props) => {
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
    watch,
    formState: { errors, isDirty, isValid },
    reset,
    trigger,
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

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "nickname") {
        trigger("nickname").then((isValid) => {
          if (isValid) {
            try {
              // 닉네임 중복 체크
              const client = new HttpClient();
              client
                .get(`https://comet.orbitcode.kr/v1/finds/users/nickname`, {
                  nickname: value.nickname,
                })
                .then((res) => {
                  console.log(res);
                  // 실패
                  if (res.status !== 200) {
                    console.log(res.message.detail);
                    return;
                  }
                  // 성공
                  console.log(res.data.message);
                });
            } catch (error) {
              console.error(error);
              reset();
            }
          }
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, trigger]);
  return (
    <form method={methods} onSubmit={onSubmit} className="join-form">
      <div>
        <label htmlFor="nickname">닉네임</label>
        <input
          id="nickname"
          type="text"
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
      <button type="submit" disabled={!isDirty || !isValid}>
        가입하기
      </button>
    </form>
  );
};

export default JoinForm;
