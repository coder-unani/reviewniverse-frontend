import Login from "/src/pages/Login";
import Join from "/src/pages/Join";

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
  ],
};

export default UserRoutes;
