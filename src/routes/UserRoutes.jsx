import Login from "/src/pages/Login";
import Join from "/src/pages/Join";
import JoinSns from "/src/pages/JoinSns";
import FindUser from "/src/pages/FindUser";
import ResetPassword from "/src/pages/ResetPassword";

const UserRoutes = {
  path: "user",
  children: [
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "join",
      element: <Join />,
    },
    {
      path: "auth/:provider",
      // path: "auth/:provider/callback",
      element: <JoinSns />,
    },
    {
      path: "find/:type",
      element: <FindUser />,
    },
    {
      path: "reset/password",
      element: <ResetPassword />,
    },
  ],
};

export default UserRoutes;
