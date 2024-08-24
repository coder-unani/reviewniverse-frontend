import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [vh, setVh] = useState(0);

  useEffect(() => {
    // 모바일 여부 확인
    window.innerWidth < 768 ? setIsMobile(true) : setIsMobile(false);

    // 뷰포트 크기 확인
    // 초기 뷰포트 크기 설정
    const updateVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      setVh(vh);
    };

    updateVh();

    // 리사이즈 이벤트 등록
    const handleResize = () => {
      if (window.innerWidth < 768 && !isMobile) {
        setIsMobile(true);
      } else if (window.innerWidth >= 768 && isMobile) {
        setIsMobile(false);
      }

      // 뷰포트 크기 업데이트
      updateVh();
    };

    let resizeObserver;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        updateVh();
      });
      resizeObserver.observe(document.documentElement);
    } else {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [isMobile]);

  /*
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !isMobile) {
        setIsMobile(true);
      } else if (window.innerWidth >= 768 && isMobile) {
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);
  */

  return <ThemeContext.Provider value={{ isMobile, setIsMobile }}>{children}</ThemeContext.Provider>;
};

const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within an ThemeContextProvider");
  }
  return context;
};

export { ThemeContextProvider, useThemeContext };
