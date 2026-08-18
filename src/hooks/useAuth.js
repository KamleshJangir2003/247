import { useAuth as useAuthContext } from "../context/AuthContext";

// Re-export context hook; keeps backward-compat for components using this hook
const useAuth = () => {
  const { user, logout } = useAuthContext();
  return {
    isLoggedIn: !!user,
    isDemo:     user?.username === "demo",
    isReal:     !!user && user?.username !== "demo",
    user,
    logout,
  };
};

export default useAuth;
