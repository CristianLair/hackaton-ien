"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/components/auth-provider";
import { LoginScreen } from "@/components/asistente/login-screen";
import { AsistenteDemo } from "@/components/asistente/asistente-demo";

export function AsistenteShell({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();

  if (!usuario) return <LoginScreen />;

  return (
    <>
      <AsistenteDemo />
      {children}
    </>
  );
}