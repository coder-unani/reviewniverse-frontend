import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchSignUp, fetchSnsSignUp, fetchSignIn, fetchSnsSignIn } from "/src/api/users";
import { fetchToken } from "/src/api/token";
import { validateSnsUser } from "/src/utils/validation";
import { cLog, cError } from "/src/utils/test";

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  // 유저 초기화
  const [user, setUser] = useState(() => {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });
  const access_token = sessionStorage.getItem("access_token");
  const location = useLocation();

  useEffect(() => {
    if (!user || !access_token) return;

    // 토큰 검증
    const verifyToken = async () => {
      let isVerified = false;
      if (access_token) {
        isVerified = await fetchToken(access_token);
      }
      if (!isVerified) {
        handleRemoveUser();
      }
    };
    verifyToken();
  }, [location]);

  // 회원가입
  const signUp = async (user) => {
    // TODO: validation
    const result = validateSnsUser(user);
    if (!result.status) cLog(result.message);

    try {
      let response;
      if (user.code === "10") {
        response = await fetchSignUp(user);
      } else {
        response = await fetchSnsSignUp(user);
      }
      if (response.status !== 201) {
        throw new Error("로그인에 실패하였습니다.");
        z;
      }
      return true;
    } catch (error) {
      cError(error);
      throw new Error(error.message);
    }
  };

  // 로그인
  const signIn = async (user) => {
    // TODO: validation
    const result = validateSnsUser(user);
    if (!result.status) cLog(result.message);

    try {
      let get_user = null;
      let access_token = null;
      if (user.code === "10") {
        const response = await fetchSignIn(user);
        if (response.status === 200) {
          get_user = response.data.user;
          access_token = response.data.access_token;
        }
      } else {
        const response = await fetchSnsSignIn(user);
        if (response.status === 200) {
          get_user = response.data.user;
          access_token = response.data.access_token;
        } else if (response.status === 400 && response.message.detail === "USER_NOT_FOUND") {
          // TODO: 리턴값 확인
          return false;
        }
      }
      return handleSetUser(get_user, access_token);
    } catch (error) {
      cError(error);
      throw new Error("로그인에 실패하였습니다.");
    }
  };

  // 로그아웃
  const signOut = () => {
    return handleRemoveUser();
  };

  const handleSetUser = (user, access_token) => {
    try {
      sessionStorage.setItem("access_token", access_token);
      sessionStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return true;
    } catch (error) {
      cError(error);
      return false;
    }
  };

  const handleRemoveUser = () => {
    try {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("access_token");
      setUser(null);
      return true;
    } catch (error) {
      cError(error);
      return false;
    }
  };

  const values = {
    user,
    access_token,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};
