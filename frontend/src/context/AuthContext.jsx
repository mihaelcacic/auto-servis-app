// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // fetch user info from backend after each reload
  useEffect(() => {
    fetch("http://localhost:8080/api/user", {
      credentials: "include", // important for session cookie
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  // redirect to Spring Boot for login
  const login = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  // logout via backend
  const logout = () => {
    fetch("http://localhost:8080/logout", {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      setUser(null);
      window.location.href = "/";
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}