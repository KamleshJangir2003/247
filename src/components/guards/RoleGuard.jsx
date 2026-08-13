import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth, ROLE_HOME } from "../../context/AuthContext";

const RoleGuard = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role] || "/login"} replace />;
  }

  return children;
};

export default RoleGuard;
