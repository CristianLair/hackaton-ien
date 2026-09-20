"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { generateTrackingNumber, type City, type ShippingState } from "@/lib/shipping";

const STORAGE_KEY = "paquetenea.shipping.v2";
const CHANGE_EVENT = "paquetenea:change";

const defaultState: ShippingState = {
  origen: null,
  destino: null,
  cantidad: 1,
  pesoPorPaqueteKg: 1,
  carrierId: null,
  trackingNumber: null,
  status: "en_camino",
  createdAt: null,
};

let cached: ShippingState | null = null;

function read(): ShippingState {
  if (cached) return cached;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cached = raw ? { ...defaultState, ...(JSON.parse(raw) as Partial<ShippingState>) } : { ...defaultState };
  } catch {
    cached = { ...defaultState };
  }
  return cached;
}

function write(next: ShippingState) {
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

type ShippingContextValue = {
  state: ShippingState;
  setOrigen: (city: City) => void;
  setDestino: (city: City) => void;
  setCantidad: (count: number) => void;
  setPesoKg: (weight: number) => void;
  selectCarrier: (id: string) => void;
  confirmPayment: () => void;
  reset: () => void;
};

const ShippingContext = createContext<ShippingContextValue | null>(null);

export function ShippingProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, read, () => defaultState);

  const setOrigen = (city: City) => write({ ...read(), origen: city });
  const setDestino = (city: City) => write({ ...read(), destino: city });
  const setCantidad = (count: number) =>
    write({ ...read(), cantidad: Math.max(1, Math.min(99, count)) });
  const setPesoKg = (weight: number) =>
    write({ ...read(), pesoPorPaqueteKg: Math.max(0.5, Math.min(1000, weight)) });
  const selectCarrier = (id: string) => write({ ...read(), carrierId: id });
  const confirmPayment = () =>
    write({
      ...read(),
      trackingNumber: read().trackingNumber ?? generateTrackingNumber(),
      createdAt: read().createdAt ?? new Date().toISOString(),
    });
  const reset = () => write({ ...defaultState });

  return (
    <ShippingContext.Provider
      value={{ state, setOrigen, setDestino, setCantidad, setPesoKg, selectCarrier, confirmPayment, reset }}
    >
      {children}
    </ShippingContext.Provider>
  );
}

export function useShipping() {
  const ctx = useContext(ShippingContext);
  if (!ctx) throw new Error("useShipping debe usarse dentro de <ShippingProvider />");
  return ctx;
}