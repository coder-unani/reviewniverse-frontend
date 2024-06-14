import { set } from "lodash";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

/**
 * @TODO
 * 1. 모두 동의하기 기능 추가
 * 1-1. onChange로 했을 경우, 체크 해제시 버튼이 disabled 되지 않음
 * 1-2. onClick으로 변경함
 */

const JoinAgree = (props) => {
  const { setIsAgree } = props;
  const agrees = ["agree1", "agree2", "agree3", "agree4"];

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();

  const onSubmit = handleSubmit(() => {
    setIsAgree(isValid);
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
            id="agree1"
            type="checkbox"
            name="agree1"
            {...register("agree1", { required: true })}
          />
          <label htmlFor="agree1">
            <span>[필수] 이용약관에 동의합니다.</span>
          </label>
        </div>
        <div>
          <input
            id="agree2"
            type="checkbox"
            name="agree2"
            {...register("agree2", { required: true })}
          />
          <label htmlFor="agree2">
            <span>[필수] 개인정보 수집 및 이용에 동의합니다.</span>
          </label>
        </div>
        <div>
          <input
            id="agree3"
            type="checkbox"
            name="agree3"
            {...register("agree3", { required: true })}
          />
          <label htmlFor="agree3">
            <span>[필수] 본인은 만 14세 이상입니다.</span>
          </label>
        </div>
        <div>
          <input
            id="agree4"
            type="checkbox"
            name="agree4"
            {...register("agree4")}
          />
          <label htmlFor="agree4">
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
