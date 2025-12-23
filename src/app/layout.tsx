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

/*    CONFIGURACIÓN GENERAL */

// ⚠️ En producción debe ser la url que se utilice para el sitio
const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://fooddeliveryday.com.ar" || "http://localhost:3000"
);

/* STORY — FUENTE ÚNICA DE VERDAD (SEO / GEO */

const storyText =
  "Food Delivery Day 2026 es el evento estratégico más importante de Latinoamérica dedicado a revolucionar el ecosistema del delivery y la gastronomía digital. Programado para el 11 de marzo de 2026 en Jano's Costanera, Buenos Aires, este encuentro se consolida como el punto de reunión definitivo para dueños de restaurantes, gerentes de logística y líderes de plataformas tecnológicas. Una plataforma única para el networking de alto nivel, enfocada en tendencias críticas como la optimización de la última milla, el auge de las dark kitchens y las estrategias de rentabilidad en apps.";

/* SEO DERIVADO DEL STORY */

const seoTitle = "Food Delivery Day 2026 en Buenos Aires";

const seoDescription =
  "Food Delivery Day 2026 es el evento de delivery y gastronomía digital que se realizará el 11 de marzo en Jano's Costanera, Buenos Aires, con foco en networking y tendencias.";

/*    METADATA — SEO + GEO + OPEN GRAPH  */

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: seoTitle,
  description: seoDescription,
  keywords: [
    "food delivery day 2026",
    "food delivery day",
    "evento delivery",
    "evento gastronomía digital",
    "evento food delivery",
    "evento delivery argentina",
    "evento delivery buenos aires",
    "gastronomía digital",
    "ecosistema delivery",
    "apps de delivery",
    "rentabilidad en apps de delivery",
    "plataformas de delivery",
    "logística para delivery",
    "última milla",
    "optimización última milla",
    "dark kitchens",
    "cocinas fantasma",
    "dueños de restaurantes",
    "gerentes de logística",
    "industria gastronómica digital",
    "evento foodtech argentina",
    "jano's costanera eventos",
    "eventos empresariales buenos aires",
  ],
  authors: [{ name: "Food Delivery Day" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website", // requerido explícitamente por el ticket
    title: seoTitle,
    description: seoDescription,
    url: siteUrl.toString(),
    siteName: "Food Delivery Day 2026",
    locale: "es_AR",
    images: [
      {
        url: "/og-image.png", // debe existir en /public
        width: 1200,
        height: 630,
        alt: "Food Delivery Day 2026 en Buenos Aires",
      },
    ],
  },
};

/*    ROOT LAYOUT  */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /*    JSON-LD — EVENT (Schema.org)  */

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Food Delivery Day 2026",
    description:
      "Evento de delivery y gastronomía digital que se realizará el 11 de marzo de 2026 en Jano's Costanera, Buenos Aires, enfocado en networking y tendencias del sector.",
    eventAttendanceMode:
      "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    startDate: "2026-03-11T09:00:00-03:00",
    endDate: "2026-03-11T18:00:00-03:00",
    location: {
      "@type": "Place",
      name: "Jano's Costanera",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Buenos Aires",
        addressCountry: "AR",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Food Delivery Day",
      url: siteUrl.toString(),
    },
    url: siteUrl.toString(),
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
