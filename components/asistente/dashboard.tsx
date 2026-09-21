"use client";

import { useState } from "react";
import { resumenDiario, faltantesDePedido, formatoNumero, type Pedido } from "@/lib/asistente";
import { useAsistente } from "@/components/asistente-provider";
import { EditarPedidoModal } from "@/components/asistente/editar-pedido-modal";

export function Dashboard() {
  const { pedidos, removePedido, reset } = useAsistente();
  const [editingId, setEditingId] = useState<number | null>(null);
  const resumen = resumenDiario(pedidos);

  const totalUnidades = pedidos.reduce(
    (acc, p) => acc + p.productos.reduce((s, pr) => s + pr.cantidad, 0),
    0,
  );
  const pendientesCobro = pedidos.filter((p) => p.estadoPago === "pendiente").length;
  const pagados = pedidos.filter((p) => p.estadoPago === "pagado").length;
  const entregas = pedidos.filter((p) => p.entrega.modalidad !== "indefinida").length;

  const editingPedido = editingId !== null ? pedidos.find((p) => p.id === editingId) : undefined;

  return (
    <div className="flex h-full min-w-0 flex-col gap-4">
      <div className="grid min-w-0 grid-cols-2 gap-3">
        <Kpi icon="📦" label="Pedidos" value={String(pedidos.length)} sub={`${totalUnidades} unidades`} />
        <Kpi icon="💰" label="Pagos" value={String(pagados)} sub={`${pendientesCobro} por cobrar`} />
        <Kpi icon="📋" label="Tareas" value={String(pedidos.length)} sub="Preparar y coordinar" />
        <Kpi icon="🚚" label="Entregas" value={String(entregas)} sub="Retiro o envío" />
      </div>

      <div className="rounded-2xl border border-violet-200 bg-violet-50/60 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Resumen diario</p>
        <p className="mt-1 text-sm text-slate-700">
          {resumen.total === 0
            ? "Todavía no cargaste pedidos hoy."
            : `${resumen.total} pedidos · ${resumen.pagados} pagados · ${resumen.porCobrar} por cobrar · ${resumen.entregasHoy} entregas a coordinar.`}
        </p>
      </div>

      <div className="flex flex-1 flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <p className="text-sm font-semibold text-slate-900">Pedidos recientes</p>
          {pedidos.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-red-300 hover:text-red-600"
            >
              Vaciar demo
            </button>
          )}
        </div>
        <div className="flex min-h-32 max-h-72 flex-1 flex-col gap-2 overflow-y-auto p-3">
          {pedidos.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-slate-400">
              Cargá un pedido en el chat y aparece acá.
            </p>
          )}
          {[...pedidos].reverse().map((p, i) => (
            <div key={p.id} className={`rounded-xl border p-3 ${pedidoRing(p)}`}>
              <PedidoRow
                pedido={p}
                onDelete={() => removePedido(p.id)}
                onEdit={() => setEditingId(p.id)}
                index={i}
              />
            </div>
          ))}
        </div>
      </div>

      {editingPedido && (
        <EditarPedidoModal pedido={editingPedido} onClose={() => setEditingId(null)} />
      )}
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  sub,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-lg">{icon}</span>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      </div>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{sub}</p>
    </div>
  );
}

function pedidoRing(p: Pedido): string {
  if (faltantesDePedido(p).length > 0) return "border-amber-300";
  if (p.estadoPago === "pagado") return "border-teal-200";
  if (p.estadoPago === "pendiente") return "border-amber-200";
  return "border-slate-200";
}

function PedidoRow({
  pedido,
  onDelete,
  onEdit,
  index,
}: {
  pedido: Pedido;
  onDelete: () => void;
  onEdit: () => void;
  index: number;
}) {
  const entrega =
    pedido.entrega.modalidad === "retira"
      ? `Retira${pedido.entrega.cuando ? ` ${pedido.entrega.cuando}` : ""}`
      : pedido.entrega.modalidad === "envio"
        ? "Envío a domicilio"
        : "A coordinar";

  const faltantes = faltantesDePedido(pedido);

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-slate-900">{formatoNumero(pedido.id)}</p>
          <p className="truncate text-sm font-medium text-slate-700">{pedido.cliente}</p>
          <EstadoPagoDot estado={pedido.estadoPago} />
          {faltantes.length > 0 && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
              Faltan datos
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-slate-500">
          {pedido.productos.map((pr) => `${pr.cantidad} ${pr.nombre}`).join(" · ") || "sin productos"}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">🚚 {entrega} · 📋 {pedido.tarea}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Editar pedido ${index + 1}`}
          title="Editar pedido a mano"
          className="rounded-full p-1.5 text-slate-300 transition hover:bg-violet-50 hover:text-violet-600"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
            <path
              d="M11 2.5l2.5 2.5L6 12.5 3 13.5l1-3L11 2.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Eliminar pedido ${index + 1}`}
          className="shrink-0 rounded-full p-1 text-slate-300 transition hover:bg-red-50 hover:text-red-500"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
            <path
              d="M3 4h10M6.5 4V2.75A.75.75 0 0 1 7.25 2h1.5a.75.75 0 0 1 .75.75V4m2.5 0-.6 8.1a1 1 0 0 1-1 .9H6.85a1 1 0 0 1-1-.9L5.25 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function EstadoPagoDot({ estado }: { estado: Pedido["estadoPago"] }) {
  if (estado === "pagado") {
    return (
      <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-800">
        Pagado
      </span>
    );
  }
  if (estado === "pendiente") {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
        Por cobrar
      </span>
    );
  }
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
      A confirmar
    </span>
  );
}