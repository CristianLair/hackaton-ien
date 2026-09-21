"use client";

import { useAuth } from "@/components/auth-provider";

export function LoginScreen() {
  const { login } = useAuth();

  return (
    <section className="mx-auto max-w-3xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
        Eje 3 · IA y automatización para microemprendedores
      </span>
      <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Tu negocio en WhatsApp, <span className="text-violet-600">organizado solo</span>.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
        Entrá con la usuaria de demostración para probar el asistente. Es una demo simulada, sin
        registros reales.
      </p>

      <div className="mx-auto mt-8 max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Iniciar sesión</p>
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              readOnly
              value="demo@paquetenea.com"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 shadow-sm outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Contraseña</span>
            <input
              type="password"
              readOnly
              value="••••••••"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 shadow-sm outline-none"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={login}
          className="mt-5 w-full rounded-xl bg-violet-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-violet-700"
        >
          Entrar como usuaria demo
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">
          Demo sin backend: la sesión se guarda en tu navegador.
        </p>
      </div>
    </section>
  );
}