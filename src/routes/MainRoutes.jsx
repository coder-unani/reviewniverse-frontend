import React from "react";
import { AuthContextProvider } from "/src/context/AuthContext";
import { ModalContextProvider } from "/src/context/ModalContext";
import { VideoDetailProvider } from "/src/context/VideoDetailContext";
import DefaultLayout from "/src/layouts/default";

const Home = React.lazy(() => import("/src/pages/Home"));
const VideoDetail = React.lazy(() => import("/src/pages/VideoDetail"));
const People = React.lazy(() => import("/src/pages/People"));
const Genre = React.lazy(() => import("/src/pages/Genre"));
const Production = React.lazy(() => import("/src/pages/Production"));
const Search = React.lazy(() => import("/src/pages/Search"));
const KakaoCallback = React.lazy(() => import("/src/auth/KakaoCallback"));
const NaverCallback = React.lazy(() => import("/src/auth/NaverCallback"));
const GoogleCallback = React.lazy(() => import("/src/auth/GoogleCallback"));
const Login = React.lazy(() => import("/src/pages/Login"));
const UserWatchType = React.lazy(() => import("/src/pages/UserWatchType"));
const User = React.lazy(() => import("/src/pages/User"));
const UserRatings = React.lazy(() => import("/src/pages/UserRatings"));
const UserReviews = React.lazy(() => import("/src/pages/UserReviews"));
const UserLikes = React.lazy(() => import("/src/pages/UserLikes"));
const Error = React.lazy(() => import("/src/pages/Error"));
const NotFound = React.lazy(() => import("/src/pages/NotFound"));

const MainRoutes = {
  path: "/",
  element: (
    <AuthContextProvider>
      <ModalContextProvider>
        <DefaultLayout />
      </ModalContextProvider>
    </AuthContextProvider>
  ),
  children: [
    {
      index: true,
      element: <Home />,
    },
    {
      path: "index.html",
      element: <Home />,
    },
    {
      path: "contents/:videoId",
      element: (
        <VideoDetailProvider>
          <VideoDetail />
        </VideoDetailProvider>
      ),
    },
    {
      path: "/people/:peopleId",
      element: <People />,
    },
    {
      path: "/genres/:genreId",
      element: <Genre />,
    },
    {
      path: "/productions/:productionId",
      element: <Production />,
    },
    {
      path: "/search",
      element: <Search />,
    },
    {
      path: "/user/auth/kakao/callback",
      element: <KakaoCallback />,
    },
    {
      path: "/user/auth/naver/callback",
      element: <NaverCallback />,
    },
    {
      path: "/user/auth/google/callback",
      element: <GoogleCallback />,
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
