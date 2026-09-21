"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/components/auth-provider";
import { useDemo } from "@/components/demo/demo-provider";
import { LoginScreen } from "@/components/asistente/login-screen";
import { AsistenteDemo } from "@/components/asistente/asistente-demo";

export function AsistenteShell({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const { corriendo, iniciar, detener } = useDemo();

  return (
    <>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={corriendo ? detener : iniciar}
          title={corriendo ? "Detener la demo en vivo" : "Iniciar la demo en vivo"}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors ${
            corriendo ? "bg-red-500 hover:bg-red-600" : "bg-teal-600 hover:bg-teal-700"
          }`}
        >
          {corriendo ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              Detener demo en vivo
            </>
          ) : (
            <>
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                <path d="M5 3.5v9l7-4.5-7-4.5Z" />
              </svg>
              Iniciar demo en vivo
            </>
          )}
        </button>
      </div>

      {usuario ? (
        <>
          <AsistenteDemo />
          {children}
        </>
      ) : (
        <LoginScreen />
      )}
    </>
  );
}