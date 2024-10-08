import React from "react";
import { useForm } from "react-hook-form";
import { cLog, cError } from "/src/utils/test";

/**
 * TODO:
 * 1. 회원정보 수정하기 전 비밀번호 확인
 * 2. 비밀번호 확인 값 전달
 */

const PasswordCheckForm = ({ setIsPasswordConfirmed }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    cLog(data);
    // 비밀번호 확인 API 호출

    // 성공시
    setIsPasswordConfirmed(true);
  });

  return (
    <div className="check-form">
      <h3>비밀번호 확인</h3>
      <p>고객님의 소중한 정보 보호를 위해 비밀번호를 다시 한번 확인해주세요.</p>
      <form onSubmit={onSubmit}>
        <div className="input-wrapper">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="비밀번호를 입력해주세요."
            {...register("password", { required: true })}
          />
        </div>
        <button type="submit" disabled={!isValid}>
          확인
        </button>
      </form>
    </div>
  );
};

export default PasswordCheckForm;
