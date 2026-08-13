import React, { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

const USERS = [
  { username: "master777", password: "Master@2024", role: "master", name: "Master Admin" },
  { username: "admin777",  password: "Admin@2024",  role: "admin",  name: "Admin User"   },
  { username: "agent777",  password: "Agent@2024",  role: "agent",  name: "Agent User"   },
  { username: "demo",      password: "demo123",     role: "user",   name: "Demo Player"  },
];

export const ROLE_HOME = {
  master: "/master/dashboard",
  admin:  "/admin/dashboard",
  agent:  "/agent/dashboard",
  user:   "/home",
};

export const AuthProvider = ({ children }) => {
  const stored = () => {
    try { return JSON.parse(localStorage.getItem("authUser")) || null; } catch { return null; }
  };

  const [user, setUser] = useState(stored);

  const login = useCallback((username, password) => {
    const found = USERS.find(u => u.username === username && u.password === password);
    if (!found) return { ok: false, error: "Invalid username or password." };
    const u = { username: found.username, role: found.role, name: found.name };
    localStorage.setItem("authUser", JSON.stringify(u));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userType", found.role);
    if (found.role === "admin" || found.role === "master") {
      localStorage.setItem("adminLoggedIn", "true");
    }
    setUser(u);
    return { ok: true, redirect: ROLE_HOME[found.role] };
  }, []);

  const demoLogin = useCallback(() => {
    const u = { username: "demo", role: "user", name: "Demo Player" };
    localStorage.setItem("authUser", JSON.stringify(u));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userType", "demo");
    setUser(u);
    return { ok: true, redirect: "/home" };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    localStorage.removeItem("adminLoggedIn");
    setUser(null);
  }, []);

  const hasRole = useCallback((...roles) => !!(user && roles.includes(user.role)), [user]);

  return (
    <AuthContext.Provider value={{ user, login, demoLogin, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
