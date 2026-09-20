import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ShippingProvider } from "@/components/shipping-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PaqueteNEA · Enviá sin llamar a nadie",
  description:
    "Cotizá, pagá y seguí tus envíos entre Resistencia, Corrientes y Fontana en minutos, con transportistas regionales integrados.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ShippingProvider>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </ShippingProvider>
      </body>
    </html>
  );
}