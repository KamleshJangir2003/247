import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import * as authApi from "../api/auth";
import api from "../api/client";
import { clearSession } from "../api/session";

const AuthContext = createContext(null);

export const ROLE_HOME = {
  super_admin: "/super/dashboard",
  master: "/master/dashboard",
  agent:  "/agent/dashboard",
  user:   "/home",
};

// Backend returns uppercase roles; frontend guards use lowercase
const normaliseRole = (role) => (role || "").toLowerCase();

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
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [ready, setReady] = useState(false);

  // On mount: validate any existing session against the server before rendering.
  // This prevents a stale MASTER/AGENT authUser from being trusted after an ADMIN login.
  useEffect(() => {
    const validate = async () => {
      const token = api.getAccessToken();

      // Demo session has no token — restore user from localStorage directly
      if (localStorage.getItem("isDemo") === "true") {
        const stored = localStorage.getItem("authUser");
        if (stored) setUser(JSON.parse(stored));
        setReady(true);
        return;
      }

      if (!token) {
        // No token → wipe any leftover user data and proceed unauthenticated
        clearSession();
        setReady(true);
        return;
      }

      // Token exists → ask the server who this really is
      try {
        const res = await authApi.me();
        if (res?.success && res.data?.user) {
          const u = buildUser(res.data.user);
          persistUser(u);
          setUser(u);
        } else {
          // /me returned a non-success (including 401) → full wipe
          clearSession();
        }
      } catch {
        clearSession();
      }

      setReady(true);
    };

    validate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (username, password) => {
    // Always wipe the previous session before writing the new one
    clearSession();
    setUser(null);

    const res = await authApi.login({ username, password });
    if (!res?.success) {
      return { ok: false, error: res?.message || "Invalid username or password." };
    }

    api.setTokens(res.data.accessToken, res.data.refreshToken);
    const u = buildUser(res.data.user);
    persistUser(u);
    setUser(u);
    return { ok: true, redirect: ROLE_HOME[u.role] || "/home" };
  }, []);

  const demoLogin = useCallback(async () => {
    clearSession();
    const u = { id: "demo", username: "demo", email: "demo@demo.com", name: "Demo User", role: "user" };
    persistUser(u);
    localStorage.setItem("isDemo", "true");
    setUser(u);
    return { ok: true, redirect: ROLE_HOME[u.role] || "/home" };
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    clearSession();
    setUser(null);
  }, []);

  const fetchMe = useCallback(async () => {
    const res = await authApi.me();
    if (res?.success && res.data?.user) {
      const u = buildUser(res.data.user);
      persistUser(u);
      setUser(u);
      return u;
    }
    return null;
  }, []);

  const hasRole = useCallback((...roles) => !!(user && roles.includes(user.role)), [user]);

  // Block the entire tree until hydration is complete.
  // This prevents RoleGuard from reading a stale role and flashing the wrong dashboard.
  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ user, login, demoLogin, logout, fetchMe, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
