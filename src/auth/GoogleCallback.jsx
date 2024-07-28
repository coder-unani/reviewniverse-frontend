import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginLoading from "/src/components/LoginLoading";
import { useAuthContext } from "/src/context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "/src/auth/firebase";
import { formatProvider } from "/src/utils/formatContent";
import { MESSAGES } from "/src/config/messages";
import { cLog, cError } from "/src/utils/test";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSnsUser, login } = useAuthContext();

  useEffect(() => {
    const handleGoogleLogin = async () => {
      try {
        const googleRes = await signInWithPopup(auth, provider);
        const googleUser = googleRes.user;

        const loginUser = {
          code: formatProvider("google"),
          email: googleUser.email,
          sns_id: googleUser.uid,
        };

        // 로그인 확인
        const res = await login(loginUser);
        if (!res.status) {
          if (res.code === "L003") {
            cLog(MESSAGES[res.code]);
            setSnsUser({
              code: loginUser.code,
              email: googleUser.email,
              sns_id: googleUser.uid,
              nickname: googleUser.displayName,
              profile_image: googleUser.photoURL,
            });
          } else {
            // TODO: 이메일/닉네임 유효성 검사
            cLog(MESSAGES[res.code]);
            navigate("/user/login");
          }
        }
      } catch (error) {
        cLog(MESSAGES["L002"]);
        navigate("/user/login");
      }
    };

    handleGoogleLogin();
  }, [location]);

  // TODO: 로그인 로딩 화면 구현
  return <LoginLoading />;
};

export default GoogleCallback;
