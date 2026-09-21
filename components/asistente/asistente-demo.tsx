"use client";

import { AsistenteProvider } from "@/components/asistente-provider";
import { ChatBox } from "@/components/asistente/chat-box";
import { Dashboard } from "@/components/asistente/dashboard";

export function AsistenteDemo() {
  return (
    <AsistenteProvider>
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
          con pago, entrega y tareas listas para gestionar.
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <span className="text-violet-500">✓</span> Probá el ejemplo precargado o escribí el tuyo
          </li>
          <li className="flex items-center gap-2">
            <span className="text-violet-500">✓</span> Demo con IA simulada por reglas
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
    </AsistenteProvider>
  );
}