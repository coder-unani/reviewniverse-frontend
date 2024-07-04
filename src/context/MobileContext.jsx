import React, { createContext, useContext, useEffect, useState } from "react";

const MobileContext = createContext();

const MobileContextProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    window.innerWidth < 768 ? setMobileMenu(true) : setMobileMenu(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !isMobile) {
        setMobileMenu(true);
      } else if (window.innerWidth >= 768 && isMobile) {
        setMobileMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  return <MobileContext.Provider value={{ isMobile, setIsMobile }}>{children}</MobileContext.Provider>;
};

const useMobileContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};

export { MobileContextProvider, useMobileContext };
