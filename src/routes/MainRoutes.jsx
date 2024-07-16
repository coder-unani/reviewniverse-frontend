import DefaultLayout from "/src/layouts/default";
import Home from "/src/pages/Home";
import Movie from "/src/pages/Movie";
import Series from "/src/pages/Series";
import Content from "/src/pages/Content";
import Login from "/src/pages/Login";
import Join from "/src/pages/Join";
import SocialJoin from "/src/pages/SocialJoin";
import UserFind from "/src/pages/UserFind";
import ResetPassword from "/src/pages/ResetPassword";
import User from "/src/pages/User";

/**
 * TODO:
 * - 장르 홈
 * - 배우 홈
 * - 스태프 홈
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
      path: "/user/login",
      element: <Login />,
    },
    {
      path: "/user/join",
      element: <Join />,
    },
    {
      path: "/user/auth/:provider",
      // path: "auth/:provider/callback",
      element: <SocialJoin />,
    },
    {
      path: "/user/find/:type",
      element: <UserFind />,
    },
    {
      path: "/user/reset/password",
      element: <ResetPassword />,
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
