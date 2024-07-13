import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMobileContext } from "/src/context/MobileContext";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import BackButton from "/src/components/Button/Back";
import HttpClient from "/src/utils/HttpClient";
import Logo from "/assets/logo.svg";
import "/src/styles/ResetPassword.css";
import { cLog, cError } from "/src/utils/test";

const API_BASE_URL = "https://comet.orbitcode.kr/v1";

const ResetPassword = () => {
  const { isMobile } = useMobileContext();

  // 비밀번호 유효성 검사
  const ResetSchema = Yup.object().shape({
    password: Yup.string()
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,22}[^\s]*$/,
        "비밀번호는 8~22자의 영문 대/소문자, 숫자, 특수문자를 모두 포함하여 입력해주세요."
      )
      .required("비밀번호를 입력해주세요."),
  });

  const defaultValues = {
    password: "",
  };

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(ResetSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = methods;

  // TODO: 비밀번호 변경
  const onSubmit = handleSubmit(async (data) => {
    try {
      // 성공 시 홈 화면으로 이동
      // navigate("/");
    } catch (error) {
      cError(error);
      reset();
    }
  });

  return (
    <div className="reset-wrapper">
      {isMobile && <BackButton />}
      <div className="reset-header">
        <img src={Logo} className="logo" alt="logo" />
        <h2>비밀번호 변경</h2>
      </div>
      <form method={methods} onSubmit={onSubmit} className="reset-form">
        <h3>새 비밀번호 입력</h3>
        <p>회원님의 비밀번호를 다시 설정해주세요.</p>
        <div className="input-wrapper">
          <label htmlFor="password">새 비밀번호</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="비밀번호를 입력해주세요."
            {...register("password", { required: true })}
          />
          {errors.password && <p className="error">{errors.password?.message}</p>}
        </div>
        <button type="submit" disabled={!isValid}>
          확인
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
