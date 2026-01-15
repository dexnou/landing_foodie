'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import BookingModal from '@/components/BookingModal';
import AccordionItem from '@/components/Accordion';
import Image from 'next/image';
import { 
  ArrowRight, Play, MapPin, Calendar, CheckCircle2, Star, Shield, 
  Award, Rocket, Mail, User, Briefcase, Phone, Building2, 
  Loader2, Check, AlertCircle 
} from 'lucide-react';

// Interfaz para las FAQs
interface FAQ {
  id: number;
  titulo: string;
  texto: string;
}

// Interfaz para Sponsor (si usamos API en futuro, por ahora hardcodeado en render)
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
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Estado para manejar el envío del formulario
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // Estado para el newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Estados Dinámicos para FAQs
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  
  // Estado para Sponsors (aunque por ahora usamos hardcodeado en el JSX, dejamos la estructura lista)
  const [sponsorsList, setSponsorsList] = useState<Sponsor[]>([]);

  const VIDEO_ID = "Kjtk3NeKy-A";

  // --- CARGA DE DATOS AL INICIAR ---
  useEffect(() => {
    const fetchData = async () => {
      // 1. Cargar FAQs con Fallback
      try {
        const resFaqs = await fetch('/api/faqs');
        if (resFaqs.ok) {
          const jsonFaqs = await resFaqs.json();

          console.log("🔥 RESPUESTA FAQs:", jsonFaqs); // <--- AGREGAR ESTO
          // Si trae datos, los usamos.
          if (jsonFaqs.success && Array.isArray(jsonFaqs.data) && jsonFaqs.data.length > 0) {
            setFaqs(jsonFaqs.data);
          } else {
            // Si viene vacío o success false, fallback
            console.log("API de FAQs vacía, usando fallback.");
            setFaqs(DEFAULT_FAQS);
          }
        } else {
          // Si la API falla (404, 500), fallback
          console.warn("Fallo al cargar FAQs, usando fallback.");
          setFaqs(DEFAULT_FAQS);
        }
      } catch (error) {
        console.error("Error conectando con FAQs, usando fallback:", error);
        setFaqs(DEFAULT_FAQS);
      } finally {
        setLoadingFaqs(false);
      }

      // 2. Cargar Sponsors (Opcional por ahora, solo preparamos el terreno)
      try {
        const resSponsors = await fetch('/api/sponsors/list');
        if (resSponsors.ok) {
          const jsonSponsors = await resSponsors.json();
          if (jsonSponsors.success && Array.isArray(jsonSponsors.data)) {
            setSponsorsList(jsonSponsors.data);
          }
        }
      } catch (error) {
        // Silencioso, no rompemos nada si falla sponsors list
        console.error("Error cargando lista de sponsors:", error);
      }
    };

    fetchData();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewsletterStatus('loading');

    try {
      // Endpoint local (Seguro)
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
    
    // Capturamos los datos del formulario
    const data = {
      nombre: String(formData.get('nombre') ?? ''),
      puesto: String(formData.get('puesto') ?? ''),
      empresa: String(formData.get('empresa') ?? ''),
      telefono: String(formData.get('telefono') ?? ''),
      email: String(formData.get('email') ?? ''),
      // IMPORTANTE: Mapeamos el campo 'mensaje' del front a 'nota' que es lo que espera el backend
      nota: String(formData.get('mensaje') ?? ''), 
    };

    try {
      // Endpoint local (Seguro)
      const res = await fetch('/api/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Error ${res.status} al enviar la solicitud.`);
      }

      setFormStatus('success');
      form.reset();
    } catch (error) {
      console.error("Error enviando formulario:", error);
      setFormStatus('error');
    }
  };
  
  return (
    <main className="bg-brand-dark min-h-screen text-white overflow-x-hidden font-sans selection:bg-brand-lime selection:text-brand-dark">
      <Header onReserve={() => setModalOpen(true)} />
      <BookingModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center pt-24 md:pt-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-lime/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col h-full items-center text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 rounded-full backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Calendar className="w-4 h-4 text-brand-lime" />
            <span className="text-xs font-bold tracking-wider text-gray-300 uppercase">11 DE MARZO, 2026</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <MapPin className="w-4 h-4 text-brand-lime" />
            <span className="text-xs font-bold tracking-wider text-gray-300">JANO'S COSTANERA</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6 uppercase pb-2">
            FOOD DELIVERY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-white inline-block pb-1  ">
              DAY 2026
            </span>
          </h1>
          
          {/* --- STORY BLOCK (SEO SOURCE OF TRUTH) --- */}
          <div className="max-w-4xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-100">
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
              <strong>Food Delivery Day 2026</strong> es el evento estratégico más importante de Latinoamérica dedicado a revolucionar el ecosistema del delivery y la gastronomía digital. 
              Programado para el <strong>11 de marzo de 2026 en Jano's Costanera, Buenos Aires</strong>, este encuentro se consolida como el punto de reunión definitivo para dueños de restaurantes, gerentes de logística y líderes de plataformas tecnológicas. 
              Una plataforma única para el networking de alto nivel, enfocada en tendencias críticas como la optimización de la última milla, el auge de las dark kitchens y las estrategias de rentabilidad en apps.
            </p>
          </div>

          {/* CTA Principal */}
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto px-4 md:px-0 mb-20 md:mb-28">
            <button 
              onClick={() => setModalOpen(true)}
              className="group relative bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black text-lg py-4 px-10 rounded-full shadow-[0_0_40px_-10px_rgba(190,242,100,0.3)] transition-all flex items-center justify-center gap-3 animate-pulse-fast hover:animate-none hover:scale-105 cursor-pointer uppercase min-h-[56px]"
            >
              Asegurá tu lugar, reservá ahora!
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link 
              href="#agenda" 
              className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 font-bold text-white transition-all text-sm uppercase tracking-wider flex items-center justify-center min-h-[56px]"
            >
              Ver Agenda
            </Link>
          </div>

          {/* MAIN PARTNERS */}
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 mb-10">
             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-6">Main Partners</p>
             <div className="flex items-center justify-center gap-12 md:gap-20 grayscale-0">
                <div className="relative w-48 h-16 md:w-64 md:h-24 hover:scale-105 transition-transform duration-300">
                  <Image src="/sponsors/mercadopagoo.png" alt="Mercado Pago" fill className="object-contain" />
                </div>
                <div className="w-px h-12 md:h-20 bg-white/10" />
                <div className="relative w-32 h-12 md:w-48 md:h-20 hover:scale-105 transition-transform duration-300">
                  <Image src="/sponsors/rappii.png" alt="Rappi" fill className="object-contain" />
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* 2. VIDEO & EXPERIENCE */}
      <section id="evento" className="py-24 px-6 relative border-t border-white/5 bg-black/40">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          {/* Columna Texto */}
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">CONECTANDO <span className="text-brand-lime">EL FUTURO</span></h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Un espacio único donde dueños de restaurantes, gerentes de logística y líderes de tecnología comparten las claves del éxito en la era digital.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Tendencias en Dark Kitchens y última milla.",
                "Estrategias de rentabilidad en apps.",
                "Networking real con los que hacen el mercado."
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-brand-lime flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            
            <div className="flex justify-center md:justify-start">
              <button 
                onClick={() => setModalOpen(true)} 
                className="w-full md:w-auto bg-white/10 hover:bg-white/20 border border-brand-lime/50 text-brand-lime font-bold text-lg py-4 px-10 rounded-full transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-lg shadow-brand-lime/10 min-h-[56px] cursor-pointer"
              >
                RESERVAR ENTRADAS AHORA
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Columna Video SHORT (Vertical) */}
          <div className="order-1 md:order-2 flex justify-center">
             <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gray-900 group w-full max-w-[320px] aspect-[9/16] mx-auto md:mr-0 md:ml-auto">
               
               {!isPlaying ? (
                 <button 
                   onClick={() => setIsPlaying(true)}
                   className="absolute inset-0 w-full h-full flex items-center justify-center group cursor-pointer z-20"
                 >
                   {/* IMAGEN DE PORTADA */}
                   <Image 
                     src="/assets/images/video-cover.jpg"
                     alt="Portada Video Food Delivery Day" 
                     fill 
                     className="object-cover transition-transform duration-700 group-hover:scale-105"
                     priority
                   />
                   
                   <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />

                   <div className="relative z-30 w-20 h-20 bg-brand-lime text-brand-dark rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(190,242,100,0.4)]">
                      <Play className="w-8 h-8 fill-current ml-1" />
                   </div>
                 </button>
               ) : (
                 <iframe 
                   className="w-full h-full animate-in fade-in duration-500"
                   src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`} 
                   title="Food Delivery Day Aftermovie" 
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowFullScreen
                   style={{ border: 0 }}
                 ></iframe>
               )}
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
            <AccordionItem time="09:00" title="Apertura de Puertas">
              Vení a visitar los stands participantes, retira tu acreditación y comenzá el networking.
            </AccordionItem>
            <AccordionItem time="10:00 - 10:30" title="Panel: Gastronómicos & Delivery">
              Charla descontracturada con 3 gastronómicos que supieron sacarle jugo al delivery. Estrategias reales para aumentar ventas.
            </AccordionItem>
            <AccordionItem time="11:30 - 12:00" title="Dark Kitchens: Cocina sin Fronteras">
              Con el <strong>Regional Country Manager de Atomic Kitchens</strong>. Descubre el futuro de los modelos operativos eficientes.
            </AccordionItem>
            <AccordionItem time="14:00 - 14:30" title="¿Por qué el delivery es la mejor publicidad del mundo?">
              <strong>Country Manager Rappi Argentina</strong>. Cómo Rappi redefine la última milla y qué esperar para el 2026.
            </AccordionItem>
            <AccordionItem time="15:30 - 16:00" title="Ecosistema en Expansión: Mercado Pago">
              <strong>Country Manager Mercado Pago Argentina</strong>. La visión financiera y tecnológica para transformar el delivery.
            </AccordionItem>
            <AccordionItem time="16:15" title="After Party by Temple & Gin Bosque">
              Comenzamos con una gran propuesta de After para relajar y conectar.
            </AccordionItem>
            <AccordionItem time="16:45" title="Cierre a Puro Humor: Gerardo Freideles">
              Stand Up: La gastronomía contada por un gastronómico. El broche de oro ideal para terminar el día.
            </AccordionItem>
          </div>
        </div>
      </section>

      {/* 4. SPONSORS */}
      <section id="sponsors" className="py-24 px-6 bg-[#111] border-y border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-16 text-white uppercase tracking-tight">Nuestros Sponsors</h2>
          
          {/* SPONSORS ORO */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-2 mb-8 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <h3 className="text-yellow-400 font-bold text-xl tracking-widest uppercase">Sponsors Oro</h3>
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Rappi", src: "/sponsors/rappii.png" },
                { name: "Mercado Pago", src: "/sponsors/mercadopagoo.png" }
              ].map((sponsor) => (
                <div key={sponsor.name} className="h-40 bg-white/5 border border-yellow-400/20 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer p-8 relative group">
                  <div className="relative w-full h-full">
                    <Image 
                      src={sponsor.src} 
                      alt={sponsor.name}
                      fill
                      className="object-contain" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SPONSORS PLATA */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-2 mb-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              <Shield className="w-5 h-5 text-gray-300" />
              <h3 className="text-gray-300 font-bold text-lg tracking-widest uppercase">Sponsors Plata</h3>
              <Shield className="w-5 h-5 text-gray-300" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {[
                { name: "Atomic Kitchens", src: "/sponsors/atomic.png" },
                { name: "Rokket", src: "/sponsors/rokket.png" }
              ].map((sponsor) => (
                <div key={sponsor.name} className="h-32 bg-white/5 border border-gray-500/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all p-6 relative group">
                  <div className="relative w-full h-full">
                    <Image 
                      src={sponsor.src} 
                      alt={sponsor.name}
                      fill
                      className="object-contain" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SPONSORS BRONCE */}
          <div className="mb-16 border-t border-white/5 pt-12">
             <div className="flex items-center justify-center gap-2 mb-8 drop-shadow-[0_0_12px_rgba(194,65,12,0.6)]">
                <Award className="w-5 h-5 text-orange-700" />
                <h3 className="text-orange-700 font-bold text-lg tracking-widest uppercase">Sponsors Bronce</h3>
                <Award className="w-5 h-5 text-orange-700" />
              </div>
              <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto opacity-90">
                {[
                  { name: "McCain", src: "/sponsors/mccainn.png" },
                  { name: "Guapaletas", src: "/sponsors/guapaletas.png" },
                ].map((sponsor) => (
                  <div key={sponsor.name} className="h-28 w-60 bg-white/5 border border-orange-800/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all p-4 relative group">
                    <div className="relative w-full h-full">
                      <Image 
                        src={sponsor.src} 
                        alt={sponsor.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
          </div>

          {/* SPONSORS EMPRENDEDOR */}
          <div className="mb-16">
              <div className="flex items-center justify-center gap-2 mb-8 drop-shadow-[0_0_15px_rgba(190,242,100,0.6)]">
                <Rocket className="w-5 h-5 text-brand-lime" />
                <h3 className="text-brand-lime font-bold text-lg tracking-widest uppercase">Sponsors Emprendedor</h3>
                <Rocket className="w-5 h-5 text-brand-lime" />
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto opacity-90">
                {[
                  { name: "RapiBoy", src: "/sponsors/rapiboy.png" },
                  { name: "MasDelivery", src: "/sponsors/masdelivery.png" },
                  { name: "Food Packaging", src: "/sponsors/food-packaging.svg" },
                  { name: "SourcingUp", src: "/sponsors/sourcingup.png" },
                  { name: "OmAgency", src: "/sponsors/omagency.png" }
                ].map((sponsor) => (
                  <div key={sponsor.name} className="h-24 w-36 md:w-48 bg-white/5 border border-lime-400/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all p-3 relative group">
                    <div className="relative w-full h-full">
                      <Image 
                        src={sponsor.src} 
                        alt={sponsor.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
          </div>

        </div>
      </section>

      {/* 5. QUIERO SER SPONSOR (FORMULARIO) */}
      <section className="py-20 px-6 bg-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-lime/5 z-0"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-sm">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black mb-4 uppercase text-white">¿Querés ser <span className="text-brand-lime">Sponsor</span>?</h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                Posicioná tu marca ante los líderes de la industria. Completá el formulario y te enviaremos nuestra propuesta comercial.
              </p>
            </div>

            {/* ESTADOS DEL FORMULARIO */}
            {formStatus === 'success' ? (
              <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Solicitud Enviada!</h3>
                <p className="text-gray-400 text-center max-w-md mb-6">
                  Muchas gracias por tu interés. Hemos recibido tus datos y te enviaremos la propuesta comercial a la brevedad.
                </p>
                <button 
                  onClick={() => setFormStatus('idle')}
                  className="text-brand-lime hover:underline font-bold"
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSponsorSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <User className="w-3 h-3" /> Nombre y Apellido
                    </label>
                    <input type="text" name="nombre" required disabled={formStatus === 'loading'} className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-lime outline-none disabled:opacity-50" placeholder="Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-3 h-3" /> Puesto
                    </label>
                    <input type="text" name="puesto" required disabled={formStatus === 'loading'} className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-lime outline-none disabled:opacity-50" placeholder="Gerente de Marketing" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-3 h-3" /> Empresa
                    </label>
                    <input type="text" name="empresa" required disabled={formStatus === 'loading'} className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-lime outline-none disabled:opacity-50" placeholder="Tu Empresa" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Teléfono
                    </label>
                    <input type="tel" name="telefono" required disabled={formStatus === 'loading'} className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-lime outline-none disabled:opacity-50" placeholder="+54 9 11 6633-2244" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Email
                  </label>
                  <input type="email" name="email" required disabled={formStatus === 'loading'} className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-lime outline-none disabled:opacity-50" placeholder="vos@empresa.com" />
                </div>

                {formStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-900/50">
                    <AlertCircle className="w-4 h-4" />
                    Hubo un error al enviar el mensaje. Por favor intentá nuevamente.
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={formStatus === 'loading'}
                  className="w-full bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black py-4 rounded-xl transition-all uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formStatus === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Solicitud'
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      </section>

      {/* 6. CTA FINAL */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-lime transform -skew-y-2 z-0" />
        <div className="relative z-10 max-w-4xl mx-auto text-center text-brand-dark">
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
            NO TE QUEDES AFUERA DE LA <br/> EVOLUCIÓN
          </h2>
          <p className="font-medium text-xl mb-10 max-w-2xl mx-auto opacity-80">
            Los cupos son estrictamente limitados por la capacidad del auditorio.
          </p>
          <button 
            onClick={() => setModalOpen(true)}
            className="bg-black text-white hover:bg-gray-800 font-bold text-xl py-5 px-12 rounded-xl shadow-2xl hover:-translate-y-1 transition-all cursor-pointer min-h-[56px]"
          >
            ¡QUIERO MI ENTRADA!
          </button>
        </div>
      </section>

      {/* 7. FAQ - PREGUNTAS FRECUENTES */}
      <section id="faq" className="py-24 px-6 bg-brand-dark border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase">Preguntas Frecuentes</h2>
            <p className="text-gray-400">Todo lo que necesitás saber sobre el evento.</p>
          </div>

          <div className="space-y-2 min-h-[200px]">
            {loadingFaqs ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-brand-lime animate-spin" />
              </div>
            ) : faqs.length > 0 ? (
              faqs.map((faq) => (
                <AccordionItem key={faq.id} title={faq.titulo}>
                  {/* whitespace-pre-line respeta saltos de línea de la DB */}
                  <span className="whitespace-pre-line">{faq.texto}</span>
                </AccordionItem>
              ))
            ) : (
              <p className="text-center text-gray-500">No hay preguntas frecuentes disponibles por el momento.</p>
            )}
          </div>
        </div>
      </section>

      {/* 8. FOOTER SEO OPTIMIZED */}
      <footer className="bg-black pt-20 pb-10 px-6 border-t border-white/10" role="contentinfo">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10 text-sm text-gray-500">
          
          {/* Columna Marca + Newsletter */}
          <div className="md:w-1/3 space-y-8">
            <div>
              <Link href="/" aria-label="Volver al inicio" className="inline-block group">
                <span className="font-bold text-white text-xl mb-4 tracking-tighter block group-hover:opacity-80 transition-opacity">
                  FOOD DELIVERY <span className="text-brand-lime">DAY</span>
                </span>
              </Link>
              <p className="leading-relaxed mt-2">
                Conectando el ecosistema de delivery, gastronomía y logística en Argentina. El punto de encuentro para liderar el futuro digital.
              </p>
            </div>

            {/* Newsletter Simple */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Suscribite a novedades</h4>
              {newsletterStatus === 'success' ? (
                <div className="flex items-center gap-2 text-green-400 text-xs">
                  <Check className="w-4 h-4" />
                  <span>¡Te suscribiste correctamente!</span>
                </div>
              ) : newsletterStatus === 'error' ? (
                <div className="flex items-center gap-2 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4" />
                  <span>Error al suscribirse. Intentá nuevamente.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Tu email" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    disabled={newsletterStatus === 'loading'}
                    className="bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs w-full focus:ring-1 focus:ring-brand-lime outline-none disabled:opacity-50" 
                  />
                  <button 
                    type="submit"
                    disabled={newsletterStatus === 'loading'}
                    className="bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-bold px-3 py-2 rounded-lg text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[50px]"
                  >
                    {newsletterStatus === 'loading' ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      'OK'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Columnas de Navegación */}
          <div className="flex flex-col sm:flex-row gap-10 md:gap-20">
            
            <nav aria-label="Enlaces del evento" className="flex flex-col gap-4">
              <h3 className="text-white font-bold uppercase tracking-wider text-xs">El Evento</h3>
              <ul className="space-y-3">
                <li><Link href="#agenda" className="hover:text-brand-lime transition-colors">Agenda Completa</Link></li>
                <li><Link href="#sponsors" className="hover:text-brand-lime transition-colors">Sponsors & Partners</Link></li>
                <li><Link href="#faq" className="hover:text-brand-lime transition-colors">Preguntas Frecuentes</Link></li>
              </ul>
            </nav>

            {/* Información de Contacto */}
            <address className="flex flex-col gap-4 not-italic">
              <h3 className="text-white font-bold uppercase tracking-wider text-xs">Contacto</h3>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:info@fooddeliveryday.com.ar" className="hover:text-brand-lime transition-colors flex items-center gap-2">
                    info@fooddeliveryday.com.ar
                  </a>
                </li>
                <li>
                  <span className="block">Av. Costanera Rafael Obligado 6340, CABA</span>
                </li>
              </ul>
            </address>

          </div>
        </div>

        {/* Copyright y Legales */}
        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-700">
          <p>© 2026 Food Delivery Day Argentina. Todos los derechos reservados.</p>
          
          <nav aria-label="Legales" className="flex gap-6">
            <Link href="/politica-de-privacidad" className="hover:text-gray-500 transition-colors" rel="nofollow">Política de Privacidad</Link>
            <Link href="/terminos-y-condiciones" className="hover:text-gray-500 transition-colors" rel="nofollow">Términos y Condiciones</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}