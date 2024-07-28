import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import KakaoCallback from "/src/auth/KakaoCallback";
import NaverCallback from "/src/auth/NaverCallback";
import GoogleCallback from "/src/auth/GoogleCallback";
import JoinAgree from "/src/components/JoinAgree";
import BackButton from "/src/components/Button/Back";
import { useAuthContext } from "/src/context/AuthContext";
import { useThemeContext } from "/src/context/ThemeContext";
import { isValidProvider } from "/src/utils/validation";
import { isEmpty } from "lodash";
import { MESSAGES } from "/src/config/messages";
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
  const { provider } = useParams();
  const { user, snsUser, setSnsUser, join, login } = useAuthContext();
  const { isMobile } = useThemeContext();
  const [isAgree, setIsAgree] = useState(false);
  const [agreeValues, setAgreeValues] = useState({});

  const renderCallback = () => {
    switch (provider) {
      case "kakao":
        return <KakaoCallback />;
      case "naver":
        return <NaverCallback />;
      case "google":
        return <GoogleCallback />;
      default:
        return null;
    }
  };

  const handleSocialJoin = async (snsUser, agreeValues) => {
    const joinUser = {
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

    const res = await join(joinUser);
    if (res.status) {
      cLog(MESSAGES[res.code]);

      const loginUser = {
        code: joinUser.code,
        email: joinUser.email,
        sns_id: joinUser.sns_id,
      };

      const loginRes = await login(loginUser);
      cLog(MESSAGES[loginRes.code]);
      if (!loginRes.status) {
        navigate("/user/login");
      }
    } else {
      cLog(MESSAGES[res.code]);
    }
  };

  useEffect(() => {
    if (!provider || !isValidProvider(provider)) {
      navigate("/404-not-found");
    }
    if (user) {
      setSnsUser(null);
      navigate("/");
    }
  }, [provider, user, setSnsUser, navigate]);

  useEffect(() => {
    if (!snsUser || !isAgree || isEmpty(agreeValues)) return;
    handleSocialJoin(snsUser, agreeValues);
  }, [snsUser, isAgree, agreeValues]);

  return (
    <>
      {snsUser ? (
        <div className="join-wrapper">
          {isMobile && <BackButton />}
          <div className="join-header">
            <img src={Logo} className="logo" alt="logo" />
            <h2>SNS 간편 로그인</h2>
          </div>
          <JoinAgree setIsAgree={setIsAgree} setAgreeValues={setAgreeValues} />
        </div>
      ) : (
        renderCallback()
      )}
    </>
  );
};

export default SocialJoin;
