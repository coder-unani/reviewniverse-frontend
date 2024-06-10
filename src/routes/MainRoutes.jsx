/**
 * @todo
 * 0. 메인 페이지
 * 1. 영화 페이지
 * 2. 시리즈 페이지
 * 3. 로그인 페이지
 * 4. 회원가입 페이지
 * 5. 영화/시리즈 상세 페이지
 * 6. 리뷰 작성 페이지
 * 7. 검색 결과 페이지
 *
 * ? 마이페이지
 */

import DefaultLayout from "/src/layouts/default";
import Home from "/src/pages/Home";
import Movie from "/src/pages/Movie";
import Series from "/src/pages/Series";

const MainRoutes = {
  path: "/",
  element: <DefaultLayout />,
  children: [
    {
      path: "/",
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
  ],
};

export default MainRoutes;
