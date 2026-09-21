import type { Metadata } from "next";
import { AsistenteShell } from "@/components/asistente/asistente-shell";
import { Pitch } from "@/components/asistente/pitch";

export const metadata: Metadata = {
  title: "Asistente Operativo · IA para microemprendedores",
  description:
    "Convertí la información dispersa de tu negocio en pedidos, pagos, tareas y entregas organizadas automáticamente.",
};

export default function AsistentePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <AsistenteShell>
        <Pitch />
      </AsistenteShell>
    </div>
  );
}