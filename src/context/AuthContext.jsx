import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getStorageUser,
  getStorageAccessToken,
  setStorageUser,
  setStorageAccessToken,
  removeStorageUser,
  removeStorageAccessToken,
} from "/src/utils/formatStorage";
import { fetchLogin, fetchJoin } from "/src/api/users";
import { fetchToken } from "/src/api/token";
import { validateUser } from "/src/utils/validation";
import { cLog, cError } from "/src/utils/test";

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  // 유저 초기화
  const [user, setUser] = useState(getStorageUser());
  const [snsUser, setSnsUser] = useState(null);
  const access_token = getStorageAccessToken();
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
  const join = async (user) => {
    try {
      const result = validateUser(user);
      if (!result.status) {
        return {
          status: false,
          code: result.code,
        };
      }

      const res = await fetchJoin(user);
      if (res.status === 201) {
        return {
          status: true,
          code: "J001",
        };
      } else if (res.status === 400) {
        if (res.message.detail === "EMAIL_ALREADY_EXIST") {
          return {
            status: false,
            code: "J004",
          };
        } else {
          return {
            status: false,
            code: "J002",
          };
        }
      } else if (res.status === 422) {
        return {
          status: false,
          code: "J003",
        };
      } else {
        return {
          status: false,
          code: "J002",
        };
      }
    } catch (error) {
      navigate("/error");
    }
  };

  // 로그인
  const login = async (user) => {
    try {
      let getUser = null;
      let accessToken = null;

      const result = validateUser(user);
      if (!result.status) {
        return {
          status: false,
          code: result.code,
        };
      }

      const res = await fetchLogin({ user });
      if (res.status === 200) {
        // 로그인 성공
        getUser = res.data.user;
        accessToken = res.data.access_token;
        if (handleSetUser(getUser, accessToken)) {
          return {
            status: true,
            code: "L001",
          };
        } else {
          return {
            status: false,
            code: "L002",
          };
        }
      } else if (res.status === 400) {
        // validation(입력값 검증)
        if (res.message.detail === "USER_NOT_FOUND") {
          return {
            status: false,
            code: "L003",
          };
        } else {
          return {
            status: false,
            code: "L002",
          };
        }
      } else if (res.status === 401) {
        // verify(인증 검증), 로그인 실패
        return {
          status: false,
          code: "L002",
        };
      } else {
        navigate("/error");
      }
    } catch (error) {
      navigate("/error");
    }
  };

  // 로그아웃
  const logout = () => {
    if (handleRemoveUser()) {
      return {
        status: true,
        code: "L004",
      };
    } else {
      return {
        status: false,
        code: "L005",
      };
    }
  };

  const handleSetUser = (user, accessToken) => {
    try {
      setStorageAccessToken(accessToken);
      setStorageUser(user);
      setUser(user);
      return true;
    } catch (error) {
      cError(error);
      return false;
    }
  };

  const handleRemoveUser = () => {
    try {
      removeStorageUser();
      removeStorageAccessToken();
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
    snsUser,
    setSnsUser,
    join,
    login,
    logout,
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
