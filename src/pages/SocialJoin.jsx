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
import { DEFAULT_IMAGES } from "/src/config/constants";
import { showSuccessToast, showErrorToast } from "/src/components/Toast";

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
      showSuccessToast(MESSAGES[res.code]);

      const loginUser = {
        code: joinUser.code,
        email: joinUser.email,
        sns_id: joinUser.sns_id,
      };

      const loginRes = await login(loginUser);
      if (loginRes.status) {
        // 회원 취향 등록 페이지로 이동
        navigate("/user/watchtype");
      } else {
        // 로그인 실패
        showErrorToast(MESSAGES[res.code]);
        navigate("/user/login");
      }
    } else {
      // 회원가입 실패
      showErrorToast(MESSAGES[res.code]);
      navigate("/user/login");
    }
  };

  useEffect(() => {
    if (!provider || !isValidProvider(provider)) {
      navigate("/404-not-found");
    }
    if (user) {
      setSnsUser(null);
    }
  }, [provider, user, setSnsUser]);

  useEffect(() => {
    if (!snsUser || !isAgree || isEmpty(agreeValues)) return;
    handleSocialJoin(snsUser, agreeValues);
  }, [snsUser, isAgree, agreeValues]);

  return (
    <>
      {snsUser ? (
        <main className="join-main-container">
          {isMobile && <BackButton />}
          <div className="join-header">
            <img className="join-header-logo" src={DEFAULT_IMAGES.logoWhite} alt="logo" />
            <h2 className="join-header-title">SNS 간편 로그인</h2>
          </div>
          <JoinAgree setIsAgree={setIsAgree} setAgreeValues={setAgreeValues} />
        </main>
      ) : (
        renderCallback()
      )}
    </>
  );
};

export default SocialJoin;
