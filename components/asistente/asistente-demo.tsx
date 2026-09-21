"use client";

import { ChatBox } from "@/components/asistente/chat-box";
import { Dashboard } from "@/components/asistente/dashboard";
import { RubroOnboarding } from "@/components/asistente/rubro-onboarding";
import { rubroPorId } from "@/lib/asistente";
import { useAsistente } from "@/components/asistente-provider";

function DemoContent() {
  const { rubroId, setRubro } = useAsistente();
  const rubro = rubroPorId(rubroId);

  if (!rubro) {
    return (
      <div className="pb-4">
        <RubroOnboarding />
      </div>
    );
  }

  return (
    <>
      <section className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
          Eje 3 · IA y automatización para microemprendedores
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Tu negocio en WhatsApp, <span className="text-violet-600">organizado solo</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Escribí el pedido que te pasaron por chat y la IA lo convierte automáticamente en un pedido
          con pago, entrega y tareas listas para gestionar. Solo acepta productos de tu rubro:{" "}
          <strong>{rubro.emoji} {rubro.nombre}</strong>.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-700">
            {rubro.emoji} {rubro.nombre}
          </span>
          <button
            type="button"
            onClick={() => setRubro("")}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          >
            Cambiar rubro
          </button>
        </div>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <span className="text-violet-500">✓</span> Probá el ejemplo de {rubro.nombre.toLowerCase()} o escribí el tuyo
          </li>
          <li className="flex items-center gap-2">
            <span className="text-violet-500">✓</span> Si mencionás productos de otro rubro, se rechaza
          </li>
          <li className="flex items-center gap-2">
            <span className="text-violet-500">✓</span> Los pedidos se guardan en tu navegador
          </li>
        </ul>
      </section>

      <section className="mt-10 grid min-w-0 gap-6 md:grid-cols-2">
        <ChatBox />
        <Dashboard />
      </section>
    </>
  );
}

export function AsistenteDemo() {
  return <DemoContent />;
}