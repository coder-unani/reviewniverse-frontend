import { set } from "lodash";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

/**
 * @todo
 * 1. 모두 동의하기 기능 추가
 * 1-1. onChange로 했을 경우, 체크 해제시 버튼이 disabled 되지 않음
 * 1-2. onClick으로 변경함
 * 2. 선택한 약관 동의 전달
 */

const JoinAgree = (props) => {
  const { setIsAgree, setAgreeValues } = props;
  const agrees = ["terms", "privacy", "age", "marketing"];

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();

  const onSubmit = handleSubmit(() => {
    setIsAgree(isValid);

    // 선택한 약관 동의 전달하기
    const agreeValues = {};
    agrees.forEach((agree) => {
      set(agreeValues, agree, true);
    });
    setAgreeValues(agreeValues);
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      agrees.forEach((agree) => {
        setValue(agree, true, { shouldValidate: true });
      });
    } else {
      agrees.forEach((agree) => {
        setValue(agree, false, { shouldValidate: false });
      });
    }
  };

  return (
    <div className="join-agree">
      <h3 className="title">약관 동의</h3>
      <form onSubmit={onSubmit} className="agree-form">
        <div className="all">
          <input
            type="checkbox"
            name="all"
            id="all"
            {...register("all")}
            onClick={handleSelectAll}
          />
          <label htmlFor="all">
            <span>모두 동의합니다.</span>
          </label>
        </div>
        <div>
          <input
            id="terms"
            type="checkbox"
            name="terms"
            {...register("terms", { required: true })}
          />
          <label htmlFor="terms">
            <span>[필수] 이용약관에 동의합니다.</span>
          </label>
        </div>
        <div>
          <input
            id="privacy"
            type="checkbox"
            name="privacy"
            {...register("privacy", { required: true })}
          />
          <label htmlFor="privacy">
            <span>[필수] 개인정보 수집 및 이용에 동의합니다.</span>
          </label>
        </div>
        <div>
          <input
            id="age"
            type="checkbox"
            name="age"
            {...register("age", { required: true })}
          />
          <label htmlFor="age">
            <span>[필수] 본인은 만 14세 이상입니다.</span>
          </label>
        </div>
        <div>
          <input
            id="marketing"
            type="checkbox"
            name="marketing"
            {...register("marketing")}
          />
          <label htmlFor="marketing">
            <span>
              [선택] 이벤트 및 기타 혜택 등에 대한 알림 수신에 동의합니다.
            </span>
          </label>
        </div>
        <button type="submit" disabled={!isValid}>
          다음
        </button>
      </form>
    </div>
  );
};

export default JoinAgree;
