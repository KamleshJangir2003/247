const SESSION_KEYS = [
  "accessToken",
  "refreshToken",
  "authUser",
  "isLoggedIn",
  "userType",
  "adminLoggedIn",
  "isDemo",
];

export const clearSession = () => {
  SESSION_KEYS.forEach((k) => localStorage.removeItem(k));
};
