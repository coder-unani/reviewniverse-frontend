import React from "react";
import { AuthContextProvider } from "/src/context/AuthContext";
import { ModalContextProvider } from "/src/context/ModalContext";
import PrivateRoute from "/src/auth/privateRoute";
import DefaultLayout from "/src/layouts/default";
import { ENDPOINTS } from "/src/config/endpoints";

const UserProfile = React.lazy(() => import("/src/pages/UserProfile"));
const UserDelete = React.lazy(() => import("/src/pages/UserDelete"));

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
      path: ENDPOINTS.USER_PROFILE,
      element: <UserProfile />,
    },
    {
      path: ENDPOINTS.USER_DELETE,
      element: <UserDelete />,
    },
  ],
};

export default PrivateRoutes;
