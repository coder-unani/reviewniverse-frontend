import { AuthContextProvider } from "/src/context/AuthContext";
import DefaultLayout from "/src/layouts/default";
import Home from "/src/pages/Home";
import Search from "/src/pages/Search";
import VideoDetail from "/src/pages/VideoDetail";
import People from "/src/pages/People";
import Genre from "/src/pages/Genre";
import Production from "/src/pages/Production";
import SocialJoin from "/src/pages/SocialJoin";
import Login from "/src/pages/Login";
// import Join from "/src/pages/Join";
// import UserFind from "/src/pages/UserFind";
// import ResetPassword from "/src/pages/ResetPassword";
import UserWatchType from "/src/pages/UserWatchType";
import User from "/src/pages/User";
import UserRatings from "/src/pages/UserRatings";
import UserReviews from "/src/pages/UserReviews";
import UserLikes from "/src/pages/UserLikes";
import Error from "/src/pages/Error";
import NotFound from "/src/pages/NotFound";

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
      path: "contents/:videoId",
      element: <VideoDetail />,
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
      path: "/search",
      element: <Search />,
    },
    {
      path: "/user/auth/:provider/callback",
      element: <SocialJoin />,
    },
    {
      path: "/user/login",
      element: <Login />,
    },
    // {
    //   path: "/user/join",
    //   element: <Join />,
    // },
    // {
    //   path: "/user/find/:type",
    //   element: <UserFind />,
    // },
    // {
    //   path: "/user/reset/password",
    //   element: <ResetPassword />,
    // },
    {
      path: "/user/watchtype",
      element: <UserWatchType />,
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
      path: "/user/:userId/contents/reviews",
      element: <UserReviews />,
    },
    {
      path: "/user/:userId/contents/likes",
      element: <UserLikes />,
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
