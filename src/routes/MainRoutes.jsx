import { AuthContextProvider } from "/src/context/AuthContext";
import DefaultLayout from "/src/layouts/default";
import Home from "/src/pages/Home";
import Movie from "/src/pages/Movie";
import Series from "/src/pages/Series";
import VideoDetail from "/src/pages/VideoDetail";
import People from "/src/pages/People";
import Genre from "/src/pages/Genre";
import Production from "/src/pages/Production";
import UserWatchType from "/src/pages/UserWatchType";
import User from "/src/pages/User";
import UserRatings from "/src/pages/UserRatings";
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
      path: "/movie",
      element: <Movie />,
    },
    {
      path: "/series",
      element: <Series />,
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
