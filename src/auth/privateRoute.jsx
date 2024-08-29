import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { ENDPOINTS } from "/src/config/endpoints";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to={ENDPOINTS.USER_LOGIN} />;
};

export default PrivateRoute;
