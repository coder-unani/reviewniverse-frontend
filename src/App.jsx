import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeContextProvider } from "/src/context/ThemeContext";
import { RouterProvider } from "react-router-dom";
import router from "/src/routes";
import { ToastWrapper } from "/src/components/Toast";
import "/src/styles/App.css";

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
          <RouterProvider router={router} />
          <ToastWrapper />
        </ThemeContextProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
