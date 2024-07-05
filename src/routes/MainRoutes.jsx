import DefaultLayout from "/src/layouts/default";
import Home from "/src/pages/Home";
import Movie from "/src/pages/Movie";
import Series from "/src/pages/Series";
import Content from "/src/pages/Content";
import Profile from "/src/pages/Profile";
import User from "/src/pages/User";

/**
 * TODO:
 * 0. 메인 페이지
 * 1. 영화 페이지
 * 2. 시리즈 페이지
 * 3. 로그인 페이지
 * 4. 회원가입 페이지
 * 5. 영화/시리즈 상세 페이지
 * 6. 리뷰 작성 페이지
 * 7. 검색 결과 페이지
 * 8. 사용자 프로필 페이지
 * 9. 마이 페이지
 * 10. 404 페이지
 */

const MainRoutes = {
  path: "/",
  element: <DefaultLayout />,
  children: [
    {
      index: true,
      element: <Home />,
    },
    {
      path: "/movie",
      element: <Movie />,
    },
    {
      path: "/series",
      element: <Series />,
    },
    {
      path: "/contents/:contentId",
      element: <Content />,
    },
    {
      path: "/user/profile",
      element: <Profile />,
    },
    {
      path: "/user/:userId",
      element: <User />,
    },
    {
      path: "/*",
      element: <div>404 Not Found</div>,
    },
  ],
};

export default MainRoutes;
