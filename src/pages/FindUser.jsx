import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMobileContext } from "/src/context/MobileContext";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import BackButton from "/src/components/Button/Back";
import HttpClient from "/src/utils/HttpClient";
import Logo from "/assets/logo.svg";
import "/src/styles/FindUser.css";
import { cLog, cError } from "/src/utils/test";

const API_BASE_URL = "https://comet.orbitcode.kr/v1";

const FindUser = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const { isMobile } = useMobileContext();
  const titleType = type === "id" ? "아이디" : "비밀번호";
  const mailType = type === "id" ? "확인" : "비밀번호 변경";

  // 이메일 유효성 검사
  const FindSchema = Yup.object().shape({
    email: Yup.string().required("이메일을 입력해주세요.").email("이메일 형식이 아닙니다."),
  });

  const defaultValues = {
    email: "",
  };

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(FindSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = methods;

  // TODO: 이메일 보내기
  const onSubmit = handleSubmit(async (data) => {
    try {
      // 비밀번호 재설정 페이지 이동 (인증토큰값 포함)
      // navigate(`/user/reset/password?token=${token}`);
    } catch (error) {
      cError(error);
      reset();
    }
  });

  useEffect(() => {
    if (type !== "id" && type !== "password") {
      navigate("/user/404-not-found");
    }
  }, [type]);

  return (
    <div className="find-wrapper">
      {isMobile && <BackButton />}
      <div className="find-header">
        <img src={Logo} className="logo" alt="logo" />
        <h2>{titleType} 찾기</h2>
      </div>
      <form method={methods} onSubmit={onSubmit} className="find-form">
        <h3>{titleType}를 잊으셨나요?</h3>
        <p>가입했던 이메일을 적어주세요.</p>
        <p>입력하신 이메일 주소로 {mailType} 메일을 보내드립니다.</p>
        <div className="input-wrapper">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="이메일 주소를 입력해주세요."
            {...register("email", { required: true })}
          />
          {errors.email && <p className="error">{errors.email?.message}</p>}
        </div>
        <button type="submit" disabled={!isValid}>
          이메일 보내기
        </button>
      </form>
    </div>
  );
};

export default FindUser;
