/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../../api/auth/api";
import { type User } from "../../types/profile";

const REFRESH_KEY = "refreshToken";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  function setSession(u: User, token: string, refreshToken: string) {
    setUser(u);
    setAccessToken(token);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  }

  function clearSession() {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem(REFRESH_KEY);
  }

  async function refreshSession(): Promise<string> {
    const stored = localStorage.getItem(REFRESH_KEY);
    if (!stored) throw new Error("No refresh token");
    const res = await authApi.refresh(stored);
    setSession(res.data.user, res.data.accessToken, res.data.refreshToken);
    return res.data.accessToken;
  }

  useEffect(() => {
    (async () => {
      const stored = localStorage.getItem(REFRESH_KEY);
      if (stored) {
        try {
          const res = await authApi.refresh(stored);
          setSession(
            res.data.user,
            res.data.accessToken,
            res.data.refreshToken,
          );
        } catch {
          clearSession();
        }
      }
      setIsLoading(false);
    })();
  }, []);

  async function login(email: string, password: string) {
    const res = await authApi.login(email, password);
    setSession(res.data.user, res.data.accessToken, res.data.refreshToken);
  }

  async function register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    const res = await authApi.register(email, password, firstName, lastName);
    setSession(res.data.user, res.data.accessToken, res.data.refreshToken);
  }

  async function logout() {
    const stored = localStorage.getItem(REFRESH_KEY);
    if (accessToken && stored) {
      await authApi.logout(accessToken, stored).catch(() => {});
    }
    clearSession();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
