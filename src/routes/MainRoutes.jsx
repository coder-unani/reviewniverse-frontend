import DefaultLayout from "/src/layouts/default";
import Home from "/src/pages/Home";
import Movie from "/src/pages/Movie";
import Series from "/src/pages/Series";
import Content from "/src/pages/Content";
import EditUser from "/src/pages/EditUser";
import DeleteUser from "/src/pages/DeleteUser";
import User from "/src/pages/User";

/**
 * TODO:
 * - 메인 페이지
 * - 영화 페이지
 * - 시리즈 페이지
 * - 로그인 페이지
 * - 회원가입 페이지
 * - 영화/시리즈 상세 페이지
 * - 리뷰 작성 페이지
 * - 검색 결과 페이지
 * - 사용자 정보 수정 페이지
 * - 사용자 탈퇴 페이지
 * - 사용자 프로필 페이지
 * - 마이 페이지
 * - 404 페이지
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
      element: <EditUser />,
    },
    {
      path: "/user/delete",
      element: <DeleteUser />,
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
