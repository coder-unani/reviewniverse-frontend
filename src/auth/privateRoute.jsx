import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/user/login" />;
};

export default PrivateRoute;
