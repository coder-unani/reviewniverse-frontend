import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchToken,
  fetchSignUp,
  fetchSnsSignUp,
  fetchSignIn,
  fetchSnsSignIn,
} from "/src/api/users";
import { cLog, cError } from "/src/utils/test";
import { fetchSnsSignUp } from "../api/users";

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  // 유저 초기화
  const [user, setUser] = useState(() => {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    // 토큰 검증
    const verifyToken = async () => {
      let isVerified = false;
      const access_token = sessionStorage.getItem("access_token");
      if (access_token) {
        isVerified = await fetchToken(access_token);
      }
      if (!isVerified) {
        handleRemoveUser();
      }
    };
    verifyToken();
  }, [navigate]);

  // 회원가입
  const signUp = async (user) => {
    try {
      if (user.code === "10") {
        return await fetchSignUp(user);
      } else {
        return await fetchSnsSignUp(user);
      }
    } catch (error) {
      cError(error);
      throw new Error("회원가입에 실패하였습니다.");
    }
  };

  // 로그인
  const signIn = async (user) => {
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
    return false;
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
    return false;
  };

  const values = {
    user,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};

export { AuthContextProvider, useAuthContext };
