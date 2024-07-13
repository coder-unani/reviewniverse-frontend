import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMobileContext } from "/src/context/MobileContext";
import HttpClient from "/src/utils/HttpClient";
import { formatProvider } from "/src/utils/contentFormat";
import { isEmpty } from "lodash";
import JoinAgree from "/src/components/JoinAgree";
import BackButton from "/src/components/Button/Back";
import Logo from "/assets/logo.svg";
import "/src/styles/Join.css";
import { cLog, cError } from "/src/utils/test";

const API_BASE_URL = "https://comet.orbitcode.kr/v1";

/**
 * TODO:
 * 1. 약관동의 받기
 * 2. 선택한 약관 동의 값, 사용자 정보 전달
 * 3. 회원가입 성공 시 모달창 띄우기
 */

const JoinSns = () => {
  const { isMobile } = useMobileContext();
  const { provider } = useParams();

  // 약관 동의 상태
  const [isAgree, setIsAgree] = useState(false);
  // 선택한 약관 동의 값
  const [agreeValues, setAgreeValues] = useState({});

  useEffect(() => {
    // isAgree 값이 true 거나 agreeValues가 존재할 경우 회원가입 진행
    if (!isAgree || isEmpty(agreeValues) || !provider) return;

    // 회원가입 처리
    try {
      const user = JSON.parse(sessionStorage.getItem("sns_user"));
      const client = new HttpClient();
      client
        .post(`${API_BASE_URL}/users/sns/signup`, {
          code: formatProvider(provider),
          email: user.email,
          sns_id: user.uid,
          nickname: user.displayName,
          profile_image: user.photoURL,
          is_privacy_agree: agreeValues.privacy,
          is_terms_agree: agreeValues.terms,
          is_age_agree: agreeValues.age,
          is_marketing_agree: agreeValues.marketing,
        })
        .then((res) => {
          if (res.status === 201) {
            // && res.code === "USER_CREATE_SUCC"
            // 성공
            // TODO: 회원가입 성공 시 회원가입 성공 페이지로 이동
            cLog("회원가입을 축하합니다.");
            window.location.href = "/";
            return;
          } else {
            // 실패
            cLog("회원가입에 실패했습니다.");
            return;
          }
        });
    } catch (error) {
      cError(error);
    }
  }, [isAgree, agreeValues, provider]);

  return (
    <div className="join-wrapper">
      {isMobile && <BackButton />}
      <div className="join-header">
        <img src={Logo} className="logo" alt="logo" />
        <h2>SNS 간편 로그인</h2>
      </div>
      <JoinAgree setIsAgree={setIsAgree} setAgreeValues={setAgreeValues} />
    </div>
  );
};

export default JoinSns;
