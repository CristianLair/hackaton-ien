"use client";

import { RUBROS } from "@/lib/asistente";
import { useAsistente } from "@/components/asistente-provider";

export function RubroOnboarding() {
  const { setRubro } = useAsistente();

  return (
    <section className="mx-auto max-w-3xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
        Paso 1 · ¿A qué rubro te dedicás?
      </span>
      <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Contanos <span className="text-violet-600">qué vendés</span>.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
        Elegí el rubro de tu negocio para que el asistente solo acepte productos de tu catálogo. Si
        por ejemplo vendés perfumes, no mezclás remeras ni tazas.
      </p>

      <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
        {RUBROS.map((rubro) => (
          <button
            key={rubro.id}
            type="button"
            onClick={() => setRubro(rubro.id)}
            className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-violet-400 hover:ring-2 hover:ring-violet-100"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-xl transition group-hover:bg-violet-100">
              {rubro.emoji}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900">{rubro.nombre}</p>
              <p className="mt-0.5 text-sm text-slate-500">{rubro.descripcion}</p>
              <p className="mt-2 flex flex-wrap gap-1">
                {rubro.productos.slice(0, 4).map((p) => (
                  <span
                    key={p}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                  >
                    {p}
                  </span>
                ))}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}