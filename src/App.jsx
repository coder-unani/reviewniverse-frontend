import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeContextProvider } from "/src/context/ThemeContext";
import { RouterProvider } from "react-router-dom";
import router from "/src/routes";
import { ToastWrapper } from "/src/components/Toast";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { SETTINGS } from "/src/config/settings";

/**
 * TODO:
 * 4-4. 로그인 n회 이상 실패 시 사람인지 확인
 */

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeContextProvider>
          <Helmet>
            <title>리뷰니버스</title>
            <meta name="description" content="리뷰니버스와 함께라면 보는 즐거움이 2배로, 생생한 리뷰를 확인해보세요!" />
            <meta property="og:title" content="리뷰니버스" />
            <meta
              property="og:description"
              content="리뷰니버스와 함께라면 보는 즐거움이 2배로, 생생한 리뷰를 확인해보세요!"
            />
            <meta property="og:image" content={DEFAULT_IMAGES.logo} />
            <meta property="og:url" content={SETTINGS.DOMAIN_URL} />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content="ko_KR" />
            <meta property="og:site_name" content="Reviewniverse" />
          </Helmet>
          <RouterProvider router={router} />
          <ToastWrapper />
        </ThemeContextProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
