import { AuthContextProvider } from "/src/context/AuthContext";
import NoHeaderLayout from "/src/layouts/noHeader";
import Login from "/src/pages/Login";
import SocialJoin from "/src/pages/SocialJoin";
import Join from "/src/pages/Join";
import UserFind from "/src/pages/UserFind";
import ResetPassword from "/src/pages/ResetPassword";

const NoHeaderRoutes = {
  path: "/",
  element: (
    <AuthContextProvider>
      <NoHeaderLayout />
    </AuthContextProvider>
  ),
  children: [
    {
      path: "/user/login",
      element: <Login />,
    },
    {
      path: "/user/auth/:provider/callback",
      element: <SocialJoin />,
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
  ],
};

export default NoHeaderRoutes;
