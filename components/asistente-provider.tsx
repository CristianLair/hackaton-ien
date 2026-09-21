"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Pedido, PedidoParsed } from "@/lib/asistente";

const STORAGE_KEY = "paquetenea.asistente.v1";
const CHANGE_EVENT = "paquetenea:asistente:change";

type AsistenteState = {
  pedidos: Pedido[];
};

const defaultState: AsistenteState = { pedidos: [] };

let cached: AsistenteState | null = null;

function read(): AsistenteState {
  if (cached) return cached;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cached = raw
      ? { ...defaultState, ...(JSON.parse(raw) as Partial<AsistenteState>) }
      : { ...defaultState };
  } catch {
    cached = { ...defaultState };
  }
  return cached;
}

function write(next: AsistenteState) {
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

type AsistenteContextValue = {
  pedidos: Pedido[];
  addPedido: (data: PedidoParsed) => Pedido;
  removePedido: (id: number) => void;
  reset: () => void;
};

const AsistenteContext = createContext<AsistenteContextValue | null>(null);

export function AsistenteProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, read, () => defaultState);

  const addPedido = (data: PedidoParsed) => {
    const pedidos = read().pedidos;
    const id = pedidos.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    const pedido: Pedido = { ...data, id, createdAt: new Date().toISOString() };
    write({ pedidos: [...pedidos, pedido] });
    return pedido;
  };

  const removePedido = (id: number) => {
    const pedidos = read().pedidos;
    write({ pedidos: pedidos.filter((p) => p.id !== id) });
  };

  const reset = () => write({ ...defaultState });

  return (
    <AsistenteContext.Provider value={{ pedidos: state.pedidos, addPedido, removePedido, reset }}>
      {children}
    </AsistenteContext.Provider>
  );
}

export function useAsistente() {
  const ctx = useContext(AsistenteContext);
  if (!ctx) throw new Error("useAsistente debe usarse dentro de <AsistenteProvider />");
  return ctx;
}