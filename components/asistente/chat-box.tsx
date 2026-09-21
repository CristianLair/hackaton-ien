"use client";

import { useState } from "react";
import {
  describirPedido,
  parsearPedido,
  PEDIDO_EJEMPLO,
  formatoNumero,
  type Pedido,
} from "@/lib/asistente";
import { useAsistente } from "@/components/asistente-provider";

type Mensaje = {
  role: "user" | "assistant";
  text: string;
  pedido?: Pedido;
  aviso?: string;
};

const AVISO_NO_ENTENDIDO =
  "No interpreté todos los datos del mensaje. Revisá la tarjeta del pedido y completá lo que falte a mano.";

export function ChatBox() {
  const { addPedido } = useAsistente();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState("");

  const procesar = (texto: string) => {
    const trimmed = texto.trim();
    if (!trimmed) return;

    const { pedido: parsed, completo } = parsearPedido(trimmed);
    const pedido = addPedido(parsed);

    setMensajes((m) => [
      ...m,
      { role: "user", text: trimmed },
      {
        role: "assistant",
        text: describirPedido(pedido),
        pedido,
        aviso: completo ? undefined : AVISO_NO_ENTENDIDO,
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-violet-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-violet-100 bg-violet-50/70 px-5 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
            IA
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">Asistente Operativo</p>
            <p className="truncate text-xs text-slate-500">Escribí un pedido en lenguaje natural</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setInput(PEDIDO_EJEMPLO)}
          className="shrink-0 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-700 transition hover:border-violet-400"
        >
          Probar ejemplo
        </button>
      </div>

      <div className="flex h-72 flex-col gap-3 overflow-y-auto p-4 lg:h-80">
        {mensajes.length === 0 && (
          <div className="m-auto max-w-xs text-center">
            <p className="text-sm font-medium text-slate-600">¿Cómo te ayudo?</p>
            <p className="mt-1 text-xs text-slate-400">
              Ej.: “Sofi pidió 2 remeras negras talle M, las retira mañana y ya me transfirió.”
            </p>
          </div>
        )}
        {mensajes.map((m, i) => (
          <div key={i}>
            {m.role === "user" ? (
              <div className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-md bg-violet-600 px-4 py-2.5 text-sm text-white shadow-sm">
                  {m.text}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="max-w-[90%] rounded-2xl rounded-bl-md border border-violet-100 bg-violet-50 px-4 py-2.5 text-sm text-slate-700">
                  {m.text}
                </p>
                {m.pedido && <PedidoCard pedido={m.pedido} />}
                {m.aviso && (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    {m.aviso}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-violet-100 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") procesar(input);
          }}
          placeholder="Escribí el pedido que te pasaron por chat…"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />
        <button
          type="button"
          onClick={() => procesar(input)}
          aria-label="Enviar pedido"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm transition-colors hover:bg-violet-700"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
            <path
              d="M14 2 7.5 8.5M14 2l-4.5 12-2-5.5L2 6.5 14 2Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function BadgePago({ estado }: { estado: Pedido["estadoPago"] }) {
  const map = {
    pagado: { label: "Pagado", cls: "bg-teal-100 text-teal-800" },
    pendiente: { label: "Por cobrar", cls: "bg-amber-100 text-amber-800" },
    sin_dato: { label: "Pago a confirmar", cls: "bg-slate-100 text-slate-600" },
  } as const;
  const m = map[estado];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${m.cls}`}>
      {estado === "pagado" ? "💰" : estado === "pendiente" ? "⏳" : "❓"} {m.label}
    </span>
  );
}

function PedidoCard({ pedido }: { pedido: Pedido }) {
  const entrega =
    pedido.entrega.modalidad === "retira"
      ? `📅 Retira${pedido.entrega.cuando ? ` ${pedido.entrega.cuando}` : ""}`
      : pedido.entrega.modalidad === "envio"
        ? "🚚 Envío a domicilio"
        : "🚚 Entrega a coordinar";

  return (
    <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold text-slate-900">
          Pedido {formatoNumero(pedido.id)}
          <span className="ml-1.5 font-medium text-slate-500">{pedido.cliente}</span>
        </p>
        <BadgePago estado={pedido.estadoPago} />
      </div>
      <ul className="mt-2 space-y-0.5">
        {pedido.productos.map((pr, i) => (
          <li key={i} className="text-sm text-slate-700">
            · {pr.cantidad} {pr.nombre}
            {pr.variante ? ` (${pr.variante})` : ""}
          </li>
        ))}
      </ul>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
        <span>{entrega}</span>
        <span>📋 {pedido.tarea}</span>
      </div>
      {pedido.notas && <p className="mt-2 text-xs text-amber-600">{pedido.notas}</p>}
    </div>
  );
}