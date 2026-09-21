"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

const STORAGE_KEY = "paquetenea.auth.v1";
const CHANGE_EVENT = "paquetenea:auth:change";

export type Usuario = {
  nombre: string;
  email: string;
};

const USUARIO_MOCK: Usuario = {
  nombre: "María · Emprendedora demo",
  email: "demo@paquetenea.com",
};

type AuthState = {
  usuario: Usuario | null;
};

const defaultState: AuthState = { usuario: null };

let cached: AuthState | null = null;

function read(): AuthState {
  if (cached) return cached;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cached = raw ? { ...defaultState, ...(JSON.parse(raw) as Partial<AuthState>) } : { ...defaultState };
  } catch {
    cached = { ...defaultState };
  }
  return cached;
}

function write(next: AuthState) {
  cached = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

type AuthContextValue = {
  usuario: Usuario | null;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, read, () => defaultState);

  const login = () => write({ usuario: USUARIO_MOCK });
  const logout = () => write({ usuario: null });

  return (
    <AuthContext.Provider value={{ usuario: state.usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider />");
  return ctx;
}