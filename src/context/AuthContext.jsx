import React, { useState, useEffect } from "react";
import { createContext } from "react";

// Create and export the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if user is logged in on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = (email, password) => {
    // Get all users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the email is already registered
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return false; // Registration failed (email already exists)
    }

    // Create a new user
    const newUser = {
      id: Date.now(), // Unique ID for the user
      email,
      password, // Note: In a real app, never store passwords in plain text!
      todos: [], // Each user has their own todo list
    };

    // Add the new user to the list of users
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Log the user in after registration
    setUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    return true; // Registration successful
  };

  const login = (email, password) => {
    // Get all users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find the user with the matching email and password
    const userData = users.find(
      (u) => u.email === email && u.password === password
    );
    if (userData) {
      setUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));
      return true; // Login successful
    }

    return false; // Login failed
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
