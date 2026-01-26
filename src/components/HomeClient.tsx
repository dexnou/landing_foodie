'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import BookingModal from '@/components/BookingModal';
import SponsorModal from '@/components/SponsorModal';
import RequestMagicLinkModal from '@/components/RequestMagicLinkModal';
import AccordionItem from '@/components/Accordion';
import Image from 'next/image';
import {
  ArrowRight, Play, MapPin, Calendar, CheckCircle2, Star, Shield,
  Award, Rocket, Mail, User, Briefcase, Phone, Building2,
  Loader2, Check, AlertCircle, ChevronDown, Flame, ExternalLink, Instagram, Ticket, Utensils, X
} from 'lucide-react';

// --- SCHEMA SEO JSON-LD ---
const EVENT_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Event",
      "@id": "https://www.fooddeliveryday.com.ar/#event",
      "name": "Food Delivery Day",
      "alternateName": "Food Delivery Day Argentina",
      "description": "Food Delivery Day es un evento presencial profesional enfocado en delivery, gastronomía digital, logística, ecommerce y tecnología aplicada al food service. Reúne a restaurantes, marcas, operadores logísticos y proveedores tecnológicos.",
      "startDate": "2026-03-11T09:00:00-03:00",
      "endDate": "2026-03-11T18:00:00-03:00",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "inLanguage": "es-AR",
      "location": {
        "@type": "Place",
        "@id": "https://www.fooddeliveryday.com.ar/#location",
        "name": "Jano’s Costanera",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Av. Rafael Obligado",
          "addressLocality": "Buenos Aires",
          "addressRegion": "CABA",
          "addressCountry": "AR"
        }
      },
      "organizer": {
        "@type": "Organization",
        "@id": "https://www.fooddeliveryday.com.ar/#organization",
        "name": "Food Delivery Day",
        "url": "https://www.fooddeliveryday.com.ar",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.fooddeliveryday.com.ar/logo.png"
        }
      },
      "image": [
        "https://www.fooddeliveryday.com.ar/og-image.jpg"
      ],
      "keywords": [
        "food delivery",
        "gastronomía digital",
        "logística",
        "restaurantes",
        "ecommerce",
        "tecnología gastronómica",
        "eventos foodtech"
      ],
      "audience": {
        "@type": "Audience",
        "audienceType": "Restaurantes, marcas de consumo masivo, operadores logísticos, empresas de tecnología, emprendedores foodtech"
      },
      "offers": [
        {
          "@type": "Offer",
          "@id": "https://www.fooddeliveryday.com.ar/#offer-early-bird",
          "name": "Entrada Early Bird",
          "url": "https://www.fooddeliveryday.com.ar",
          "price": "12000",
          "priceCurrency": "ARS",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-12-01T00:00:00-03:00",
          "paymentMethod": "https://schema.org/CreditCard",
          "acceptedPaymentMethod": {
            "@type": "PaymentMethod",
            "name": "Mercado Pago"
          }
        },
        {
          "@type": "Offer",
          "@id": "https://www.fooddeliveryday.com.ar/#offer-early-bird-lunch",
          "name": "Entrada Early Bird con almuerzo",
          "url": "https://www.fooddeliveryday.com.ar",
          "price": "20000",
          "priceCurrency": "ARS",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-12-01T00:00:00-03:00",
          "paymentMethod": "https://schema.org/CreditCard",
          "acceptedPaymentMethod": {
            "@type": "PaymentMethod",
            "name": "Mercado Pago"
          }
        }
      ]
    },
    {
      "@type": "Organization",
      "@id": "https://www.fooddeliveryday.com.ar/#organization",
      "name": "Food Delivery Day",
      "url": "https://www.fooddeliveryday.com.ar",
      "sameAs": [
        "https://www.linkedin.com/",
        "https://www.instagram.com/"
      ]
    },
    {
      "@type": "Place",
      "@id": "https://www.fooddeliveryday.com.ar/#location",
      "name": "Jano’s Costanera",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Av. Rafael Obligado",
        "addressLocality": "Buenos Aires",
        "addressRegion": "CABA",
        "addressCountry": "AR"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.fooddeliveryday.com.ar/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Qué es Food Delivery Day?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Food Delivery Day es un evento presencial que reúne a los principales actores del ecosistema de delivery, gastronomía digital, logística y tecnología aplicada al food service en Argentina."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cuándo se realiza Food Delivery Day?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Food Delivery Day se realiza el 11 de marzo de 2026, de 9:00 a 18:00 horas."
          }
        },
        {
          "@type": "Question",
          "name": "¿Dónde se realiza el evento?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "El evento se realiza de manera presencial en Jano’s Costanera, Buenos Aires, Argentina."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cuáles son los tipos de entrada y sus precios?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Hay dos tipos de entradas Early Bird: la entrada general con un valor de $12.000 ARS y la entrada Early Bird con almuerzo incluido con un valor de $20.000 ARS."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué incluye la entrada con almuerzo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "La entrada Early Bird con almuerzo incluye acceso completo al evento y un almuerzo durante la jornada en el lugar del evento."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cómo se pueden pagar las entradas?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Las entradas se pagan en pesos argentinos (ARS) y el medio de pago habilitado es Mercado Pago."
          }
        },
        {
          "@type": "Question",
          "name": "¿A quién está dirigido Food Delivery Day?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Está dirigido a restaurantes, marcas de consumo masivo, operadores logísticos, empresas de tecnología, emprendedores foodtech y profesionales del sector gastronómico."
          }
        },
        {
          "@type": "Question",
          "name": "¿El evento es presencial u online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Food Delivery Day es un evento 100% presencial."
          }
        }
      ]
    }
  ]
};

// Interfaz para las FAQs
interface FAQ {
  id: number;
  titulo: string;
  texto: string;
}

// Interfaz para Sponsor
interface Sponsor {
  id: number;
  nombre: string;
  archivo: string;
  nota?: string;
}

// --- DATOS HARDCODEADOS (FALLBACK) ---
const DEFAULT_FAQS: FAQ[] = [
  {
    id: 1,
    titulo: "¿Qué incluye la entrada?",
    texto: "La entrada incluye acceso completo al evento, participación en todas las charlas y paneles, networking con profesionales del sector y acceso a los stands de los sponsors. La opción con almuerzo incluye además el almuerzo gourmet durante el evento."
  },
  {
    id: 2,
    titulo: "¿Dónde se realiza el evento?",
    texto: "El evento se realizará en Jano's Costanera (Av. Costanera Rafael Obligado 6340, CABA). Un espacio exclusivo frente al río con estacionamiento privado y fácil acceso."
  },
  {
    id: 3,
    titulo: "¿Hay estacionamiento disponible?",
    texto: "Sí, el venue cuenta con estacionamiento privado para los asistentes. También hay opciones de transporte público cercanas que compartiremos en el email de confirmación."
  },
  {
    id: 4,
    titulo: "¿Puedo cambiar o cancelar mi entrada?",
    texto: "Podés solicitar cambios o cancelaciones hasta 7 días antes del evento. Para más información, contactanos por email a info@fooddeliveryday.com.ar"
  },
  {
    id: 5,
    titulo: "¿Quiénes participan como speakers?",
    texto: "Contamos con la participación de Country Managers de Rappi, Mercado Pago y Atomic Kitchens, además de un panel con gastronómicos exitosos en delivery y un cierre especial con el comediante Gerardo Freideles."
  }
];

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSponsorModalOpen, setSponsorModalOpen] = useState(false);
  const [isMagicLinkModalOpen, setMagicLinkModalOpen] = useState(false);
  const [isPlayingMobile, setIsPlayingMobile] = useState(false);
  const [isPlayingDesktop, setIsPlayingDesktop] = useState(false);

  // Estado para la barra de progreso (urgencia)
  const [soldPercentage, setSoldPercentage] = useState(0);

  // Estado para manejar el envío del formulario
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Estado para el newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Estados Dinámicos para FAQs
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);

  // Estado para Sponsors
  const [sponsorsList, setSponsorsList] = useState<Sponsor[]>([]);

  const VIDEO_ID = "SRynrXKk5lo";

  // --- CARGA DE DATOS AL INICIAR ---
  useEffect(() => {
    setTimeout(() => {
      setSoldPercentage(70);
    }, 500);

    const fetchData = async () => {
      // 1. Cargar FAQs con Fallback
      try {
        const resFaqs = await fetch('/api/faqs');
        if (resFaqs.ok) {
          const jsonFaqs = await resFaqs.json();

          console.log("🔥 RESPUESTA FAQs:", jsonFaqs);
          if (jsonFaqs.success && Array.isArray(jsonFaqs.data) && jsonFaqs.data.length > 0) {
            setFaqs(jsonFaqs.data);
          } else {
            setFaqs(DEFAULT_FAQS);
          }
        } else {
          setFaqs(DEFAULT_FAQS);
        }
      } catch (error) {
        console.error("Error conectando con FAQs, usando fallback:", error);
        setFaqs(DEFAULT_FAQS);
      } finally {
        setLoadingFaqs(false);
      }

      // 2. Cargar Sponsors
      try {
        const resSponsors = await fetch('/api/sponsors/list');
        if (resSponsors.ok) {
          const jsonSponsors = await resSponsors.json();
          if (jsonSponsors.success && Array.isArray(jsonSponsors.data)) {
            setSponsorsList(jsonSponsors.data);
          }
        }
      } catch (error) {
        console.error("Error cargando lista de sponsors:", error);
      }
    };

    fetchData();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewsletterStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });

      if (!response.ok) {
        throw new Error('Error al suscribirse');
      }

      setNewsletterStatus('success');
      setNewsletterEmail('');

      setTimeout(() => {
        setNewsletterStatus('idle');
      }, 3000);
    } catch (error) {
      console.error("Error suscribiendo al newsletter:", error);
      setNewsletterStatus('error');

      setTimeout(() => {
        setNewsletterStatus('idle');
      }, 3000);
    }
  };

  const handleSponsorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('loading');
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      nombre: String(formData.get('nombre') ?? ''),
      puesto: String(formData.get('puesto') ?? ''),
      empresa: String(formData.get('empresa') ?? ''),
      telefono: String(formData.get('telefono') ?? ''),
      email: String(formData.get('email') ?? ''),
      nota: String(formData.get('mensaje') ?? ''),
    };

    try {
      const res = await fetch('/api/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Error al enviar');
      setFormStatus('success');
      form.reset();
    } catch (error) {
      console.error(error);
      setFormStatus('error');
    }
  };

  return (
    <main className="bg-brand-dark min-h-screen text-white overflow-x-hidden font-sans selection:bg-brand-lime selection:text-brand-dark pb-24 md:pb-0">
      <Header onReserve={() => setModalOpen(true)} />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-28 md:pt-32 pb-10 md:pb-0 px-6">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-brand-lime/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />

        <div className="max-w-7xl mx-auto w-full flex flex-col md:grid md:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10">

          {/* COLUMNA IZQUIERDA */}
          <div className="w-full md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 rounded-full backdrop-blur-md mb-6 animate-in fade-in slide-in-from-left-4 duration-700">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-brand-lime" />
              <span className="text-[10px] md:text-xs font-bold tracking-wider text-gray-300 uppercase">11 DE MARZO, 2026</span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <MapPin className="w-3 h-3 md:w-4 md:h-4 text-brand-lime" />
              <span className="text-[10px] md:text-xs font-bold tracking-wider text-gray-300">JANO'S COSTANERA</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none mb-6 uppercase">
              FOOD DELIVERY <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-white">
                DAY 2026
              </span>
            </h1>

            {/* VIDEO MÓVIL */}
            <div className="w-full max-w-[320px] aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-gray-900 mb-8 md:hidden relative group mx-auto">
              <div className="absolute top-2 right-2 z-20 bg-brand-lime text-brand-dark text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
                ★ El evento del año
              </div>
              {!isPlayingMobile ? (
                <button
                  onClick={() => setIsPlayingMobile(true)}
                  className="absolute inset-0 w-full h-full flex items-center justify-center group cursor-pointer z-10"
                >
                  <Image src="/assets/images/video-cover.png" alt="Video" fill className="object-cover object-[center_20%] opacity-90" priority />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-30 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-2xl">
                    <Play className="w-6 h-6 text-white fill-current ml-1" />
                  </div>
                </button>
              ) : (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title="Video Mobile" allow="autoplay; encrypted-media" allowFullScreen style={{ border: 0 }}
                ></iframe>
              )}
            </div>

            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white/90 mb-8 max-w-2xl leading-tight animate-in fade-in slide-in-from-bottom-3 delay-100">
              EL EVENTO QUE DEFINE LA INDUSTRIA DEL DELIVERY EN LA ARGENTINA.
            </h2>

            {/* BARRA DE URGENCIA */}
            <div className="w-full max-w-md mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 mx-auto md:mx-0">
              <div className="flex justify-between items-end mb-2 px-1">
                <div className="flex items-center gap-1.5 text-brand-lime font-bold text-xs md:text-sm tracking-wide uppercase animate-pulse">
                  <Flame className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                  <span>¡Entradas volando!</span>
                </div>
                <span className="text-white font-mono text-xs opacity-80 font-bold tracking-wider">
                  {soldPercentage}% VENDIDO
                </span>
              </div>
              <div className="h-3 md:h-4 w-full bg-white/10 rounded-full overflow-hidden border border-white/10 p-[2px]">
                <div
                  className="h-full bg-gradient-to-r from-brand-lime/80 to-brand-lime rounded-full shadow-[0_0_20px_rgba(190,242,100,0.6)] transition-all duration-[1500ms] ease-out relative overflow-hidden"
                  style={{ width: `${soldPercentage}%` }}
                >
                  <div className="absolute top-0 left-0 bottom-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 text-right">Quedan pocos cupos disponibles para esta etapa.</p>
            </div>

            {/* BOTONES HERO */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16 justify-center md:justify-start">
              <button
                onClick={() => setModalOpen(true)}
                className="group relative bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black text-lg py-4 px-8 rounded-full shadow-[0_0_40px_-10px_rgba(190,242,100,0.3)] transition-all flex items-center justify-center gap-3 animate-pulse-fast hover:animate-none hover:scale-105 cursor-pointer uppercase min-h-[56px]"
              >
                COMPRAR AHORA
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                href="#agenda"
                className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 font-bold text-white transition-all text-sm uppercase tracking-wider flex items-center justify-center min-h-[56px]"
              >
                Ver Agenda
              </Link>
              <button
                onClick={() => setMagicLinkModalOpen(true)}
                className="px-8 py-4 rounded-full border-2 border-brand-lime/30 hover:border-brand-lime hover:bg-brand-lime/5 font-bold text-brand-lime transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 min-h-[56px]"
              >
                <Ticket className="w-5 h-5" />
                Mis Entradas
              </button>
            </div>

            {/* MAIN PARTNERS (FULL COLOR, SIN OPACIDAD, CENTRADOS MOBILE) */}
            <div className="w-full flex flex-col items-center md:items-start mt-8 lg:mt-10 mb-12">
              <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.2em] font-bold mb-6 text-center md:text-left">Main Partners</p>

              <div className="w-full flex flex-row items-center justify-center md:justify-start gap-6 md:gap-9">
                {/* Mercado Pago */}
                <div className="relative w-56 h-20 md:w-32 md:h-20">
                  <Image
                    src="/sponsors/mercadolibre.png"
                    alt="Mercado Pago"
                    fill
                    className="object-contain object-center md:object-left"
                  />
                </div>

                {/* Separador */}
                <div className="w-px h-10 md:h-14 bg-white/20" />

                {/* Rappi */}
                <div className="relative w-48 h-20 md:w-44 md:h-20">
                  <Image
                    src="/sponsors/rappii.png"
                    alt="Rappi"
                    fill
                    className="object-contain object-center md:object-left"
                  />
                </div>
              </div>

              <Link
                href="#sponsors"
                className="mt-6 text-sm text-gray-400 font-medium hover:text-brand-lime transition-colors border-b border-gray-600 hover:border-brand-lime pb-0.5"
              >
                Mirá todos los sponsors
              </Link>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="hidden md:flex md:col-span-5 justify-center md:justify-end relative">
            <div className="relative w-full max-w-[360px] aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-brand-lime/5 group animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="absolute top-4 right-4 z-20 bg-brand-lime text-brand-dark text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg transform rotate-2">
                ★ El evento del año
              </div>
              {!isPlayingDesktop ? (
                <button
                  onClick={() => setIsPlayingDesktop(true)}
                  className="absolute inset-0 w-full h-full flex items-center justify-center group cursor-pointer z-10 bg-gray-900"
                >
                  <Image src="/assets/images/video-cover.png" alt="Food Delivery Day Reel" fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <div className="relative z-30 w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                    <Play className="w-6 h-6 text-white fill-current ml-1" />
                  </div>
                </button>
              ) : (
                <iframe
                  className="w-full h-full animate-in fade-in duration-500"
                  src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1&controls=0&loop=1&playlist=${VIDEO_ID}`}
                  title="Food Delivery Day Aftermovie" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ border: 0 }}
                ></iframe>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STRIP INFLUENCERS
      <div className="w-full bg-brand-lime border-y border-brand-lime/20 relative z-20 py-4 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center text-brand-dark">
          <span className="font-black uppercase tracking-widest text-xs md:text-sm bg-black/10 px-3 py-1 rounded-full">
            CONFIRMADOS:
          </span>
          <div className="flex flex-wrap justify-center items-center gap-6 font-bold text-sm md:text-lg">
            <div className="flex items-center gap-1 group cursor-default">
              <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              <span className="group-hover:underline">@lachicadelbrunch</span>
            </div>
            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-brand-dark/20" />
            <div className="flex items-center gap-1 group cursor-default">
              <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              <span className="group-hover:underline">@clubdelbajon</span>
            </div>
            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-brand-dark/20" />
            <div className="flex items-center gap-1 group cursor-default">
              <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              <span className="group-hover:underline">@burgertify</span>
            </div>
            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-brand-dark/20" />
            <span className="opacity-70 italic font-medium">+50 Influencers invitados</span>
          </div>
        </div>
      </div> */}

      {/* 2. EXPERIENCE */}
      <section id="evento" className="py-24 px-6 relative border-t border-white/5 bg-black/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">CONECTANDO <span className="text-brand-lime">EL FUTURO</span></h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            Un espacio único donde dueños de restaurantes, gerentes de logística y líderes de tecnología comparten las claves del éxito en la era digital.
            <button onClick={() => setModalOpen(true)} className="text-brand-lime font-bold hover:underline ml-1 cursor-pointer">¡Reserva tu lugar! &gt;</button>
          </p>

          <div className="grid sm:grid-cols-3 gap-6 text-left mb-12">
            {[
              "Tendencias en Dark Kitchens y última milla.",
              "Estrategias de rentabilidad en apps.",
              "Networking real con los que hacen el mercado."
            ].map((item, i) => (
              <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                <CheckCircle2 className="w-6 h-6 text-brand-lime" />
                <span className="text-gray-300 text-sm font-medium leading-snug">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setModalOpen(true)}
              className="w-full md:w-auto bg-white/10 hover:bg-white/20 border border-brand-lime/50 text-brand-lime font-bold text-lg py-4 px-10 rounded-full transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-lg shadow-brand-lime/10 min-h-[56px] cursor-pointer"
            >
              COMPRAR AHORA
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* --- NUEVA SECCIÓN DE ENTRADAS (PRECIOS ACTUALIZADOS) --- */}
      <section id="entradas" className="py-24 px-6 bg-brand-dark relative border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase">Asegurá tu lugar</h2>
            <p className="text-gray-400">Elegí tu tipo de entrada y accedé al evento del año.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* 1. EARLY BIRD (ACTIVO) */}
            <div className="bg-brand-lime/5 border-2 border-brand-lime rounded-2xl p-8 relative flex flex-col transform md:-translate-y-4 shadow-[0_0_40px_-10px_rgba(190,242,100,0.2)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-lime text-brand-dark text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" /> Recomendado
              </div>

              <h3 className="text-2xl font-black text-white mb-2">Lote 1: Early Bird</h3>
              <p className="text-xs text-brand-lime/70 font-bold uppercase tracking-wider mb-6">¡Quedan pocas!</p>

              <div className="mb-6 space-y-3 border-b border-white/10 pb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Entrada General</span>
                  <span className="text-3xl font-black text-brand-lime">$12.000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white font-bold flex items-center gap-1">
                    <Utensils className="w-3 h-3 text-brand-lime" /> con Almuerzo
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 line-through font-medium">+$8.000</span>
                    <span className="text-2xl font-bold text-white">$20.000</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-white"><Check className="w-4 h-4 text-brand-lime mt-0.5 flex-shrink-0" /> <span className="font-bold">Acceso preferencial</span> al evento</li>
                <li className="flex items-start gap-3 text-sm text-white"><Check className="w-4 h-4 text-brand-lime mt-0.5 flex-shrink-0" /> Acceso a todas las charlas</li>
                <li className="flex items-start gap-3 text-sm text-white"><Check className="w-4 h-4 text-brand-lime mt-0.5 flex-shrink-0" /> Visita a todos los stands.</li>
                <li className="flex items-start gap-3 text-sm text-white"><Check className="w-4 h-4 text-brand-lime mt-0.5 flex-shrink-0" /> Participación after-office y standup</li>
              </ul>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black py-4 rounded-xl shadow-lg transition-all transform active:scale-95 uppercase text-sm flex items-center justify-center gap-2"
              >
                COMPRAR AHORA <Ticket className="w-4 h-4" />
              </button>
            </div>

            {/* 2. ANTICIPADAS (FUTURO) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative flex flex-col opacity-80">
              <div className="absolute top-4 right-4 bg-white/10 text-gray-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                Próximamente
              </div>
              <h3 className="text-xl font-bold text-white mb-6">Lote 2: Anticipadas</h3>

              <div className="mb-6 space-y-3 border-b border-white/10 pb-6 opacity-60">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Entrada General</span>
                  <span className="text-2xl font-black text-white">$20.000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400 font-bold flex items-center gap-1">
                    <Utensils className="w-3 h-3" /> con Almuerzo
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 font-medium">+$10.000</span>
                    <span className="text-xl font-bold text-gray-300">$30.000</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-white"><Check className="w-4 h-4 text-brand-lime mt-0.5 flex-shrink-0" /> <span className="font-bold">Acceso preferencial</span> al evento</li>
                <li className="flex items-start gap-3 text-sm text-white"><Check className="w-4 h-4 text-brand-lime mt-0.5 flex-shrink-0" /> Acceso a todas las charlas</li>
                <li className="flex items-start gap-3 text-sm text-white"><Check className="w-4 h-4 text-brand-lime mt-0.5 flex-shrink-0" /> Visita a todos los stands.</li>
                <li className="flex items-start gap-3 text-sm text-white"><Check className="w-4 h-4 text-brand-lime mt-0.5 flex-shrink-0" /> Participación after-office y standup</li>              </ul>
              <button disabled className="w-full bg-white/10 text-gray-500 font-bold py-4 rounded-xl cursor-not-allowed uppercase text-sm border border-white/5">
                Disponible al agotar Lote 1
              </button>
            </div>

            {/* 3. GENERAL (ÚLTIMA INSTANCIA - SIN ALMUERZO) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative flex flex-col opacity-60 grayscale">
              <div className="absolute top-4 right-4 bg-gray-700 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                Última Instancia
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-6">Lote 3: General</h3>

              <div className="mb-6 space-y-3 border-b border-white/10 pb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Entrada General</span>
                  <span className="text-2xl font-black text-gray-400">$25.000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-400 font-bold flex items-center gap-1">
                    <Utensils className="w-3 h-3" /> Almuerzo
                  </span>
                  <span className="text-xs font-bold text-red-400 border border-red-400/30 bg-red-400/10 px-2 py-1 rounded flex items-center gap-1">
                    <X className="w-3 h-3" /> NO DISPONIBLE
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-white"><Check className="w-4 h-4 text-brand-lime mt-0.5 flex-shrink-0" /> <span className="font-bold">Acceso preferencial</span> al evento</li>
                <li className="flex items-start gap-3 text-sm text-white"><Check className="w-4 h-4 text-brand-lime mt-0.5 flex-shrink-0" /> Acceso a todas las charlas</li>
                <li className="flex items-start gap-3 text-sm text-white"><Check className="w-4 h-4 text-brand-lime mt-0.5 flex-shrink-0" /> Visita a todos los stands.</li>
                <li className="flex items-start gap-3 text-sm text-white"><Check className="w-4 h-4 text-brand-lime mt-0.5 flex-shrink-0" /> Participación after-office y standup</li>              </ul>
              <button disabled className="w-full bg-gray-800 text-gray-500 font-bold py-4 rounded-xl cursor-not-allowed uppercase text-sm">
                Próximamente
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 3. AGENDA */}
      <section id="agenda" className="py-24 px-6 bg-brand-dark">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">AGENDA CONFIRMADA</h2>
            <p className="text-gray-400">Una jornada intensiva con los líderes del sector.</p>
          </div>

          <div className="space-y-2">
            <AccordionItem time="09:00" title="Apertura de Puertas">Vení a visitar los stands participantes, retira tu acreditación y comenzá el networking. <button onClick={() => setModalOpen(true)} className="text-brand-lime font-bold hover:underline ml-1 cursor-pointer">¡Asegurá tu entrada! &gt;</button></AccordionItem>
            <AccordionItem time="10:00 - 10:30" title="Panel: Gastronómicos & Delivery">Panel con 3 gastronómicos que supieron sacarle el jugo al delivery: <strong>Esteban Wolf</strong> (Founder & CEO Chocorisimo, Persicco, Guapaletas y Abuela Goye). <strong> Alejandro Cilley </strong> (CEO Tea Connection y Green Eat). <strong>Pablo Balan</strong> (Founder & CEO Mooi). <button onClick={() => setModalOpen(true)} className="text-brand-lime font-bold hover:underline ml-1 cursor-pointer">¡No te lo pierdas! &gt;</button></AccordionItem>
            <AccordionItem time="11:30 - 12:00" title="El delivery no te salva... pero puede cambiarte la vida">
              Charla junto a <strong>Uriel Krimer (Co-Founder & CEO de Atomic Kitchens)</strong>.
              +1.500 franquicias virtuales en LATAM: las decisiones que hicieron la diferencia.
              <span className="relative w-16 h-5 inline-block align-middle mx-2 translate-y-[-2px]">
                <Image src="/sponsors/atomic.png" alt="Atomic Kitchens" fill className="object-contain" />
              </span> <button onClick={() => setModalOpen(true)} className="text-brand-lime font-bold hover:underline ml-1 cursor-pointer">¡Inspirate! &gt;</button>
            </AccordionItem>
            <AccordionItem time="14:00 - 14:30" title="¿Por qué el delivery es la mejor publicidad del mundo?">
              Charla junto a <strong>Franco Lena (Country Manager Rappi Argentina)</strong>:
              Cuando el crecimiento va en modo Turbo.
              <span className="relative w-12 h-5 inline-block align-middle mx-2 translate-y-[-2px]">
                <Image src="/sponsors/rappii.png" alt="Rappi" fill className="object-contain" />
              </span> <button onClick={() => setModalOpen(true)} className="text-brand-lime font-bold hover:underline ml-1 cursor-pointer">¡Reservá ya! &gt;</button>
            </AccordionItem>
            <AccordionItem time="15:30 - 16:00" title="Un solo ecosistema, mil oportunidades para tu restaurante">
              Charla junto a <strong>Francisco Matarazzo (Head de Food Delivery en Mercado Pago Argentina)</strong>:
              El futuro no es para los más grandes, es para los que se animan
              <span className="relative w-16 h-5 inline-block align-middle mx-2 translate-y-[-2px]">
                <Image src="/sponsors/mercadolibre.png" alt="Mercado Pago" fill className="object-contain" />
              </span> <button onClick={() => setModalOpen(true)} className="text-brand-lime font-bold hover:underline ml-1 cursor-pointer">¡Sumate! &gt;</button>
            </AccordionItem>
            <AccordionItem time="16:30" title="After & Cierre a Puro Humor: Gerardo Freideles">Stand Up de cierre para terminar el día: La gastronomía contada por un gastronómico. </AccordionItem>
          </div>
        </div>
      </section>

      {/* 4. SPONSORS */}
      <section id="sponsors" className="py-24 px-6 bg-[#111] border-y border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-16 text-white uppercase tracking-tight">Nuestros Sponsors</h2>
          <div className="mb-16">
            <div className="flex items-center justify-center gap-2 mb-8 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <h3 className="text-yellow-400 font-bold text-xl tracking-widest uppercase">Sponsors Oro</h3>
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[{ name: "Rappi", src: "/sponsors/rappii.png" }, { name: "Mercado Pago", src: "/sponsors/mercadolibre.png" }].map((sponsor) => (
                <div key={sponsor.name} className="h-40 bg-white/5 border border-yellow-400/20 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer p-8 relative group">
                  <div className="relative w-full h-full"><Image src={sponsor.src} alt={sponsor.name} fill className="object-contain" /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-16">
            <div className="flex items-center justify-center gap-2 mb-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              <Shield className="w-5 h-5 text-gray-300" />
              <h3 className="text-gray-300 font-bold text-lg tracking-widest uppercase">Sponsors Plata</h3>
              <Shield className="w-5 h-5 text-gray-300" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {[{ name: "Atomic Kitchens", src: "/sponsors/atomic.png" }, { name: "Rokket", src: "/sponsors/rokket.png" }].map((sponsor) => (
                <div key={sponsor.name} className="h-32 bg-white/5 border border-gray-500/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all p-6 relative group">
                  <div className="relative w-full h-full"><Image src={sponsor.src} alt={sponsor.name} fill className="object-contain" /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-16 border-t border-white/5 pt-12">
            <div className="flex items-center justify-center gap-2 mb-8 drop-shadow-[0_0_12px_rgba(194,65,12,0.6)]">
              <Award className="w-5 h-5 text-orange-700" />
              <h3 className="text-orange-700 font-bold text-lg tracking-widest uppercase">Sponsors Bronce</h3>
              <Award className="w-5 h-5 text-orange-700" />
            </div>
            <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto opacity-90">
              {[{ name: "McCain", src: "/sponsors/mccainn.png" }, { name: "Guapaletas", src: "/sponsors/guapaletas.png" }, { name: "Mevak", src: "/sponsors/mevakk.png" }].map((sponsor) => (
                <div key={sponsor.name} className="h-28 w-60 bg-white/5 border border-orange-800/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all p-4 relative group">
                  <div className="relative w-full h-full"><Image src={sponsor.src} alt={sponsor.name} fill className="object-contain" /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-16">
            <div className="flex items-center justify-center gap-2 mb-8 drop-shadow-[0_0_15px_rgba(190,242,100,0.6)]">
              <Rocket className="w-5 h-5 text-brand-lime" />
              <h3 className="text-brand-lime font-bold text-lg tracking-widest uppercase">Sponsors Emprendedor</h3>
              <Rocket className="w-5 h-5 text-brand-lime" />
            </div>
            <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto opacity-90">
              {[{ name: "RapiBoy", src: "/sponsors/rapiboy.png" }, { name: "MasDelivery", src: "/sponsors/masdelivery.png" }, { name: "Food Packaging", src: "/sponsors/food-packaging.svg" }, { name: "SourcingUp", src: "/sponsors/sourcingup.png" }, { name: "OmAgency", src: "/sponsors/omagency.png" }].map((sponsor) => (
                <div key={sponsor.name} className="h-24 w-36 md:w-48 bg-white/5 border border-lime-400/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all p-3 relative group">
                  <div className="relative w-full h-full"><Image src={sponsor.src} alt={sponsor.name} fill className="object-contain" /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. FORMULARIO SPONSOR (BOTÓN) */}
      <section className="py-20 px-6 bg-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-lime/5 z-0"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-sm text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-4 uppercase text-white">¿Querés ser <span className="text-brand-lime">Sponsor</span>?</h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-10">
              Posicioná tu marca ante los líderes de la industria. Completá el formulario y te enviaremos nuestra propuesta comercial.
            </p>
            <button
              onClick={() => setSponsorModalOpen(true)}
              className="bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black py-4 px-10 rounded-xl transition-all uppercase tracking-wide shadow-[0_0_20px_rgba(190,242,100,0.4)]"
            >
              QUIERO SER SPONSOR
            </button>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="py-24 px-6 bg-brand-dark border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase">Preguntas Frecuentes</h2>
            <p className="text-gray-400">Todo lo que necesitás saber sobre el evento.</p>
          </div>
          <div className="space-y-2 min-h-[200px]">
            {loadingFaqs ? (
              <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-brand-lime animate-spin" /></div>
            ) : faqs.length > 0 ? (
              faqs.map((faq) => (<AccordionItem key={faq.id} title={faq.titulo}><span className="whitespace-pre-line">{faq.texto}</span></AccordionItem>))
            ) : (
              <p className="text-center text-gray-500">No hay preguntas frecuentes disponibles por el momento.</p>
            )}
          </div>
        </div>
      </section>

      {/* --- SEO & ABOUT --- */}
      <section className="py-20 px-6 bg-[#0a0a0a] border-t border-white/5 text-gray-500 text-sm leading-relaxed">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-white font-bold uppercase tracking-wider mb-6 text-xs">Sobre Food Delivery Day</h3>
          <p>
            <strong>Food Delivery Day 2026</strong> es el evento estratégico más importante de Latinoamérica dedicado a revolucionar el ecosistema del delivery y la gastronomía digital.
            Programado para el <strong>11 de marzo de 2026 en Jano's Costanera, Buenos Aires</strong>, este encuentro se consolida como el punto de reunión definitivo para dueños de restaurantes, gerentes de logística y líderes de plataformas tecnológicas.
            Una plataforma única para el networking de alto nivel, enfocada en tendencias críticas como la optimización de la última milla, el auge de las dark kitchens y las estrategias de rentabilidad en apps.
          </p>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(EVENT_SCHEMA) }}
          />
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-black pt-20 pb-10 px-6 border-t border-white/10" role="contentinfo">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10 text-sm text-gray-500">
          <div className="md:w-1/3 space-y-8">
            <div>
              <Link href="/" aria-label="Volver al inicio" className="inline-block group">
                <span className="font-bold text-white text-xl mb-4 tracking-tighter block group-hover:opacity-80 transition-opacity">FOOD DELIVERY <span className="text-brand-lime">DAY</span></span>
              </Link>
              <p className="leading-relaxed mt-2">Conectando el ecosistema de delivery, gastronomía y logística en Argentina. El punto de encuentro para liderar el futuro digital.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Suscribite a novedades</h4>
              {newsletterStatus === 'success' ? (
                <div className="flex items-center gap-2 text-green-400 text-xs"><Check className="w-4 h-4" /><span>¡Te suscribiste correctamente!</span></div>
              ) : newsletterStatus === 'error' ? (
                <div className="flex items-center gap-2 text-red-400 text-xs"><AlertCircle className="w-4 h-4" /><span>Error al suscribirse. Intentá nuevamente.</span></div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input type="email" placeholder="Tu email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} required disabled={newsletterStatus === 'loading'} className="bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs w-full focus:ring-1 focus:ring-brand-lime outline-none disabled:opacity-50" />
                  <button type="submit" disabled={newsletterStatus === 'loading'} className="bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-bold px-3 py-2 rounded-lg text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[50px]">{newsletterStatus === 'loading' ? <Loader2 className="w-3 h-3 animate-spin" /> : 'OK'}</button>
                </form>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-10 md:gap-20">
            <nav aria-label="Enlaces del evento" className="flex flex-col gap-4">
              <h3 className="text-white font-bold uppercase tracking-wider text-xs">El Evento</h3>
              <ul className="space-y-3">
                <li><Link href="#agenda" className="hover:text-brand-lime transition-colors">Agenda Completa</Link></li>
                <li><Link href="#sponsors" className="hover:text-brand-lime transition-colors">Sponsors & Partners</Link></li>
                <li><Link href="#faq" className="hover:text-brand-lime transition-colors">Preguntas Frecuentes</Link></li>
              </ul>
            </nav>
            <address className="flex flex-col gap-4 not-italic">
              <h3 className="text-white font-bold uppercase tracking-wider text-xs">Contacto</h3>
              <ul className="space-y-3">
                <li><a href="mailto:info@fooddeliveryday.com.ar" className="hover:text-brand-lime transition-colors flex items-center gap-2">info@fooddeliveryday.com.ar</a></li>
                <li><span className="block">Av. Costanera Rafael Obligado 6340, CABA</span></li>
              </ul>
            </address>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-700">
          <p>© 2026 Food Delivery Day Argentina. Todos los derechos reservados.</p>
          <nav aria-label="Legales" className="flex gap-6">
            <Link href="/politica-de-privacidad" className="hover:text-gray-500 transition-colors" rel="nofollow">Política de Privacidad</Link>
            <Link href="/terminos-y-condiciones" className="hover:text-gray-500 transition-colors" rel="nofollow">Términos y Condiciones</Link>
          </nav>
        </div>
      </footer>

      {/* --- STICKY MOBILE CTA (SOLO MOBILE) --- */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden animate-in slide-in-from-bottom-10 fade-in duration-700">
        <button
          onClick={() => setModalOpen(true)}
          className="w-full bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black text-lg py-4 rounded-full shadow-[0_0_20px_rgba(190,242,100,0.4)] border border-white/20 backdrop-blur-sm transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          RESERVAR AHORA <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <BookingModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      <SponsorModal
        isOpen={isSponsorModalOpen}
        onClose={() => setSponsorModalOpen(false)}
        onSubmit={handleSponsorSubmit}
        formStatus={formStatus}
        setFormStatus={setFormStatus}
      />

      {/* Modal Magic Link */}
      <RequestMagicLinkModal
        isOpen={isMagicLinkModalOpen}
        onClose={() => setMagicLinkModalOpen(false)}
      />
    </main>
  );
}