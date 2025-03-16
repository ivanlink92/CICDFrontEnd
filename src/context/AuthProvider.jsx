import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if the user is already logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("currentUser");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // Register a new user
  const register = async (username, password) => {
    console.log("Registering user...");
    try {
      const response = await axios.post("http://localhost:8000/api/register/", {
        username,
        password,
      });
      const newUser = response.data;
      setUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      localStorage.setItem("token", response.data.token);
      return true; // Registration successful
    } catch (error) {
      console.error("Registration failed:", error);
      return false; // Registration failed
    }
  };

  // Login an existing user
  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      });
      const userData = {
        username, // Add any other user data you need
        accessToken: response.data.access,
        refreshToken: response.data.refresh,
      };

      setUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.setItem("token", response.data.access); // Store the access token
      localStorage.setItem("refreshToken", response.data.refresh); // Store the refresh token
      return true; // Login successful
    } catch (error) {
      console.error("Login failed:", error);
      return false; // Login failed
    }
  };

  // Logout the user
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  };

  // Provide the context values
  const value = {
    user,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
