import React, { useEffect } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import HttpClient from "/src/utils/HttpClient";
import { cLog, cError } from "/src/utils/test";

/**
 * TODO:
 * 1. 닉네임 중복 체크 (blur, keyup 이벤트)
 * 2. 이메일 중복 체크 (blur, keyup 이벤트)
 * 2-1. 중복체크 실패시 가입 버튼 비활성화
 * 3. ? 이메일 인증 (인증번호 발송, 인증번호 입력)
 * 3. 랜덤 닉네임 생성 (버튼 클릭 시)
 * 4. 유효성 검사 추가
 * 4-1. 닉네임: 한글, 영문, 숫자만 입력 가능, 2~20자
 * 4-2. 이메일: 이메일 형식, 5~50자
 * 4-3. 비밀번호: 영문 대/소문자, 숫자, 특수문자를 모두 포함, 8~22자
 * 4-4. 비밀번호 보기/숨기기 (아이콘 클릭 시)
 * 4-5. ? 비밀번호 확인 (비밀번호와 동일한지 확인)
 */

const JoinForm = (props) => {
  const { agreeValues } = props;

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
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors, isDirty, isValid },
    reset,
    trigger,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    // TODO: 유효성 검사 실패시 API 호출 중단
    try {
      // 회원가입 처리
      const client = new HttpClient();
      client
        .post("https://comet.orbitcode.kr/v1/users", {
          type: "10",
          nickname: data.nickname,
          email: data.email,
          password: data.password,
          is_privacy_agree: agreeValues.privacy,
          is_terms_agree: agreeValues.terms,
          is_age_agree: agreeValues.age,
          is_marketing_agree: agreeValues.marketing,
        })
        .then((res) => {
          if (res.status === 201 && res.code === "USER_CREATE_SUCC") {
            // 성공
            // TODO: 회원가입 성공 시 회원가입 성공 페이지로 이동
            cLog("회원가입을 축하합니다.");
            return;
          } else {
            // 실패
            cLog("회원가입에 실패했습니다.");
            return;
          }
        });
    } catch (error) {
      cError(error);
      reset();
    }
  });

  // TODO: URL 변수화 필요
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "nickname") {
        trigger("nickname").then((isValid) => {
          if (isValid) {
            // 닉네임 중복 체크
            // TODO: 한글 입력시 글자가 완성되면 두번 호출되는 이슈 해결 필요
            const client = new HttpClient();
            client
              .get(`https://comet.orbitcode.kr/v1/validation/users/nickname`, {
                nickname: value.nickname,
              })
              .then((res) => {
                if (res.status === 204 && res.code === "VALID_NICK_SUCC") {
                  // 성공
                  // TODO: 존재하지 않는 닉네임일 경우 input check 표시
                  clearErrors("nickname");
                } else {
                  // 실패
                  // 존재하는 닉네임일 경우 에러 메시지 출력
                  setError("nickname", {
                    type: "manual",
                    message: "이미 사용중인 닉네임입니다.",
                  });
                }
              })
              .catch((error) => {
                cError(error);
                reset();
              });
          }
        });
      } else if (name === "email") {
        trigger("email").then((isValid) => {
          if (isValid) {
            // 이메일 중복 체크
            const client = new HttpClient();
            client
              .get(`https://comet.orbitcode.kr/v1/validation/users/email`, {
                email: value.email,
              })
              .then((res) => {
                if (res.status === 204 && res.code === "VALID_EMAIL_SUCC") {
                  // 성공
                  // TODO: 존재하지 않는 이메일일 경우 input check 표시
                  clearErrors("email");
                } else {
                  // 존재하는 이메일일 경우 에러 메시지 출력
                  // TODO: 가입되어 있는 type 구분을 통해 sns로 가입되어 있는지, 이메일로 가입되어 있는지 구분하여 처리.
                  setError("email", {
                    type: "manual",
                    message: "이미 사용중인 이메일입니다.",
                  });
                }
              })
              .catch((error) => {
                cError(error);
                reset();
              });
          }
        });
      } else if (name === "password") {
        trigger("password");
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, trigger, setError, clearErrors]);

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
        {errors.nickname && <p className="error">{errors.nickname?.message}</p>}
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
        {errors.email && <p className="error">{errors.email?.message}</p>}
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
        {errors.password && <p className="error">{errors.password?.message}</p>}
      </div>
      <button
        type="submit"
        disabled={!isDirty || !isValid || errors.nickname || errors.email}
      >
        가입하기
      </button>
    </form>
  );
};

export default JoinForm;
