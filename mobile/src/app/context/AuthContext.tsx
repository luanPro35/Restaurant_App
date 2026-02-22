import React, { createContext, useContext, useState, useEffect } from "react";
import tokenManager from "../../services/api/token.manager";
import authApi from "../../services/api/auth.api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await tokenManager.loadToken();
        const token = tokenManager.getToken();
        if (token) {
          const userData = await authApi.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        await tokenManager.setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (token: string, userData: User) => {
    await tokenManager.setToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await tokenManager.setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
