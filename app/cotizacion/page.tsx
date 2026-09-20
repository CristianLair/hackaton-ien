"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CARRIERS,
  cheapestCarrier,
  fastestCarrier,
  formatARS,
  pesoTotalEnvio,
  quote,
  type Carrier,
} from "@/lib/shipping";
import { useShipping } from "@/components/shipping-provider";
import { EmptyState } from "@/components/empty-state";

export default function CotizacionPage() {
  const router = useRouter();
  const { state, selectCarrier } = useShipping();
  const [selectedId, setSelectedId] = useState<string | null>(state.carrierId);

  if (!state.origen || !state.destino || state.origen === state.destino) {
    return (
      <EmptyState
        title="Todavía no cargaste tu envío"
        description="Primero definí origen, destino, cantidad de paquetes y peso para poder cotizar."
        ctaHref="/"
        ctaLabel="Cargar mi envío"
      />
    );
  }

  const cantidad = state.cantidad;
  const pesoTotal = pesoTotalEnvio(state.pesoPorPaqueteKg, cantidad);
  const best = cheapestCarrier(pesoTotal);
  const fastest = fastestCarrier();

  const sorted = [...CARRIERS].sort((a, b) => quote(a, pesoTotal) - quote(b, pesoTotal));

  const handleElegir = (carrier: Carrier) => {
    setSelectedId(carrier.id);
    selectCarrier(carrier.id);
    router.push("/pago");
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Tu envío</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {state.origen} <span className="text-teal-500">→</span> {state.destino}
          </h1>
          <p className="mt-1 text-slate-500">
            {cantidad} {cantidad === 1 ? "paquete" : "paquetes"} ·{" "}
            {pesoTotal.toLocaleString("es-AR", { maximumFractionDigits: 1 })} kg totales · Cotización
            instantánea
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
            <path
              d="M10 4 6 8l4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Editar envío
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {sorted.map((carrier) => {
          const total = quote(carrier, pesoTotal);
          const isBest = carrier.id === best.id;
          const isFastest = carrier.id === fastest.id;
          const selected = carrier.id === selectedId;
          return (
            <div
              key={carrier.id}
              className={`relative flex flex-col rounded-3xl border bg-white p-6 shadow-sm transition ${
                selected ? "border-teal-600 ring-2 ring-teal-100" : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{carrier.name}</h2>
                  <p className="text-sm text-slate-500">{carrier.tagline}</p>
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                  {isBest && (
                    <span className="rounded-full bg-teal-600 px-2.5 py-1 text-xs font-semibold text-white">
                      Mejor opción
                    </span>
                  )}
                  {isFastest && !isBest && (
                    <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
                      Más rápido
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                  <svg viewBox="0 0 16 16" className="h-4 w-4 text-amber-500" fill="currentColor" aria-hidden="true">
                    <path d="M8 1.5 9.9 5.5l4.4.6L11 8.9l.9 4.3L8 11.1 4.1 13.2 5 8.9 1.7 6.1l4.4-.6L8 1.5Z" />
                  </svg>
                  {carrier.rating.toFixed(1)}
                  <span className="font-normal text-slate-400">· {carrier.deliveries.toLocaleString("es-AR")} entregas</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                  <svg viewBox="0 0 16 16" className="h-4 w-4 text-teal-600" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M8 4.75V8l2.25 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  {carrier.days === 1 ? "24 hs" : `${carrier.days} días`}
                </div>
              </div>

              <div className="mt-4 space-y-1.5 text-sm text-slate-500">
                <p>Recolección en {carrier.pickupHours} hs en {state.origen}</p>
                <p>
                  Tarifa base {formatARS(carrier.baseRate)} + {formatARS(carrier.perKg)} por kg
                </p>
              </div>

              <div className="mt-auto pt-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Total a pagar</p>
                    <p className="text-2xl font-bold text-slate-900">{formatARS(total)}</p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="carrier"
                      checked={selected}
                      onChange={() => setSelectedId(carrier.id)}
                      className="h-4 w-4 accent-teal-600"
                    />
                    <span className="text-sm font-medium text-slate-600">Elegir</span>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => handleElegir(carrier)}
                  className={`mt-4 w-full rounded-xl px-6 py-3 text-sm font-semibold transition ${
                    selected
                      ? "bg-teal-600 text-white hover:bg-teal-700"
                      : "border border-slate-300 text-slate-700 hover:border-teal-500 hover:text-teal-700"
                  }`}
                >
                  {selected ? `Pagar con ${carrier.name}` : "Seleccionar y seguir"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Precio final sin sorpresas: lo que ves es lo que pagás, con recolección coordinada por PaqueteNEA.
      </p>
    </div>
  );
}