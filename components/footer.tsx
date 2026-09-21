import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-sm text-slate-500 sm:flex-row sm:text-left">
        <div>
          <p>© 2026 PaqueteNEA — Demo para Hackathon IEN · Eje 3: Innovación Tecnológica y Startups</p>
          <p>Integramos transportistas regionales del NEA.</p>
        </div>
        <Link
          href="/asistente"
          className="font-medium text-violet-600 transition hover:text-violet-800"
        >
          Asistente Operativo con IA →
        </Link>
      </div>
    </footer>
  );
}