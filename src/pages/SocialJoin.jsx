import React, { useEffect, useState } from "react";
import NaverCallback from "/src/auth/NaverCallback";
import JoinAgree from "/src/components/JoinAgree";
import BackButton from "/src/components/Button/Back";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useThemeContext } from "/src/context/ThemeContext";
import { getSessionStorage, removeSessionStorage } from "/src/utils/storage";
import { isEmpty } from "lodash";
import Logo from "/assets/logo.svg";
import "/src/styles/Join.css";
import { cLog, cError } from "/src/utils/test";

/**
 * TODO:
 * - 성향 등록 추가
 * - 회원가입 성공 시 모달창 띄우기
 */

const SocialJoin = () => {
  const navigate = useNavigate();
  const { user, signUp, signIn } = useAuthContext();
  const snsUser = getSessionStorage("sns_user") ? JSON.parse(getSessionStorage("sns_user")) : null;
  const { isMobile } = useThemeContext();
  const { provider } = useParams();
  // 약관 동의 상태
  const [isAgree, setIsAgree] = useState(false);
  // 선택한 약관 동의 값
  const [agreeValues, setAgreeValues] = useState({});

  const handleSocialJoin = async (user) => {
    const res = await signUp(user);
    if (res) {
      cLog("회원가입에 성공했습니다.");

      removeSessionStorage("sns_user");

      const signInUser = {
        code: user.code,
        email: user.email,
        sns_id: user.sns_id,
      };

      const signInRes = await signIn(signInUser);
      if (signInRes) {
        window.location.href = "/";
      }
    } else {
      cLog("회원가입에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  useEffect(() => {
    if (user || isEmpty(provider) || isEmpty(snsUser) || !isAgree || isEmpty(agreeValues)) return;

    const signUpUser = {
      code: snsUser.code,
      email: snsUser.email,
      sns_id: snsUser.sns_id,
      nickname: snsUser.nickname,
      profile_image: snsUser.profile_image,
      is_privacy_agree: agreeValues.privacy,
      is_terms_agree: agreeValues.terms,
      is_age_agree: agreeValues.age,
      is_marketing_agree: agreeValues.marketing,
    };

    handleSocialJoin(signUpUser);
  }, [user, snsUser, provider, isAgree, agreeValues]);

  if (provider === "naver" && isEmpty(snsUser)) {
    return <NaverCallback />;
  }

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

export default SocialJoin;
