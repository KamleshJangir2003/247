import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import * as authApi from "../api/auth";
import api from "../api/client";

const AuthContext = createContext(null);

export const ROLE_HOME = {
  master: "/master/dashboard",
  admin:  "/admin/dashboard",
  agent:  "/agent/dashboard",
  user:   "/home",
};

// Backend returns uppercase roles; frontend guards use lowercase
const normaliseRole = (role) => (role || "").toLowerCase();

const hydrateUser = () => {
  try { return JSON.parse(localStorage.getItem("authUser")) || null; } catch { return null; }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(hydrateUser);

  // On mount, clear any stale tokens that have no matching user object
  useEffect(() => {
    if (!user && api.getAccessToken()) {
      api.clearTokens();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const buildUser = (raw) => ({
    id:       raw._id,
    username: raw.username,
    email:    raw.email,
    name:     `${raw.firstName} ${raw.lastName || ""}`.trim(),
    role:     normaliseRole(raw.role),
  });

  const persistUser = (u) => {
    localStorage.setItem("authUser", JSON.stringify(u));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userType", u.role);
    setUser(u);
  };

  const login = useCallback(async (username, password) => {
    const res = await authApi.login({ username, password });
    if (!res?.success) {
      return { ok: false, error: res?.message || "Invalid username or password." };
    }
    api.setTokens(res.data.accessToken, res.data.refreshToken);
    const u = buildUser(res.data.user);
    persistUser(u);
    return { ok: true, redirect: ROLE_HOME[u.role] || "/home" };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const demoLogin = useCallback(async () => {
    const u = { id: "demo", username: "demo", email: "demo@demo.com", name: "Demo User", role: "user" };
    persistUser(u);
    return { ok: true, redirect: ROLE_HOME[u.role] || "/home" };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    api.clearTokens();
    localStorage.removeItem("authUser");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    localStorage.removeItem("adminLoggedIn");
    setUser(null);
  }, []);

  const fetchMe = useCallback(async () => {
    const res = await authApi.me();
    if (res?.success && res.data?.user) {
      const u = buildUser(res.data.user);
      persistUser(u);
      return u;
    }
    return null;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hasRole = useCallback((...roles) => !!(user && roles.includes(user.role)), [user]);

  return (
    <AuthContext.Provider value={{ user, login, demoLogin, logout, fetchMe, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
