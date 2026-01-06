// app/layout.tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import type { ReactNode } from "react"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

/*    CONFIGURACIÓN GENERAL */

// ⚠️ En producción debe ser la url que se utilice para el sitio
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://fooddeliveryday.com.ar")

const siteUrl = new URL(SITE_URL)

/* STORY — FUENTE ÚNICA DE VERDAD (SEO / GEO */

const storyText =
  "Food Delivery Day 2026 es el evento estratégico más importante de Latinoamérica dedicado a revolucionar el ecosistema del delivery y la gastronomía digital. Programado para el 11 de marzo de 2026 en Jano's Costanera, Buenos Aires, este encuentro se consolida como el punto de reunión definitivo para dueños de restaurantes, gerentes de logística y líderes de plataformas tecnológicas. Una plataforma única para el networking de alto nivel, enfocada en tendencias críticas como la optimización de la última milla, el auge de las dark kitchens y las estrategias de rentabilidad en apps."

/* SEO DERIVADO DEL STORY */

const seoTitle = "Food Delivery Day 2026 en Buenos Aires"

const seoDescription =
  "Food Delivery Day 2026 es el evento de delivery y gastronomía digital que se realizará el 11 de marzo en Jano's Costanera, Buenos Aires, con foco en networking y tendencias."

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
}

/*    ROOT LAYOUT  */
export default function RootLayout({ children }: { children: ReactNode }) {
  /*    JSON-LD — EVENT (Schema.org)  */

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Food Delivery Day 2026",
    description:
      "Evento de delivery y gastronomía digital que se realizará el 11 de marzo de 2026 en Jano's Costanera, Buenos Aires, enfocado en networking y tendencias del sector.",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
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
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* =========================================================
            TRACKING / TAGS (pedido del cliente)
            - GTM: script en <head> (beforeInteractive)
            - GTM noscript: justo después de abrir <body>
            - Meta Pixel + GA4: global en todo el sitio
           ========================================================= */}

        {/* 1) Google Tag Manager — va en <head> (Next lo inyecta al head con beforeInteractive) */}
        <Script
          id="gtm-head"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KDCKP9GL');`,
          }}
        />

        {/* (Opcional recomendado) JSON-LD (también lo dejamos en head) */}
        <Script
          id="jsonld-event"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* 2) Justo después de <body> — NOSCRIPTs */}
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KDCKP9GL"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Meta Pixel (noscript) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=616102904568579&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {/* 3) Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '616102904568579');
fbq('track', 'PageView');`,
          }}
        />

        {/* 4) Google tag (gtag.js) — GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y9T5PFK2E4"
          strategy="afterInteractive"
        />
        <Script
          id="ga4-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-Y9T5PFK2E4');`,
          }}
        />

        {/* CONTENIDO */}
        {children}
      </body>
    </html>
  )
}
