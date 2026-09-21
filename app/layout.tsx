import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ShippingProvider } from "@/components/shipping-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PwaRegister } from "@/components/pwa-register";
import { Favicon } from "@/components/favicon";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nova GO · Enviá sin llamar a nadie",
  description:
    "Cotizá, pagá y seguí tus envíos entre Resistencia, Corrientes y Fontana en minutos, con transportistas regionales integrados.",
  applicationName: "Nova GO",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Nova GO",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d9488",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ShippingProvider>
            <Header />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
            <PwaRegister />
            <Favicon />
          </ShippingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}