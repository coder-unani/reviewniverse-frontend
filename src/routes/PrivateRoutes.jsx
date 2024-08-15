import React from "react";
import { AuthContextProvider } from "/src/context/AuthContext";
import { ModalContextProvider } from "/src/context/ModalContext";
import PrivateRoute from "/src/auth/privateRoute";
import DefaultLayout from "/src/layouts/default";
import UserProfile from "/src/pages/UserProfile";
import UserDelete from "/src/pages/UserDelete";

const PrivateRoutes = {
  path: "/",
  element: (
    <AuthContextProvider>
      <ModalContextProvider>
        <PrivateRoute>
          <DefaultLayout />
        </PrivateRoute>
      </ModalContextProvider>
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
