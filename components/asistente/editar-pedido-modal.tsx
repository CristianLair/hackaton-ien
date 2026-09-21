"use client";

import { useEffect, useState } from "react";
import {
  PRODUCTOS,
  construyeTarea,
  faltantesDePedido,
  rubroPorId,
  type Entrega,
  type EstadoPago,
  type Pedido,
  type PedidoParsed,
  type Producto,
} from "@/lib/asistente";
import { useAsistente } from "@/components/asistente-provider";

type FilaProducto = {
  cantidad: number;
  nombre: string;
  variante: string;
};

type Props = {
  pedido: Pedido;
  onClose: () => void;
};

const FIELD_BASE =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

function leerFila(p: Producto): FilaProducto {
  return { cantidad: p.cantidad, nombre: p.nombre, variante: p.variante ?? "" };
}

export function EditarPedidoModal({ pedido, onClose }: Props) {
  const { updatePedido, rubroId } = useAsistente();
  const rubro = rubroPorId(rubroId);
  const sugerencias = rubro ? rubro.productos : PRODUCTOS;

  const [cliente, setCliente] = useState(pedido.cliente);
  const [filas, setFilas] = useState<FilaProducto[]>(pedido.productos.map(leerFila));
  const [estadoPago, setEstadoPago] = useState<EstadoPago>(pedido.estadoPago);
  const [modalidad, setModalidad] = useState<Entrega["modalidad"]>(pedido.entrega.modalidad);
  const [cuando, setCuando] = useState(pedido.entrega.cuando ?? "");
  const [notas, setNotas] = useState(pedido.notas ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const setFila = (i: number, patch: Partial<FilaProducto>) =>
    setFilas((fs) => fs.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));

  const agregarFila = () => setFilas((fs) => [...fs, { cantidad: 1, nombre: "", variante: "" }]);

  const usarSugerencia = (nombre: string) => {
    const vacia = filas.findIndex((f) => f.nombre.trim() === "");
    if (vacia !== -1) {
      setFila(vacia, { nombre });
    } else {
      agregarFila();
      setFilas((fs) => fs.map((f, idx) => (idx === fs.length - 1 ? { ...f, nombre } : f)));
    }
  };

  const guardar = () => {
    const productos = filas
      .filter((f) => f.nombre.trim() !== "")
      .map<PedidoParsed["productos"][number]>((f) => ({
        cantidad: Math.max(1, Number(f.cantidad) || 1),
        nombre: f.nombre.trim(),
        variante: f.variante.trim() ? f.variante.trim() : undefined,
      }));

    if (productos.length === 0) {
      setError("Agregá al menos un producto para guardar el pedido.");
      return;
    }
    if (cliente.trim() === "" || cliente.trim() === "Cliente nuevo") {
      setError("Completá el nombre del cliente.");
      return;
    }

    const data: PedidoParsed = {
      cliente: cliente.trim(),
      productos,
      estadoPago,
      entrega: { modalidad, cuando: cuando.trim() || undefined },
      tarea: construyeTarea(cliente.trim(), estadoPago, { modalidad, cuando: cuando.trim() || undefined }),
      notas: notas.trim() ? notas.trim() : undefined,
      raw: pedido.raw,
    };
    updatePedido(pedido.id, data);
    onClose();
  };

  const entrega: Entrega = { modalidad, cuando: cuando.trim() || undefined };
  const faltantes = faltantesDePedido({ cliente, productos: filas, estadoPago, entrega });
  const tareaPreview = construyeTarea(cliente || "Cliente nuevo", estadoPago, entrega);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Editar pedido ${pedido.id}`}
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-slate-900">Editar pedido #{String(pedido.id).padStart(3, "0")}</p>
            <p className="text-xs text-slate-500">
              {rubro ? `Catálogo: ${rubro.emoji} ${rubro.nombre}` : "Catálogo general"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar editor"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="max-h-[65vh] space-y-5 overflow-y-auto px-5 py-4">
          {faltantes.length > 0 && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Faltan datos: {faltantes.join(" · ")}. Cargalos a mano acá abajo.
            </p>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="edit-cliente">
              Cliente
            </label>
            <input
              id="edit-cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Nombre del cliente"
              className={FIELD_BASE}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Productos</p>
              <button
                type="button"
                onClick={agregarFila}
                className="rounded-full border border-violet-200 px-3 py-1 text-xs font-semibold text-violet-700 transition hover:border-violet-400"
              >
                + Agregar producto
              </button>
            </div>
            <datalist id="sugerencias-rubro">
              {sugerencias.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            <div className="space-y-2">
              {filas.map((fila, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={fila.cantidad}
                    onChange={(e) => setFila(i, { cantidad: Number(e.target.value) })}
                    aria-label={`Cantidad producto ${i + 1}`}
                    className="w-16 shrink-0 rounded-xl border border-slate-300 bg-white px-2 py-2 text-center text-sm text-slate-900 shadow-sm outline-none focus:border-violet-500"
                  />
                  <input
                    list="sugerencias-rubro"
                    value={fila.nombre}
                    onChange={(e) => setFila(i, { nombre: e.target.value })}
                    placeholder={rubro ? `Producto de ${rubro.nombre.toLowerCase()}` : "Producto"}
                    className={`${FIELD_BASE} min-w-0 flex-1`}
                  />
                  <input
                    value={fila.variante}
                    onChange={(e) => setFila(i, { variante: e.target.value })}
                    placeholder="Variante"
                    aria-label={`Variante producto ${i + 1}`}
                    className="hidden w-24 rounded-xl border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-violet-500 sm:block"
                  />
                  <button
                    type="button"
                    onClick={() => setFilas((fs) => fs.filter((_, idx) => idx !== i))}
                    aria-label={`Quitar producto ${i + 1}`}
                    className="shrink-0 rounded-full p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
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
              ))}
            </div>
            {rubro && (
              <div className="mt-2 flex flex-wrap gap-1">
                {rubro.productos.slice(0, 6).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => usarSugerencia(p)}
                    className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 transition hover:bg-violet-100 hover:text-violet-700"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-700">Estado de pago</p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["pagado", "💰 Pagado"],
                  ["pendiente", "⏳ Por cobrar"],
                  ["sin_dato", "❓ A confirmar"],
                ] as const
              ).map(([valor, label]) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => setEstadoPago(valor)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    estadoPago === valor
                      ? "border-violet-500 bg-violet-50 text-violet-700 ring-1 ring-violet-200"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-700">Entrega</p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["retira", "🛍️ Retira"],
                  ["envio", "🚚 Envío"],
                  ["indefinida", "❓ A coordinar"],
                ] as const
              ).map(([valor, label]) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => setModalidad(valor)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    modalidad === valor
                      ? "border-violet-500 bg-violet-50 text-violet-700 ring-1 ring-violet-200"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              value={cuando}
              onChange={(e) => setCuando(e.target.value)}
              placeholder={modalidad === "indefinida" ? "¿Cuándo se entrega?" : "Cuándo (ej.: mañana, viernes)"}
              className={`${FIELD_BASE} mt-2`}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="edit-notas">
              Notas
            </label>
            <input
              id="edit-notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Comentarios del pedido (opcional)"
              className={FIELD_BASE}
            />
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tarea automática</p>
            <p className="mt-1 text-sm text-slate-700">📋 {tareaPreview}</p>
          </div>

          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={guardar}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}