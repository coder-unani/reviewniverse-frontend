import React, { createContext, useContext, useEffect, useState } from "react";

const MobileContext = createContext();

const MobileContextProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    window.innerWidth < 768 ? setIsMobile(true) : setIsMobile(false);
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

  return <MobileContext.Provider value={{ isMobile, setIsMobile }}>{children}</MobileContext.Provider>;
};

const useMobileContext = () => {
  const context = useContext(MobileContext);
  if (!context) {
    throw new Error("useMobileContext must be used within an MobileContextProvider");
  }
  return context;
};

export { MobileContextProvider, useMobileContext };
