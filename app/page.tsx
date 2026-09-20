"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES, CARRIERS } from "@/lib/shipping";
import { useShipping } from "@/components/shipping-provider";

const FIELD_BASE =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

function roundKg(n: number): number {
  return Math.round(n * 10) / 10;
}

export default function CargaEnvioPage() {
  const router = useRouter();
  const { state, setOrigen, setDestino, setCantidad, setPesoKg } = useShipping();
  const [error, setError] = useState<string | null>(null);

  const pesoTotal = state.pesoPorPaqueteKg * state.cantidad;
  const destinoIgual = state.origen !== null && state.destino !== null && state.origen === state.destino;

  const handleCotizar = () => {
    if (!state.origen || !state.destino) {
      setError("Completá origen y destino para cotizar.");
      return;
    }
    if (destinoIgual) {
      setError("El destino debe ser distinto al origen.");
      return;
    }
    if (state.pesoPorPaqueteKg <= 0) {
      setError("Ingresá un peso válido por paquete.");
      return;
    }
    setError(null);
    router.push("/cotizacion");
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
            Agregador de envíos · Resistencia · Corrientes · Fontana
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Enviá tus paquetes por el NEA{" "}
            <span className="text-teal-600">sin llamar a nadie</span>.
          </h1>
          <p className="mt-4 max-w-lg text-lg text-slate-600">
            Cotizás en segundos, pagás con un link y coordinamos la recolección con
            transportistas regionales ya existentes.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              ["Cotización instantánea", "Comparás precio y tiempo entre transportistas integrados."],
              ["Pago con link", "Generás el link de pago sin registrarte ni cargar datos."],
              ["Seguimiento simple", "Recolectado → En camino → Entregado, en una sola pantalla."],
            ].map(([t, d]) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-teal-700" fill="none" aria-hidden="true">
                    <path
                      d="M3.5 8.5 6.5 11.5 12.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold text-slate-800">{t}</p>
                  <p className="text-sm text-slate-500">{d}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Transportistas integrados:</span>
            {CARRIERS.map((c) => (
              <span
                key={c.id}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Nuevo envío</h2>
          <p className="mt-1 text-sm text-slate-500">Cargá origen, destino, cantidad y peso.</p>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="origen" className="mb-1.5 block text-sm font-medium text-slate-700">
                Origen
              </label>
              <select
                id="origen"
                value={state.origen ?? ""}
                onChange={(e) => {
                  const v = e.target.value as (typeof CITIES)[number];
                  setOrigen(v);
                  setError(null);
                }}
                className={FIELD_BASE}
              >
                <option value="" disabled>
                  Seleccioná tu localidad
                </option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="destino" className="mb-1.5 block text-sm font-medium text-slate-700">
                Destino
              </label>
              <select
                id="destino"
                value={state.destino ?? ""}
                onChange={(e) => {
                  const v = e.target.value as (typeof CITIES)[number];
                  setDestino(v);
                  setError(null);
                }}
                className={FIELD_BASE}
              >
                <option value="" disabled>
                  Seleccioná la localidad de entrega
                </option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {destinoIgual && (
                <p className="mt-1.5 text-sm text-amber-600">
                  Origen y destino son iguales, elegí una localidad distinta.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cantidad" className="mb-1.5 block text-sm font-medium text-slate-700">
                Cantidad de paquetes
              </label>
              <div className="flex items-center justify-between rounded-xl border border-slate-300 bg-white p-2 shadow-sm">
                <button
                  type="button"
                  onClick={() => setCantidad(state.cantidad - 1)}
                  disabled={state.cantidad <= 1}
                  aria-label="Quitar un paquete"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-lg font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>
                <span className="text-lg font-bold text-slate-900">{state.cantidad}</span>
                <button
                  type="button"
                  onClick={() => setCantidad(state.cantidad + 1)}
                  disabled={state.cantidad >= 99}
                  aria-label="Agregar un paquete"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-lg font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {state.cantidad === 1
                  ? "Un envío individual, simple y sin volumen."
                  : `Enviás ${state.cantidad} paquetes: cotizamos en cantidad.`}
              </p>
            </div>

            <div>
              <label htmlFor="peso" className="mb-1.5 block text-sm font-medium text-slate-700">
                Peso por paquete (kg)
              </label>
              <div className="flex items-center justify-between rounded-xl border border-slate-300 bg-white p-2 shadow-sm">
                <button
                  type="button"
                  onClick={() => setPesoKg(roundKg(state.pesoPorPaqueteKg - 0.5))}
                  disabled={state.pesoPorPaqueteKg <= 0.5}
                  aria-label="Bajar el peso medio kilo"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-lg font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>
                <span className="text-lg font-bold text-slate-900">
                  {state.pesoPorPaqueteKg.toLocaleString("es-AR", { maximumFractionDigits: 1 })} kg
                </span>
                <button
                  type="button"
                  onClick={() => setPesoKg(roundKg(state.pesoPorPaqueteKg + 0.5))}
                  disabled={state.pesoPorPaqueteKg >= 1000}
                  aria-label="Subir el peso medio kilo"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-lg font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <p className="mt-1.5 text-sm text-slate-500">
                {state.cantidad === 1
                  ? `Peso total de tu envío: ${state.pesoPorPaqueteKg.toLocaleString("es-AR", { maximumFractionDigits: 1 })} kg.`
                  : `Peso total estimado: ${pesoTotal.toLocaleString("es-AR", { maximumFractionDigits: 1 })} kg (${state.cantidad} × ${state.pesoPorPaqueteKg.toLocaleString("es-AR", { maximumFractionDigits: 1 })} kg).`}
              </p>
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleCotizar}
              className="w-full rounded-xl bg-teal-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
            >
              Cotizar mi envío
            </button>
          </div>
        </div>
      </section>

      <section className="mt-14 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              n: "01",
              t: "Cotizá",
              d: "Ingresás origen, destino, cantidad y peso; comparamos transportistas por precio y tiempo.",
            },
            {
              n: "02",
              t: "Pagá",
              d: "Recibís un link de pago y abonás sin WhatsApp, llamados ni formularios.",
            },
            {
              n: "03",
              t: "Seguí",
              d: "Nosotros coordinamos la recolección y el seguimiento queda simplificado.",
            },
          ].map((s) => (
            <div key={s.n} className="flex gap-4">
              <span className="text-2xl font-bold text-teal-200">{s.n}</span>
              <div>
                <h3 className="font-semibold text-slate-900">{s.t}</h3>
                <p className="mt-1 text-sm text-slate-500">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 rounded-2xl bg-teal-50 px-5 py-4 text-sm text-teal-900">
          <strong>Nuestro diferencial:</strong> no competimos con los transportistas, los integramos.
          Somos la capa simple que hoy no existe para que un emprendedor chico mande un paquete
          sin cotizar en cinco lugares distintos.
        </p>
      </section>
    </div>
  );
}