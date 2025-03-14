import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Check localStorage directly if user is not yet available
  const storedUser = localStorage.getItem("currentUser");

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator
  }

  // If there's no user in context or localStorage, redirect to login
  if (!user && !storedUser) {
    return <Navigate to="/login" />;
  }

  // If the user is logged in, render the children (TodoList page)
  return children;
};

export default ProtectedRoute;
