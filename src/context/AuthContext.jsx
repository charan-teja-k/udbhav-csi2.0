import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Authentication functions (no backend)
  const login = async (email, password) => {
    console.log("Login disabled (backend removed)");
    return { success: false, error: "Backend removed" };
  };

  const signup = async (email, password, name) => {
    console.log("Signup disabled (backend removed)");
    return { success: false, error: "Backend removed" };
  };

  const logout = async () => {
    setUser(null);
    return { success: true };
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
