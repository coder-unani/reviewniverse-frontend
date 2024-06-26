import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "/src/routes";
import "/src/styles/App.css";

/**
 * TODO:
 * 0. 페이지 라우팅
 * 4-1. 아이디, 비밀번호 입력
 * 4-2. 로그인 버튼 클릭 시 로그인 처리
 * 4-3. 로그인 성공 시 메인 페이지로 이동
 * 4-4. 로그인 n회 이상 실패 시 사람인지 확인
 * 5-1. 아이디, 비밀번호, 비밀번호 확인, 이름, 이메일 입력
 */

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
