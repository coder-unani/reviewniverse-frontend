import React from "react";
import { AuthContextProvider } from "/src/context/AuthContext";
import { ModalContextProvider } from "/src/context/ModalContext";
import { VideoDetailProvider } from "/src/context/VideoDetailContext";
import DefaultLayout from "/src/layouts/default";
import { ENDPOINTS } from "/src/config/endpoints";

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
      path: ENDPOINTS.VIDEO_DETAIL,
      element: (
        <VideoDetailProvider>
          <VideoDetail />
        </VideoDetailProvider>
      ),
    },
    {
      path: ENDPOINTS.PEOPLE,
      element: <People />,
    },
    {
      path: ENDPOINTS.GENRE,
      element: <Genre />,
    },
    {
      path: ENDPOINTS.PRODUCTION,
      element: <Production />,
    },
    {
      path: ENDPOINTS.SEARCH,
      element: <Search />,
    },
    {
      path: ENDPOINTS.USER_AUTH_KAKAO_CALLBACK,
      element: <KakaoCallback />,
    },
    {
      path: ENDPOINTS.USER_AUTH_NAVER_CALLBACK,
      element: <NaverCallback />,
    },
    {
      path: ENDPOINTS.USER_AUTH_GOOGLE_CALLBACK,
      element: <GoogleCallback />,
    },
    {
      path: ENDPOINTS.USER_LOGIN,
      element: <Login />,
    },
    {
      path: ENDPOINTS.USER_WATCHTYPE,
      element: <UserWatchType />,
    },
    {
      path: ENDPOINTS.USER,
      element: <User />,
    },
    {
      path: ENDPOINTS.USER_RATINGS,
      element: <UserRatings />,
    },
    {
      path: ENDPOINTS.USER_REVIEWS,
      element: <UserReviews />,
    },
    {
      path: ENDPOINTS.USER_LIKES,
      element: <UserLikes />,
    },
    {
      path: ENDPOINTS.ERROR,
      element: <Error />,
    },
    {
      path: ENDPOINTS.DENIED_ALL,
      element: <NotFound />,
    },
  ],
};

export default MainRoutes;
