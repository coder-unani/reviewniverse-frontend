import React, { useState } from "react";
import { useThemeContext } from "/src/context/ThemeContext";
import JoinAgree from "/src/components/JoinAgree";
import JoinForm from "/src/components/JoinForm";
import BackButton from "/src/components/Button/Back";
import Logo from "/assets/logo.svg";
import "/src/styles/Join_v1.css";

/**
 * TODO:
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
 */

const Join = () => {
  const { isMobile } = useThemeContext();
  // 약관 동의 상태
  const [isAgree, setIsAgree] = useState(false);
  // 선택한 약관 동의 값
  const [agreeValues, setAgreeValues] = useState({});

  return (
    <div className="join-wrapper">
      {isMobile && <BackButton />}
      <div className="join-header">
        <img src={Logo} className="logo" alt="logo" />
        <h2>회원가입</h2>
      </div>
      {isAgree ? (
        <JoinForm agreeValues={agreeValues} />
      ) : (
        <JoinAgree setIsAgree={setIsAgree} setAgreeValues={setAgreeValues} />
      )}
    </div>
  );
};

export default Join;
