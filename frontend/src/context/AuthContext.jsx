import { createContext, useContext, useState, useEffect } from "react";
import { getToken, saveToken, clearToken } from "../utils/storage.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // load user from token
  useEffect(() => {
    const token = getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    }
  }, []);

  const login = (token) => {
    saveToken(token);
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser(payload);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
