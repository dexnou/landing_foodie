// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Cambiá este dominio por el real cuando lo tengas
const siteUrl = new URL("https://fooddeliveryday.com.ar");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Food Delivery Day 2026 Argentina",
    template: "%s | Food Delivery Day 2026",
  },
  description:
    "Food Delivery Day 2026 es el evento que conecta restaurantes, plataformas de delivery y empresas de logística en Argentina.",
  keywords: [
    "food delivery day",
    "food delivery day 2026",
    "delivery",
    "restaurantes",
    "dark kitchens",
    "última milla",
    "evento gastronomía",
    "evento delivery argentina",
    "logística",
    "apps de delivery",
  ],
  openGraph: {
    title: "Food Delivery Day 2026 Argentina",
    description:
      "El evento más importante del ecosistema de delivery en Argentina. Conectando restaurantes, plataformas tecnológicas y el futuro de la gastronomía digital.",
    url: siteUrl,
    siteName: "Food Delivery Day",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/og-image.png", // poné este archivo en /public/og-image.png
        width: 1200,
        height: 630,
        alt: "Food Delivery Day 2026 - Evento de delivery en Argentina",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Food Delivery Day 2026 Argentina",
    description:
      "El evento que reúne a gastronómicos, plataformas y logística del delivery en Argentina.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/", // gracias al metadataBase esto se resuelve a https://fooddeliveryday.com.ar/
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning como ya lo tenías
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
