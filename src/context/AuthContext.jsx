import React, { createContext, useContext, useEffect, useState } from "react";
import HttpClient from "/src/utils/HttpClient";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  useEffect(() => {
    // 토큰 검증
    const access_token = sessionStorage.getItem("access_token");
    const client = new HttpClient(access_token);
    client.get("https://comet.orbitcode.kr/v1/token").then((res) => {
      if (res.status === 200) {
        // 토큰이 유효하면 pass
        console.log("Token is valid.");
      } else {
        // 토큰이 유효하지 않으면 user, access_token 지우고 login 페이지로 이동
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("access_token");
        setUser(null);
        window.location.href = "/user/login";
      }
    });
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

// TODO: logout 구현
const handleLogout = () => {
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("access_token");
  setUser(null);
  window.location.href = "/";
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};

export { AuthContextProvider, useAuthContext };
