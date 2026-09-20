"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShipping } from "@/components/shipping-provider";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={`h-8 w-8 ${className}`}
    >
      <rect x="1.5" y="1.5" width="29" height="29" rx="8" className="fill-teal-600" />
      <path
        d="M9 17.5h9.5a4 4 0 0 0 0-8H11m-2 8 3.5 3.5M9 17.5l3.5-3.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22.5" cy="22.5" r="2.6" className="fill-teal-200" />
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
  useShipping();

  const currentIndex = STEPS.findIndex((s) => s.href === pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Logo />
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Paquete<span className="text-teal-600">NEA</span>
          </span>
        </Link>

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
      </div>
    </header>
  );
}