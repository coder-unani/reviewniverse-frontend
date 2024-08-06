import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    window.innerWidth < 768 ? setIsMobile(true) : setIsMobile(false);

    // 헤더 스타일 변경
    const header = document.querySelector("header");
    // const logo = document.querySelector(".logo");

    const handleScroll = () => {
      if (window.scrollY > 100 && header.classList.contains("transparent")) {
        header.classList.remove("transparent");
        // logo.src = DEFAULT_IMAGES.logo;
      } else if (window.scrollY <= 100 && !header.classList.contains("transparent")) {
        header.classList.add("transparent");
        // logo.src = DEFAULT_IMAGES.logoWhite;
      }
    };

    window.addEventListener("scroll", handleScroll);
    header.classList.add("transparent");
    // logo.src = DEFAULT_IMAGES.logoWhite;

    return () => {
      window.removeEventListener("scroll", handleScroll);
      header.classList.remove("transparent");
      // logo.src = DEFAULT_IMAGES.logo;
    };
  }, []);

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
