import React, { useEffect } from "react";
import { useModalContext } from "/src/context/ModalContext";
import { useForm } from "react-hook-form";
import { set } from "lodash";

/**
 * TODO:
 * 1. 모두 동의하기 기능 추가
 * 1-1. onChange로 했을 경우, 체크 해제시 버튼이 disabled 되지 않음
 * 1-2. onClick으로 변경함
 * 1-3. 동의 항목 중 하나라도 체크 해제 시, 모두 동의하기 체크 해제
 * 2. 선택한 약관 동의 전달
 */

const JoinAgree = ({ setIsAgree, setAgreeValues }) => {
  const { toggleTermsModal, togglePrivacyCollectionModal } = useModalContext();
  const agrees = ["terms", "privacy", "age", "marketing"];

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isValid },
  } = useForm();

  const onSubmit = handleSubmit(() => {
    setIsAgree(isValid);

    // 선택한 약관 동의 전달하기
    const values = getValues();
    const agreeValues = {};
    agrees.forEach((agree) => {
      set(agreeValues, agree, values[agree]);
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

  const handleTermsClick = () => {
    toggleTermsModal();
  };

  const handlePrivacyClick = () => {
    togglePrivacyCollectionModal();
  };

  // 동의 항목 중 하나라도 체크 해제 시, 모두 동의하기 체크 해제
  const allAgrees = watch(agrees);

  useEffect(() => {
    const allChecked = allAgrees.every((agree) => agree === true);
    setValue("all", allChecked, { shouldValidate: false });
  }, [allAgrees, setValue]);

  return (
    <section className="join-agree-section">
      <h3 className="join-agree-title">약관 동의</h3>
      <form onSubmit={onSubmit} className="join-agree-form">
        <div className="join-agree-all">
          <input type="checkbox" name="all" id="all" {...register("all")} onClick={handleSelectAll} />
          <label htmlFor="all">모두 동의합니다.</label>
        </div>
        <div className="join-agree-terms">
          <div>
            <input id="terms" type="checkbox" name="terms" {...register("terms", { required: true })} />
            <label htmlFor="terms">[필수] 이용약관에 동의합니다.</label>
          </div>
          <button type="button" className="terms-button" onClick={handleTermsClick}>
            보기
          </button>
        </div>
        <div className="join-agree-privacy">
          <div>
            <input id="privacy" type="checkbox" name="privacy" {...register("privacy", { required: true })} />
            <label htmlFor="privacy">[필수] 개인정보 수집 및 이용에 동의합니다.</label>
          </div>
          <button type="button" className="privacy-button" onClick={handlePrivacyClick}>
            보기
          </button>
        </div>
        <div className="join-agree-age">
          <input id="age" type="checkbox" name="age" {...register("age", { required: true })} />
          <label htmlFor="age">[필수] 본인은 만 14세 이상입니다.</label>
        </div>
        <div className="join-agree-marketing">
          <input id="marketing" type="checkbox" name="marketing" {...register("marketing")} />
          <label htmlFor="marketing">[선택] 이벤트 및 기타 혜택 등에 대한 알림 수신에 동의합니다.</label>
        </div>
        <button type="submit" className="join-agree-button" disabled={!isValid}>
          {/* 다음 */}
          완료
        </button>
      </form>
    </section>
  );
};

export default JoinAgree;
