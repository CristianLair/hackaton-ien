"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/components/auth-provider";
import { useAsistente } from "@/components/asistente-provider";
import { ejemploParaRubro } from "@/lib/asistente";

type Fase = {
  titulo: string;
  desc: string;
};

const FASES: Fase[] = [
  {
    titulo: "Asistente IA: iniciás sesión",
    desc: "Entramos con la usuaria de demostración simulada, sin registros reales.",
  },
  {
    titulo: "Elegís el rubro de tu negocio",
    desc: "En Perfumería el asistente solo acepta productos de perfumería.",
  },
  {
    titulo: "Cargás el pedido por chat",
    desc: "La IA lo convierte en pedido con cliente, pago, entrega y tarea.",
  },
  {
    titulo: "Pedido registrado",
    desc: "Quedó en el dashboard, listo para editar a mano si faltan datos.",
  },
];

const PAUSA_DELAY = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

type DemoContextValue = {
  corriendo: boolean;
  iniciar: () => void;
  detener: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

function setReactInputValue(el: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
  if (setter) setter.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const { login } = useAuth();
  const { setRubro } = useAsistente();

  const [corriendo, setCorriendo] = useState(false);
  const [fase, setFase] = useState<number | null>(null);
  const [terminado, setTerminado] = useState(false);
  const cancelRef = useRef(false);

  const esperarInput = async (intentos = 40): Promise<HTMLInputElement | null> => {
    for (let i = 0; i < intentos; i++) {
      if (cancelRef.current) return null;
      const el = document.querySelector<HTMLInputElement>('input[placeholder*="Escribí el pedido"]');
      if (el) return el;
      await PAUSA_DELAY(150);
    }
    return null;
  };

  const ejecutar = async () => {
    setCorriendo(true);
    setFase(0);
    setTerminado(false);

    // Paso 1 · Iniciar sesión
    await PAUSA_DELAY(500);
    login();
    await PAUSA_DELAY(3000);

    // Paso 2 · Elegir rubro
    if (cancelRef.current) return;
    setFase(1);
    setRubro(null);
    await PAUSA_DELAY(400);
    setRubro("perfumeria");
    await PAUSA_DELAY(3000);

    // Paso 3 · Cargar pedido por chat
    if (cancelRef.current) return;
    setFase(2);
    const input = await esperarInput();
    if (input) {
      setReactInputValue(input, ejemploParaRubro("perfumeria"));
      await PAUSA_DELAY(600);
      document.querySelector<HTMLButtonElement>('button[aria-label="Enviar pedido"]')?.click();
    }
    await PAUSA_DELAY(3000);

    // Paso 4 · Pedido registrado
    if (cancelRef.current) return;
    setFase(3);
    await PAUSA_DELAY(3000);
    setTerminado(true);
  };

  const iniciar = () => {
    if (cancelRef.current) return;
    cancelRef.current = false;
    void ejecutar().catch(() => {
      cancelRef.current = true;
      setCorriendo(false);
      setFase(null);
      setTerminado(false);
    });
  };

  const detener = () => {
    cancelRef.current = true;
    setCorriendo(false);
    setFase(null);
    setTerminado(false);
  };

  return (
    <DemoContext.Provider value={{ corriendo, iniciar, detener }}>
      {children}
      {corriendo && (
        <DemoOverlay fase={fase} terminado={terminado} total={FASES.length} onDetener={detener} />
      )}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo debe usarse dentro de <DemoProvider />");
  return ctx;
}

function DemoOverlay({
  fase,
  terminado,
  total,
  onDetener,
}: {
  fase: number | null;
  terminado: boolean;
  total: number;
  onDetener: () => void;
}) {
  const actual = fase !== null ? FASES[fase] : null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] flex items-start justify-end p-4 sm:p-5">
      <div className="pointer-events-auto w-full max-w-sm rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-600" />
            Demo en vivo · Asistente IA
          </span>
          {!terminado && fase !== null && fase < total - 1 && (
            <span className="text-xs font-medium text-slate-400">
              Paso {fase + 1} de {total}
            </span>
          )}
        </div>

        {terminado ? (
          <div className="px-4 py-3">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Demo finalizada 🎉
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              El asistente convirtió el mensaje del chat en un pedido organizado con pago, entrega y
              tarea. Seguí explorando a mano.
            </p>
          </div>
        ) : actual ? (
          <div className="px-4 py-3">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              {actual.titulo}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{actual.desc}</p>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
          <div className="flex gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-5 rounded-full transition-colors ${
                  fase !== null && i <= fase ? "bg-violet-600" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onDetener}
            className="shrink-0 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-300 hover:text-red-600"
          >
            {terminado ? "Cerrar demo" : "Terminar demo"}
          </button>
        </div>
      </div>
    </div>
  );
}