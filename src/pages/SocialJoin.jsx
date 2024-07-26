import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import KakaoCallback from "/src/auth/KakaoCallback";
import NaverCallback from "/src/auth/NaverCallback";
import GoogleCallback from "/src/auth/GoogleCallback";
import JoinAgree from "/src/components/JoinAgree";
import BackButton from "/src/components/Button/Back";
import { useAuthContext } from "/src/context/AuthContext";
import { useThemeContext } from "/src/context/ThemeContext";
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
  const { provider } = useParams();
  const { user, snsUser, setSnsUser, signUp, signIn } = useAuthContext();
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
        return navigate("/404-not-found");
    }
  };

  const handleSocialJoin = async (user) => {
    const res = await signUp(user);
    if (res) {
      cLog("회원가입에 성공했습니다.");

      const signInUser = {
        code: user.code,
        email: user.email,
        sns_id: user.sns_id,
      };

      signIn(signInUser);
    } else {
      cLog("회원가입에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (!provider) navigate("/404-not-found");
    if (user) {
      setSnsUser(null);
      navigate("/");
    }
  }, [provider, user, setSnsUser, navigate]);

  useEffect(() => {
    if (!snsUser || !isAgree || isEmpty(agreeValues)) return;

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
