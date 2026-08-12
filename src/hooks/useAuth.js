import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userType   = localStorage.getItem("userType") || "";
  const isDemo     = userType === "demo";
  const isReal     = userType === "real";

  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    navigate("/");
  }, [navigate]);

  return { isLoggedIn, isDemo, isReal, logout };
};

export default useAuth;
