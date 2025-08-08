"use client";

import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } catch (e) {
          console.error("Failed to parse user data:", e);
          logout(); // Clear invalid data
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setLoginError("");

      // For demo purposes - simulate successful login
      // In a real app, this would call your actual API
      const token = "demo_token_12345";

      // Store token in localStorage
      localStorage.setItem("token", token);

      // Create demo user data
      const userProfile = {
        id: 1,
        name: "John Doe",
        username: username,
        email: "john@example.com",
        initials: "JD",
      };

      localStorage.setItem("userId", userProfile.id);
      localStorage.setItem("user", JSON.stringify(userProfile));

      setUser(userProfile);
      setIsAuthenticated(true);
      setIsLoginOpen(false);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Invalid username or password");
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);
  };

  // Get user initials
  const getUserInitials = () => {
    return user?.initials || "";
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        isLoginOpen,
        setIsLoginOpen,
        loginError,
        setLoginError,
        getUserInitials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
