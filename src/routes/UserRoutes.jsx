import Login from "/src/pages/Login";
import Join from "/src/pages/Join";
import JoinSns from "/src/pages/JoinSns";

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
      element: <JoinSns />,
    },
  ],
};

export default UserRoutes;
