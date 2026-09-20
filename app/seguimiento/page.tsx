"use client";

import { useRouter } from "next/navigation";
import { CARRIERS, formatARS, pesoTotalEnvio, quote, type ShippingStatus } from "@/lib/shipping";
import { useShipping } from "@/components/shipping-provider";
import { EmptyState } from "@/components/empty-state";

function fmt(date: Date): string {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(date);
}

export default function SeguimientoPage() {
  const router = useRouter();
  const { state, reset } = useShipping();

  if (!state.origen || !state.destino || !state.carrierId || !state.trackingNumber) {
    return (
      <EmptyState
        title="Tu envío todavía no está activo"
        description="Completá el pago para generar el número de seguimiento y el código de recolección."
        ctaHref="/pago"
        ctaLabel="Ir al pago"
      />
    );
  }

  const carrier = CARRIERS.find((c) => c.id === state.carrierId);
  if (!carrier) {
    return (
      <EmptyState
        title="No encontramos el transportista"
        description="Volvé a cotizar tu envío para continuar."
        ctaHref="/cotizacion"
        ctaLabel="Ver cotizaciones"
      />
    );
  }

  const createdAt = state.createdAt ? new Date(state.createdAt) : new Date();
  const status: ShippingStatus = state.status;
  const order: ShippingStatus[] = ["recolectado", "en_camino", "entregado"];
  const currentIdx = order.indexOf(status) === -1 ? 1 : order.indexOf(status);

  const steps = [
    {
      key: "recolectado" as const,
      label: "Recolectado",
      desc: `Paquete recolectado en ${state.origen} y en manos de ${carrier.name}`,
      time: `Hoy · ${fmt(createdAt)}`,
    },
    {
      key: "en_camino" as const,
      label: "En camino",
      desc: `Viajando de ${state.origen} a ${state.destino}`,
      time: `Estimado · 24 hs`,
    },
    {
      key: "entregado" as const,
      label: "Entregado",
      desc: `Entrega confirmada en ${state.destino}`,
      time: `Estimado · ${carrier.days} ${carrier.days === 1 ? "día" : "días"}`,
    },
  ];

  const pesoTotal = pesoTotalEnvio(state.pesoPorPaqueteKg, state.cantidad);
  const total = quote(carrier, pesoTotal);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Paso 4 de 4 · Seguimiento</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Tu envío está en camino
          </h1>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">N° de seguimiento</p>
          <p className="font-mono text-lg font-bold text-slate-900">{state.trackingNumber}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <ol className="relative space-y-0">
            {steps.map((s, i) => {
              const done = i < currentIdx;
              const current = i === currentIdx;
              return (
                <li key={s.key} className="relative flex gap-4 pb-8 last:pb-0">
                  {i < steps.length - 1 && (
                    <span
                      className={`absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 ${
                        i < currentIdx ? "bg-teal-500" : "bg-slate-200"
                      }`}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                      done
                        ? "border-teal-500 bg-teal-500 text-white"
                        : current
                          ? "border-teal-600 bg-teal-50 text-teal-700"
                          : "border-slate-200 bg-white text-slate-300"
                    }`}
                  >
                    {done ? (
                      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
                        <path
                          d="M3.5 8.5 6.5 11.5 12.5 5"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : current ? (
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-teal-600" aria-hidden="true" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
                    )}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <p
                        className={`font-semibold ${
                          current ? "text-teal-700" : done ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {s.label}
                        {current && (
                          <span className="ml-2 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-700">
                            En curso
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400">{s.time}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500">{s.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Detalle del envío</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Ruta</dt>
                <dd className="font-medium text-slate-800">
                  {state.origen} → {state.destino}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Transportista</dt>
                <dd className="font-medium text-slate-800">{carrier.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Paquetes</dt>
                <dd className="font-medium text-slate-800">{state.cantidad}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Peso</dt>
                <dd className="font-medium text-slate-800">
                  {state.pesoPorPaqueteKg.toLocaleString("es-AR", { maximumFractionDigits: 1 })} kg por
                  paquete · {pesoTotal.toLocaleString("es-AR", { maximumFractionDigits: 1 })} kg totales
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-slate-100 pt-3">
                <dt className="text-slate-500">Total pagado</dt>
                <dd className="font-bold text-slate-900">{formatARS(total)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl bg-teal-600 p-6 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-100">
              Código de recolección
            </p>
            <p className="mt-1 font-mono text-2xl font-bold">
              REC-{String(state.trackingNumber.replace("NEA-", "")).slice(0, 4)}
            </p>
            <p className="mt-2 text-sm text-teal-50">
              Mostralo al transportista al momento de recolectar tu paquete.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              reset();
              router.push("/");
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Realizar otro envío
          </button>
        </div>
      </div>
    </div>
  );
}