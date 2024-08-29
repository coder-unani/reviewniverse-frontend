import React, { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import router from "/src/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeContextProvider } from "/src/context/ThemeContext";
import { ToastWrapper } from "/src/components/Toast";
import { SETTINGS } from "/src/config/settings";
import { DEFAULT_IMAGES, SITE_KEYWORDS } from "/src/config/constants";

/**
 * TODO:
 * - 로딩 화면 추가
 * - 로그인 n회 이상 실패 시 사람인지 확인
 */

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeContextProvider>
          <Helmet>
            <title>{`리뷰니버스`}</title>
            <meta name="keywords" content={SITE_KEYWORDS} data-rh="true" />
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
          <Suspense fallback={null}>
            <RouterProvider router={router} />
          </Suspense>
          <ToastWrapper />
          <ReactQueryDevtools />
        </ThemeContextProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
