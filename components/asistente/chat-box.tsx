"use client";

import { useState } from "react";
import {
  describirPedido,
  ejemploParaRubro,
  faltantesDePedido,
  parsearPedido,
  productoFueraDeRubro,
  rubroPorId,
  validarPedido,
  formatoNumero,
  type Pedido,
} from "@/lib/asistente";
import { useAsistente } from "@/components/asistente-provider";
import { useVoiceInput } from "@/components/asistente/use-voice-input";
import { EditarPedidoModal } from "@/components/asistente/editar-pedido-modal";

type Mensaje = {
  role: "user" | "assistant";
  text?: string;
  pedidoId?: number;
  aviso?: string;
  error?: string;
};

const AVISO_NO_ENTENDIDO =
  "No interpreté todos los datos del mensaje. Revisá la tarjeta del pedido y completá lo que falte a mano.";
const MENSAJE_VACIO =
  "Escribí primero el pedido que querés registrar (ej.: “2 perfumes de 50ml…”).";
const MENSAJE_SIN_PRODUCTO =
  "No reconocí un producto de tu catálogo en ese mensaje, así que no pude armar el pedido. Mencioná el producto y la cantidad (ej.: “2 perfumes de 50ml”).";

export function ChatBox() {
  const { addPedido, rubroId, pedidos } = useAsistente();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const rubro = rubroPorId(rubroId);
  const ejemplo = ejemploParaRubro(rubroId);

  const { soporte, escuchando, error: errorVoz, parcial, toggle } = useVoiceInput((finalText) => {
    setInput((prev) => (prev ? `${prev} ${finalText}` : finalText));
  });

  const procesar = (texto: string) => {
    const trimmed = texto.trim();

    if (!trimmed) {
      setMensajes((m) => [...m, { role: "assistant", error: MENSAJE_VACIO }]);
      setInput("");
      return;
    }

    if (rubroId) {
      const fuera = productoFueraDeRubro(trimmed, rubroId);
      if (fuera) {
        const nombre = rubro?.nombre ?? "tu rubro";
        setMensajes((m) => [
          ...m,
          { role: "user", text: trimmed },
          {
            role: "assistant",
            error: `Tu catálogo es de ${nombre}: ese pedido menciona un producto de otro rubro (“${fuera}”) y no lo generé. Escribí solo productos de ${nombre}.`,
          },
        ]);
        setInput("");
        return;
      }
    }

    const { pedido: parsed, completo } = parsearPedido(trimmed, rubroId);
    const validacion = validarPedido(trimmed, { pedido: parsed, completo });

    if (!validacion.valido) {
      setMensajes((m) => [
        ...m,
        { role: "user", text: trimmed },
        { role: "assistant", error: MENSAJE_SIN_PRODUCTO },
      ]);
      setInput("");
      return;
    }

    const pedido = addPedido(parsed);

    setMensajes((m) => [
      ...m,
      { role: "user", text: trimmed },
      {
        role: "assistant",
        text: describirPedido(pedido),
        pedidoId: pedido.id,
        aviso: completo ? undefined : AVISO_NO_ENTENDIDO,
      },
    ]);
    setInput("");
  };

  const editingPedido = editingId !== null ? pedidos.find((p) => p.id === editingId) : undefined;

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-violet-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-violet-100 bg-violet-50/70 px-5 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
            IA
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">Asistente Operativo</p>
            <p className="truncate text-xs text-slate-500">
              {rubro ? `${rubro.emoji} Solo ${rubro.nombre.toLowerCase()}` : "Escribí un pedido en lenguaje natural"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setInput(ejemplo)}
          className="shrink-0 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-700 transition hover:border-violet-400"
        >
          Probar ejemplo
        </button>
      </div>

      <div className="flex h-72 flex-col gap-3 overflow-y-auto p-4 lg:h-80">
        {mensajes.length === 0 && (
          <div className="m-auto max-w-xs text-center">
            <p className="text-sm font-medium text-slate-600">¿Cómo te ayudo?</p>
            <p className="mt-1 text-xs text-slate-400">Ej.: “{ejemplo}”</p>
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
                {m.pedidoId !== undefined && (
                  <PedidoCardLive
                    pedidoId={m.pedidoId}
                    onEdit={() => setEditingId(m.pedidoId!)}
                  />
                )}
                {m.aviso && (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    {m.aviso}
                  </p>
                )}
                {m.error && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {m.error}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-violet-100 p-3">
        {(escuchando || errorVoz) && (
          <p
            className={`mb-2 rounded-xl px-3 py-2 text-xs ${
              errorVoz
                ? "border border-red-200 bg-red-50 text-red-700"
                : "border border-violet-100 bg-violet-50 text-violet-700"
            }`}
          >
            {errorVoz ??
              (parcial
                ? `🎙️ Escuchando: “${parcial}…”`
                : "🎙️ Escuchando… hablá ahora (tocá el micrófono para detener)")}
          </p>
        )}
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") procesar(input);
            }}
            placeholder={
              escuchando ? "Escuchando…" : `Escribí el pedido que te pasaron por chat…`
            }
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
          <button
            type="button"
            onClick={toggle}
            disabled={!soporte}
            aria-pressed={escuchando}
            aria-label={escuchando ? "Detener dictado" : "Insertar texto por voz"}
            title={
              soporte
                ? escuchando
                  ? "Detener dictado"
                  : "Insertar texto por voz"
                : "Tu navegador no soporta dictado por voz"
            }
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
              escuchando
                ? "animate-pulse border-red-300 bg-red-50 text-red-600"
                : soporte
                  ? "border-violet-200 text-violet-600 hover:border-violet-400 hover:bg-violet-50"
                  : "cursor-not-allowed border-slate-200 text-slate-300"
            }`}
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="M8 1.5A2.5 2.5 0 0 0 5.5 4v4a2.5 2.5 0 0 0 5 0V4A2.5 2.5 0 0 0 8 1.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.5 7.5v.5a4.5 4.5 0 0 0 9 0v-.5M8 12.5v2M6 14.5h4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
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

      {editingPedido && (
        <EditarPedidoModal pedido={editingPedido} onClose={() => setEditingId(null)} />
      )}
    </div>
  );
}

function PedidoCardLive({
  pedidoId,
  onEdit,
}: {
  pedidoId: number;
  onEdit: () => void;
}) {
  const { pedidos } = useAsistente();
  const pedido = pedidos.find((p) => p.id === pedidoId);
  if (!pedido) return null;
  return <PedidoCard pedido={pedido} onEdit={onEdit} />;
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

function PedidoCard({ pedido, onEdit }: { pedido: Pedido; onEdit: () => void }) {
  const entrega =
    pedido.entrega.modalidad === "retira"
      ? `📅 Retira${pedido.entrega.cuando ? ` ${pedido.entrega.cuando}` : ""}`
      : pedido.entrega.modalidad === "envio"
        ? "🚚 Envío a domicilio"
        : "🚚 Entrega a coordinar";

  const faltantes = faltantesDePedido(pedido);

  return (
    <div
      className={`w-full min-w-0 rounded-2xl border bg-white p-3 shadow-sm ${
        faltantes.length > 0 ? "border-amber-300" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold text-slate-900">
          Pedido {formatoNumero(pedido.id)}
          <span className="ml-1.5 font-medium text-slate-500">{pedido.cliente}</span>
        </p>
        <div className="flex shrink-0 items-center gap-1">
          <BadgePago estado={pedido.estadoPago} />
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Editar pedido ${formatoNumero(pedido.id)}`}
            title="Editar pedido a mano"
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-violet-50 hover:text-violet-600"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
              <path
                d="M11 2.5l2.5 2.5L6 12.5 3 13.5l1-3L11 2.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
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
      {faltantes.length > 0 && (
        <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs text-amber-700">
          Faltan: {faltantes.join(" · ")} — cargalos a mano con el lápiz.
        </p>
      )}
      {pedido.notas && faltantes.length === 0 && (
        <p className="mt-2 text-xs text-amber-600">{pedido.notas}</p>
      )}
    </div>
  );
}