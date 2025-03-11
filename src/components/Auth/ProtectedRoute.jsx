import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // Check localStorage if user is not yet available in context
  const storedUser = localStorage.getItem("user");

  // If there's no user in context or localStorage, redirect to the Login page
  if (!user && !storedUser) {
    return <Navigate to="/login" />;
  }

  // If the user is logged in, render the children (TodoList page)
  return children;
};

export default ProtectedRoute;
