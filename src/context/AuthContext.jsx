import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getStorageUser,
  getStorageAccessToken,
  setStorageUser,
  setStorageAccessToken,
  removeStorageUser,
  removeStorageAccessToken,
} from "/src/utils/formatStorage";
import { fetchJoin, fetchLogin } from "/src/api/users";
import { fetchToken } from "/src/api/token";
import { validateUser } from "/src/utils/validation";
import { MESSAGES } from "/src/config/messages";
import { cLog, cError } from "/src/utils/test";

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getStorageUser());
  const [snsUser, setSnsUser] = useState(null);

  useEffect(() => {
    const getUser = getStorageUser();
    const access_token = getStorageAccessToken();
    // TODO: 고도화필요
    if (!getUser || !access_token) {
      handleRemoveUser();
      return;
    }
    // 토큰검증
    const verifyToken = async () => {
      if (access_token) {
        const res = await fetchToken(access_token);
        if (res.status === 200) {
          if (handleSetUser({ accessToken: res.data.access_token })) {
            // cLog(MESSAGES.T001);
          } else {
            cLog(MESSAGES.T003);
          }
        } else {
          if (handleRemoveUser()) {
            cLog(MESSAGES.T002);
            navigate("/login");
          } else {
            cLog(MESSAGES.T004);
          }
        }
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
      const result = validateUser(user);
      if (!result.status) {
        return {
          status: false,
          code: result.code,
        };
      }

      const res = await fetchLogin({ user });
      if (res.status === 200) {
        if (handleSetUser({ accessToken: res.data.access_token, user: res.data.user })) {
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

  const handleSetUser = ({ accessToken = null, user = null }) => {
    try {
      if (accessToken) {
        setStorageAccessToken(accessToken);
      }
      if (user) {
        setStorageUser(user);
        setUser(user);
      }
      return true;
    } catch (error) {
      cError(error);
      return false;
    }
  };

  const handleRemoveUser = () => {
    try {
      removeStorageAccessToken();
      removeStorageUser();
      setUser(null);
      return true;
    } catch (error) {
      cError(error);
      return false;
    }
  };

  const values = {
    user,
    snsUser,
    setSnsUser,
    join,
    login,
    logout,
    handleSetUser,
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
