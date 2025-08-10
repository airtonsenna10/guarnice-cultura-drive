import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { listAll } from "@/services/localdb";
import { Usuario, PerfilAcesso } from "@/services/types";

interface AuthContextValue {
  user: Pick<Usuario, "id" | "login" | "nome" | "perfil"> | null;
  login: (login: string, senha: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (...roles: PerfilAcesso[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function sha(text: string) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthContextValue["user"]>(null);

  useEffect(() => {
    const saved = localStorage.getItem("auth.user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (login: string, senha: string) => {
    const users = listAll<Usuario>("usuarios");
    const found = users.find((u) => u.login === login);
    if (!found) return false;
    const hash = await sha(senha);
    if (hash !== found.senhaHash) return false;
    const payload = { id: found.id, login: found.login, nome: found.nome, perfil: found.perfil };
    setUser(payload);
    localStorage.setItem("auth.user", JSON.stringify(payload));
    return true;
  };

  const logout = () => {
    localStorage.removeItem("auth.user");
    setUser(null);
  };

  const hasRole = (...roles: PerfilAcesso[]) => !!user && roles.includes(user.perfil);

  const value = useMemo(() => ({ user, login, logout, hasRole }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
