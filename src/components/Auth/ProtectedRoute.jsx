import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const storedUser = localStorage.getItem("currentUser");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user && !storedUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
