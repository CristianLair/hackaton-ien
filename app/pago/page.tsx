"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CARRIERS, formatARS, pesoTotalEnvio, quote, shortToken } from "@/lib/shipping";
import { useShipping } from "@/components/shipping-provider";
import { EmptyState } from "@/components/empty-state";
import { QrMock } from "@/components/qr-mock";

export default function PagoPage() {
  const router = useRouter();
  const { state, confirmPayment } = useShipping();
  const [copied, setCopied] = useState(false);

  if (!state.origen || !state.destino || !state.carrierId) {
    return (
      <EmptyState
        title="Falta la cotización"
        description="Elegí un transportista en la cotización para generar tu link de pago."
        ctaHref="/cotizacion"
        ctaLabel="Ver cotizaciones"
      />
    );
  }

  const carrier = CARRIERS.find((c) => c.id === state.carrierId);
  if (!carrier) {
    return (
      <EmptyState
        title="Transportista no encontrado"
        description="Volvé a cotizar tu envío para continuar."
        ctaHref="/cotizacion"
        ctaLabel="Ver cotizaciones"
      />
    );
  }

  const pesoTotal = pesoTotalEnvio(state.pesoPorPaqueteKg, state.cantidad);
  const total = quote(carrier, pesoTotal);
  const token = shortToken(
    `${state.origen}${state.destino}${carrier.id}${state.cantidad}${state.pesoPorPaqueteKg}`
  );
  const link = `https://pago.novago.ar/p/${token}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePagado = () => {
    confirmPayment();
    router.push("/seguimiento");
  };

  const rows = [
    { k: "Origen", v: state.origen },
    { k: "Destino", v: state.destino },
    { k: "Transportista", v: carrier.name },
    { k: "Paquetes", v: String(state.cantidad) },
    {
      k: "Peso",
      v: `${state.pesoPorPaqueteKg.toLocaleString("es-AR", { maximumFractionDigits: 1 })} kg por paquete · ${pesoTotal.toLocaleString("es-AR", { maximumFractionDigits: 1 })} kg totales`,
    },
    {
      k: "Tarifa base + por kg",
      v: `${formatARS(carrier.baseRate)} + ${formatARS(carrier.perKg)} × ${pesoTotal.toLocaleString("es-AR", { maximumFractionDigits: 1 })} kg`,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <p className="text-sm font-medium text-slate-500">Paso 3 de 4 · Pago</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
        Tu link de pago está listo
      </h1>
      <p className="mt-1 text-slate-500">
        Compartilo o pagá directo. En cuanto confirmemos, coordinamos la recolección.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Resumen del envío</h2>
          <dl className="mt-5 space-y-3">
            {rows.map((r) => (
              <div key={r.k} className="flex items-start justify-between gap-4 text-sm">
                <dt className="text-slate-500">{r.k}</dt>
                <dd className="text-right font-medium text-slate-800">{r.v}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <dt className="font-semibold text-slate-700">Total</dt>
              <dd className="text-2xl font-bold text-slate-900">{formatARS(total)}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            {["Mercado Pago", "Tarjetas", "Transferencia"].map((m) => (
              <span
                key={m}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-6">
              <QrMock seed={token} className="h-40 w-40 shrink-0 rounded-xl border border-slate-100" />
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Link de pago
                </p>
                <p className="mt-1 break-all font-mono text-sm font-semibold text-slate-900">
                  pago.novago.ar/p/{token}
                </p>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-500 hover:text-teal-700"
                >
                  {copied ? (
                    <>
                      <svg viewBox="0 0 16 16" className="h-4 w-4 text-teal-600" fill="none" aria-hidden="true">
                        <path
                          d="M3.5 8.5 6.5 11.5 12.5 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Copiado
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
                        <rect x="5.5" y="5.5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M10.5 5.5v-1a1.5 1.5 0 0 0-1.5-1.5H5a1.5 1.5 0 0 0-1.5 1.5v4A1.5 1.5 0 0 0 5 10h1" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                      Copiar link
                    </>
                  )}
                </button>
              </div>
            </div>
            <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              Demo: este QR y link son ilustrativos, no se procesa ningún pago real.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePagado}
            className="w-full rounded-xl bg-teal-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
          >
            Ya pagué · Generar seguimiento
          </button>
          <button
            type="button"
            onClick={() => router.push("/cotizacion")}
            className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Volver a cotizaciones
          </button>
        </div>
      </div>
    </div>
  );
}