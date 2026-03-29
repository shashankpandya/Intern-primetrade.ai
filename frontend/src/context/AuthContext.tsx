import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { api } from "../lib/api";
import type { AuthUser } from "../types";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken"),
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    localStorage.getItem("refreshToken"),
  );

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const { user: apiUser, accessToken: at, refreshToken: rt } = response.data;

    setUser(apiUser);
    setAccessToken(at);
    setRefreshToken(rt);

    localStorage.setItem("user", JSON.stringify(apiUser));
    localStorage.setItem("accessToken", at);
    localStorage.setItem("refreshToken", rt);
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post("/auth/register", { name, email, password });
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      login,
      register,
      logout,
    }),
    [user, accessToken, refreshToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
