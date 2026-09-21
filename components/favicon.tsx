"use client";

import { usePathname } from "next/navigation";

export function Favicon() {
  const pathname = usePathname();
  const esAsistente = pathname === "/asistente";
  const href = esAsistente ? "/icon-192-violet.png" : "/icon-192.png";
  return (
    <link
      rel="icon"
      href={href}
      sizes="192x192"
      type="image/png"
      data-favicon="dynamic"
    />
  );
}