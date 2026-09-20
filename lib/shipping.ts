export const CITIES = ["Resistencia", "Corrientes", "Fontana"] as const;

export type City = (typeof CITIES)[number];

export type Carrier = {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  deliveries: number;
  baseRate: number;
  perKg: number;
  days: number;
  pickupHours: number;
};

export const CARRIERS: Carrier[] = [
  {
    id: "transpaq",
    name: "Transpaq",
    tagline: "Referente regional en paquetería",
    rating: 4.6,
    deliveries: 1240,
    baseRate: 5200,
    perKg: 900,
    days: 1,
    pickupHours: 4,
  },
  {
    id: "erpack",
    name: "ErPack ERSA",
    tagline: "Salidas diarias por el NEA",
    rating: 4.4,
    deliveries: 980,
    baseRate: 4800,
    perKg: 700,
    days: 1,
    pickupHours: 6,
  },
  {
    id: "demonte",
    name: "Expreso Demonte",
    tagline: "Envíos ágiles puerta a puerta",
    rating: 4.7,
    deliveries: 1560,
    baseRate: 5900,
    perKg: 850,
    days: 1,
    pickupHours: 3,
  },
  {
    id: "viacargo",
    name: "Viacargo",
    tagline: "La opción más económica",
    rating: 4.2,
    deliveries: 740,
    baseRate: 3900,
    perKg: 600,
    days: 2,
    pickupHours: 8,
  },
];

export type ShippingStatus = "recolectado" | "en_camino" | "entregado";

export type ShippingState = {
  origen: City | null;
  destino: City | null;
  cantidad: number;
  pesoPorPaqueteKg: number;
  carrierId: string | null;
  trackingNumber: string | null;
  status: ShippingStatus;
  createdAt: string | null;
};

export function pesoTotalEnvio(pesoPorPaqueteKg: number, cantidad: number): number {
  return pesoPorPaqueteKg * cantidad;
}

export function quote(carrier: Carrier, pesoTotal: number): number {
  return Math.round(carrier.baseRate + carrier.perKg * pesoTotal);
}

export function cheapestCarrier(pesoTotal: number): Carrier {
  return [...CARRIERS].sort((a, b) => quote(a, pesoTotal) - quote(b, pesoTotal))[0];
}

export function fastestCarrier(): Carrier {
  return [...CARRIERS].sort((a, b) => a.days - b.days || a.pickupHours - b.pickupHours)[0];
}

export function formatARS(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

export function shortToken(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36).toUpperCase().padStart(5, "0").slice(0, 5);
}

export function generateTrackingNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return `NEA-${s}`;
}