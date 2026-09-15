/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../../api/auth/api";
import { type User } from "../../types/profile";

/**
 * La session ne laisse aucune trace exploitable dans le navigateur : le
 * refresh token vit dans un cookie httpOnly géré par l'API, et le jeton
 * d'accès reste en mémoire. Un script injecté dans la page ne peut donc
 * voler ni l'un ni l'autre de façon durable. Au chargement, un appel de
 * rafraîchissement suffit à restaurer la session si le cookie est valide.
 */
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

  function setSession(u: User, token: string) {
    setUser(u);
    setAccessToken(token);
  }

  function clearSession() {
    setUser(null);
    setAccessToken(null);
  }

  async function refreshSession(): Promise<string> {
    const res = await authApi.refresh();
    setSession(res.data.user, res.data.accessToken);
    return res.data.accessToken;
  }

  useEffect(() => {
    (async () => {
      try {
        // Le cookie decide : s'il est absent ou expire, l'API repond 401.
        await refreshSession();
      } catch {
        clearSession();
      }
      setIsLoading(false);
    })();
  }, []);

  async function login(email: string, password: string) {
    const res = await authApi.login(email, password);
    setSession(res.data.user, res.data.accessToken);
  }

  async function register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    const res = await authApi.register(email, password, firstName, lastName);
    setSession(res.data.user, res.data.accessToken);
  }

  async function logout() {
    if (accessToken) {
      // L'API revoque le jeton en base et expire le cookie.
      await authApi.logout(accessToken).catch(() => {});
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
