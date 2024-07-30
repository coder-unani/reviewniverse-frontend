import { AuthContextProvider } from "/src/context/AuthContext";
import DefaultLayout from "/src/layouts/default";
import Home from "/src/pages/Home";
import Movie from "/src/pages/Movie";
import Series from "/src/pages/Series";
import Content from "/src/pages/Content";
import People from "/src/pages/People";
import Genre from "/src/pages/Genre";
import Production from "/src/pages/Production";
import Login from "/src/pages/Login";
import Join from "/src/pages/Join";
import SocialJoin from "/src/pages/SocialJoin";
import UserWatchType from "/src/pages/UserWatchType";
import UserFind from "/src/pages/UserFind";
import ResetPassword from "/src/pages/ResetPassword";
import User from "/src/pages/User";
import UserRatings from "/src/pages/UserRatings";
import Error from "/src/pages/Error";
import NotFound from "/src/pages/NotFound";

/**
 * TODO:
 * - 장르 홈
 * - 배우 홈
 * - 스태프 홈
 * - 404 페이지
 */

const MainRoutes = {
  path: "/",
  element: (
    <AuthContextProvider>
      <DefaultLayout />
    </AuthContextProvider>
  ),
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
      path: "/people/:peopleId",
      element: <People />,
    },
    {
      path: "/genre",
      element: <Genre />,
    },
    {
      path: "/production/:productionId",
      element: <Production />,
    },
    {
      path: "/user/login",
      element: <Login />,
    },
    {
      path: "/user/auth/:provider/callback",
      element: <SocialJoin />,
    },
    {
      path: "/user/join",
      element: <Join />,
    },
    {
      path: "/user/watchtype",
      element: <UserWatchType />,
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
      path: "/user/:userId/contents/ratings",
      element: <UserRatings />,
    },
    {
      path: "/error",
      element: <Error />,
    },
    {
      path: "/*",
      element: <NotFound />,
    },
  ],
};

export default MainRoutes;
