import React, { useState } from "react";
import JoinAgree from "../components/JoinAgree";
import JoinForm from "/src/components/JoinForm";
import Logo from "/src/assets/logo.svg";
import "/src/styles/Join.css";

/**
 * @TODO
 * 1. 닉네임 중복 체크 (blur, keyup 이벤트)
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
 */

const Join = () => {
  const [isAgree, setIsAgree] = useState(false);

  return (
    <div className="join-wrapper">
      <div className="join-header">
        <img src={Logo} className="logo" alt="logo" />
        <h2>회원가입</h2>
      </div>
      {isAgree ? <JoinForm /> : <JoinAgree setIsAgree={setIsAgree} />}
    </div>
  );
};

export default Join;
