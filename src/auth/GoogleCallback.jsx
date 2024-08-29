import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginLoading from "/src/components/LoginLoading";
import JoinAgree from "/src/components/JoinAgree";
import BackButton from "/src/components/Button/Back";
import { useAuthContext } from "/src/context/AuthContext";
import { useThemeContext } from "/src/context/ThemeContext";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "/src/auth/firebase";
import { fProviderCode } from "/src/utils/formatContent";
import { MESSAGES } from "/src/config/messages";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { showSuccessToast, showErrorToast } from "/src/components/Toast";
import { isEmpty } from "lodash";
import { EndpointManager, ENDPOINTS } from "/src/config/endpoints";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, join } = useAuthContext();
  const { isMobile } = useThemeContext();
  const [snsUser, setSnsUser] = useState(null);
  const [isAgree, setIsAgree] = useState(false);
  const [agreeValues, setAgreeValues] = useState({});

  useEffect(() => {
    // 로그인 상태일 경우, 회원 정보 페이지로 이동
    if (user) {
      showErrorToast(MESSAGES["L002"]);
      const pathUser = EndpointManager.generateUrl(ENDPOINTS.USER, { userId: user.id });
      return navigate(pathUser);
    }
    handleGoogleLogin();
  }, [location, user]);

  useEffect(() => {
    if (!snsUser || !isAgree || isEmpty(agreeValues)) return;
    handleSocialJoin(snsUser, agreeValues);
  }, [snsUser, isAgree, agreeValues]);

  const handleGoogleLogin = async () => {
    try {
      const googleRes = await signInWithPopup(auth, provider);
      const googleUser = googleRes.user;

      const loginUser = {
        code: fProviderCode("google"),
        email: googleUser.email,
        sns_id: googleUser.uid,
      };

      // 로그인 확인
      const res = await login(loginUser);
      if (res.status) {
        showSuccessToast(MESSAGES[res.code]);
        navigate(ENDPOINTS.HOME);
      } else {
        if (res.code === "L003") {
          setSnsUser({
            code: loginUser.code,
            email: googleUser.email,
            sns_id: googleUser.uid,
            nickname: googleUser.displayName,
            profile_image: googleUser.photoURL,
          });
        } else {
          // TODO: 이메일/닉네임 유효성 검사
          setSnsUser(null);
          navigate(ENDPOINTS.USER_LOGIN);
          showErrorToast(MESSAGES[res.code]);
        }
      }
    } catch (error) {
      setSnsUser(null);
      navigate(ENDPOINTS.USER_LOGIN);
      showErrorToast(MESSAGES["L002"]);
    }
  };

  const handleSocialJoin = async (snsUser, agreeValues) => {
    try {
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
          navigate(ENDPOINTS.USER_WATCHTYPE);
        } else {
          // 로그인 실패
          showErrorToast(MESSAGES[res.code]);
          navigate(ENDPOINTS.USER_LOGIN);
        }
      } else {
        // 회원가입 실패
        showErrorToast(MESSAGES[res.code]);
        navigate(ENDPOINTS.USER_LOGIN);
      }
    } catch {
    } finally {
      setSnsUser(null);
    }
  };

  const renderLoading = () => <LoginLoading />;

  const renderJoin = () => (
    <main className="join-main-container">
      {isMobile && <BackButton />}
      <div className="join-header">
        <img className="join-header-logo" src={DEFAULT_IMAGES.logoWhite} alt="logo" />
        <h2 className="join-header-title">SNS 간편 로그인</h2>
      </div>
      <JoinAgree setIsAgree={setIsAgree} setAgreeValues={setAgreeValues} />
    </main>
  );

  return snsUser ? renderJoin() : renderLoading();
};

export default GoogleCallback;
