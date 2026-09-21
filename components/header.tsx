"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShipping } from "@/components/shipping-provider";
import { useAuth } from "@/components/auth-provider";

export function Logo({ className = "", variant = "teal" }: { className?: string; variant?: "teal" | "violet" }) {
  const main = variant === "violet" ? "fill-violet-600" : "fill-teal-600";
  const dot = variant === "violet" ? "fill-violet-200" : "fill-teal-200";
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={`h-8 w-8 ${className}`}
    >
      <rect x="1.5" y="1.5" width="29" height="29" rx="8" className={main} />
      <path
        d="M9 17.5h9.5a4 4 0 0 0 0-8H11m-2 8 3.5 3.5M9 17.5l3.5-3.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22.5" cy="22.5" r="2.6" className={dot} />
    </svg>
  );
}

const STEPS = [
  { n: 1, label: "Carga de envío", href: "/" },
  { n: 2, label: "Cotización", href: "/cotizacion" },
  { n: 3, label: "Pago", href: "/pago" },
  { n: 4, label: "Seguimiento", href: "/seguimiento" },
] as const;

export function Header() {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();
  useShipping();

  const esAsistente = pathname === "/asistente";
  const currentIndex = STEPS.findIndex((s) => s.href === pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Logo variant={esAsistente ? "violet" : "teal"} />
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Paquete
            <span className={esAsistente ? "text-violet-600" : "text-teal-600"}>NEA</span>
          </span>
        </Link>

        {esAsistente ? (
          <nav aria-label="Secciones" className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              ← Envíos regionales
            </Link>
            <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              Asistente IA
            </span>
          </nav>
        ) : (
          <nav aria-label="Progreso del envío" className="flex items-center gap-4 sm:gap-5">
            {STEPS.map((s, i) => {
              const active = i === currentIndex;
              const done = currentIndex !== -1 && i < currentIndex;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group flex items-center gap-2"
                  aria-current={active ? "step" : undefined}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                      active
                        ? "border-teal-600 bg-teal-600 text-white"
                        : done
                          ? "border-teal-200 bg-teal-50 text-teal-700"
                          : "border-slate-300 bg-white text-slate-400 group-hover:border-slate-400"
                    }`}
                  >
                    {done ? (
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                        <path
                          d="M3.5 8.5 6.5 11.5 12.5 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      s.n
                    )}
                  </span>
                  <span
                    className={`hidden text-sm font-medium lg:inline ${
                      active ? "text-slate-900" : done ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        )}

        {esAsistente && usuario ? (
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="hidden items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5 shadow-sm sm:flex">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                {usuario.nombre.trim().charAt(0).toUpperCase()}
              </span>
              <span className="max-w-36 truncate text-xs font-medium text-slate-700">
                {usuario.nombre}
              </span>
            </span>
            <button
              type="button"
              onClick={logout}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-red-300 hover:text-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <Link
            href="/asistente"
            className={`hidden md:inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              esAsistente
                ? "bg-violet-600 text-white"
                : "border border-violet-200 text-violet-700 hover:border-violet-400"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
            Asistente IA
          </Link>
        )}
      </div>
    </header>
  );
}