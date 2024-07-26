import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "/src/auth/firebase";
import { cError } from "/src/utils/test";
import LoginLoading from "/src/components/LoginLoading";

const GoogleCallback = () => {
  const { setSnsUser, signIn } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleSignIn = async () => {
      try {
        const googleRes = await signInWithPopup(auth, provider);
        const googleUser = googleRes.user;

        const signInUser = {
          code: "11",
          email: googleUser.email,
          sns_id: googleUser.uid,
        };

        // 이미 가입되어 있는 유저라면 로그인 처리
        const res = await signIn(signInUser);
        if (res) {
          // window.location.href = "/";
        } else {
          // 가입되어 있지 않다면 유저 정보를 가지고 회원가입 페이지로 이동
          setSnsUser({
            code: "11",
            email: googleUser.email,
            sns_id: googleUser.uid,
            nickname: googleUser.displayName,
            profile_image: googleUser.photoURL,
          });
        }
      } catch (error) {
        cError("Google login failed");
        navigate("/user/login");
      }
    };

    handleGoogleSignIn();
  }, [location]);

  // TODO: 로그인 로딩 화면 구현
  return <LoginLoading />;
};

export default GoogleCallback;
