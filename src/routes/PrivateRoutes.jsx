import React from "react";
import PrivateRoute from "/src/auth/privateRoute";
import DefaultLayout from "/src/layouts/default";
import UserProfile from "/src/pages/UserProfile";
import UserDelete from "/src/pages/UserDelete";
import { AuthContextProvider } from "/src/context/AuthContext";

const PrivateRoutes = {
  path: "/",
  element: (
    <AuthContextProvider>
      <PrivateRoute>
        <DefaultLayout />
      </PrivateRoute>
    </AuthContextProvider>
  ),
  children: [
    {
      path: "/user/profile",
      element: <UserProfile />,
    },
    {
      path: "/user/delete",
      element: <UserDelete />,
    },
  ],
};

export default PrivateRoutes;
