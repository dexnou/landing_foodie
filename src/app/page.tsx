'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import BookingModal from '@/components/BookingModal';
import AccordionItem from '@/components/Accordion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, MapPin, Calendar, CheckCircle2, Star, Shield, Award, Rocket } from 'lucide-react';

const sponsorsLogos = [
  { name: "Rappi", src: "/sponsors/rappi.png" },
  { name: "Mercado Pago", src: "/sponsors/mercadopago.png" },
  { name: "Atomic Kitchens", src: "/sponsors/atomic.png" },
  { name: "McCain", src: "/sponsors/mccain.png" },
  { name: "+ Delivery", src: "/sponsors/masdelivery.png" },
  { name: "Food Packaging", src: "/sponsors/food-packaging.png" },
];

// Duplicamos la lista varias veces para asegurar que cubra pantallas grandes sin cortes
const multipliedSponsors = [...sponsorsLogos, ...sponsorsLogos, ...sponsorsLogos, ...sponsorsLogos];

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Estado para controlar si se muestra el video o la portada

  // TU ID DE VIDEO NUEVO
  const VIDEO_ID = "dQw4w9WgXcQ";

  return (
    <main className="bg-brand-dark min-h-screen text-white overflow-x-hidden font-sans selection:bg-brand-lime selection:text-brand-dark">
      <Header />
      <BookingModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center pt-24 md:pt-32">
        
        {/* Fondo decorativo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-lime/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col h-full items-center text-center">
          
          {/* Badge Fecha */}
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 rounded-full backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Calendar className="w-4 h-4 text-brand-lime" />
            <span className="text-xs font-bold tracking-wider text-gray-300">2026</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <MapPin className="w-4 h-4 text-brand-lime" />
            <span className="text-xs font-bold tracking-wider text-gray-300">ARGENTINA</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-6 uppercase">
            FOOD DELIVERY <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-white">DAY 2026</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            El evento más importante del ecosistema de delivery en Argentina. Conectando restaurantes, plataformas tecnológicas y el futuro de la gastronomía digital.
          </p>

          {/* CTA Principal */}
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto px-4 md:px-0">
            <button 
              onClick={() => setModalOpen(true)}
              className="group relative bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black text-lg py-4 px-10 rounded-full shadow-[0_0_40px_-10px_rgba(190,242,100,0.3)] transition-all flex items-center justify-center gap-3 animate-pulse-fast hover:animate-none hover:scale-105"
            >
              ASEGURÁ TU LUGAR
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* 2. Reemplaza el <button> anterior por este <Link>: */}
            <Link 
              href="#agenda" 
              className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 font-bold text-white transition-all text-sm uppercase tracking-wider flex items-center justify-center"
            >
              Ver Agenda
            </Link>
          </div>

          {/* --- Sponsors Ghost Infinite Marquee --- */}
          <div className="mt-16 md:mt-24 w-full max-w-5xl">
             <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-6 text-center">Main Partners</p>
            
             {/* Contenedor con overflow hidden y bordes suaves */}
            <div className="relative w-full overflow-hidden fade-sides py-2">
                <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center">
                   {multipliedSponsors.map((item, index) => (
                       <div key={index} className="mx-4 flex-shrink-0 group cursor-pointer">
                           {/* Caja de logo */}
                           <div className="w-32 h-14 relative flex items-center justify-center grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                                <Image 
                                  src={item.src} 
                                  alt={item.name} 
                                  fill 
                                  className="object-contain" 
                                />
                           </div>
                       </div>
                   ))}
                </div>
            </div>
          </div>
           {/* --- FIN Marquee --- */}

        </div>
      </section>

      {/* 2. VIDEO & EXPERIENCE */}
      <section id="evento" className="py-24 px-6 relative border-t border-white/5 bg-black/40">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
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
            <button onClick={() => setModalOpen(true)} className="text-brand-lime font-bold border-b border-brand-lime pb-1 hover:text-white hover:border-white transition-colors">
              Reservar entradas ahora
            </button>
          </div>

          {/* --- VIDEO PLAYER CON LÓGICA DE PORTADA --- */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-video bg-gray-900 group">
             
             {!isPlaying ? (
               // 1. ESTADO PORTADA: Se muestra antes de dar play.
               // El botón verde está aquí dentro.
               <button 
                 onClick={() => setIsPlaying(true)}
                 className="absolute inset-0 w-full h-full flex items-center justify-center group cursor-pointer z-20"
               >
                 {/* Capa oscura sobre el fondo */}
                 <div className="absolute inset-0 bg-brand-lime/10 group-hover:bg-brand-lime/5 transition-colors z-10" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-0" />
                 
                 {/* BOTÓN VERDE PLAY (Este es el que querías conservar) */}
                 <div className="relative z-30 w-20 h-20 bg-brand-lime text-brand-dark rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(190,242,100,0.4)]">
                    <Play className="w-8 h-8 fill-current ml-1" />
                 </div>
                 
                 {/* Texto CTA */}
                 <span className="absolute bottom-8 text-sm font-bold tracking-widest text-white z-30 uppercase">
                   VER PRESENTACIÓN 2026
                 </span>
               </button>
             ) : (
               // 2. ESTADO REPRODUCIENDO: Se muestra al hacer clic en el botón verde.
               // Carga el iframe de YouTube con tu ID.
               <iframe 
                 className="w-full h-full animate-in fade-in duration-500"
                 src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0`} 
                 title="Food Delivery Day Aftermovie" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                 allowFullScreen
               ></iframe>
             )}

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
            
            <AccordionItem time="14:00 - 14:30" title="El Futuro se Entrega">
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
          
          {/* ORO */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <h3 className="text-yellow-400 font-bold text-lg tracking-widest uppercase">Sponsors Oro</h3>
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-32 bg-white/5 border border-yellow-400/20 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer">
                <span className="text-2xl font-bold text-gray-500">LOGO ORO 1</span>
              </div>
              <div className="h-32 bg-white/5 border border-yellow-400/20 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer">
                <span className="text-2xl font-bold text-gray-500">LOGO ORO 2</span>
              </div>
            </div>
          </div>

          {/* PLATA */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Shield className="w-4 h-4 text-gray-300" />
              <h3 className="text-gray-300 font-bold text-sm tracking-widest uppercase">Sponsors Plata</h3>
              <Shield className="w-4 h-4 text-gray-300" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white/5 border border-gray-500/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all">
                  <span className="text-lg font-bold text-gray-600">PLATA {i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* NIVEL 3: BRONCE Y EMPRENDEDOR */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            
            {/* BRONCE */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Award className="w-4 h-4 text-orange-700" />
                <h3 className="text-orange-700 font-bold text-xs tracking-widest uppercase">Sponsors Bronce</h3>
                <Award className="w-4 h-4 text-orange-700" />
              </div>
              <div className="grid grid-cols-3 gap-4 opacity-70">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-white/5 border border-orange-800/20 rounded flex items-center justify-center hover:bg-white/10 transition-all">
                    <span className="text-[10px] font-bold text-gray-600">BRONCE {i}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* EMPRENDEDOR */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Rocket className="w-4 h-4 text-brand-lime" />
                <h3 className="text-brand-lime font-bold text-xs tracking-widest uppercase">Sponsors Emprendedor</h3>
                <Rocket className="w-4 h-4 text-brand-lime" />
              </div>
              <div className="grid grid-cols-3 gap-4 opacity-70">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-white/5 border border-lime-400/20 rounded flex items-center justify-center hover:bg-white/10 transition-all">
                    <span className="text-[10px] font-bold text-gray-600">STARTUP {i}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. CTA FINAL */}
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
            className="bg-black text-white hover:bg-gray-800 font-bold text-xl py-5 px-12 rounded-xl shadow-2xl hover:-translate-y-1 transition-all"
          >
            ¡QUIERO MI ENTRADA!
          </button>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-black pt-20 pb-10 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10 text-sm text-gray-500">
          <div className="md:w-1/3">
            <div className="font-bold text-white text-xl mb-4 tracking-tighter">FOOD DELIVERY <span className="text-brand-lime">DAY</span></div>
            <p>Conectando el ecosistema de delivery y logística en Argentina.</p>
          </div>
          <div className="flex gap-10">
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold mb-2">Evento</span>
              <a href="#" className="hover:text-brand-lime">Agenda</a>
              <a href="#" className="hover:text-brand-lime">Sponsors</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold mb-2">Contacto</span>
              <a href="mailto:hola@fooddeliveryday.com" className="hover:text-brand-lime">hola@fooddeliveryday.com</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-xs text-gray-700">
          © 2026 Food Delivery Day Argentina. Todos los derechos reservados.
        </div>
      </footer>
    </main>
  );
}