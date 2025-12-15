'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import BookingModal from '@/components/BookingModal';
import AccordionItem from '@/components/Accordion';
import Image from 'next/image';
import { ArrowRight, Play, MapPin, Calendar, CheckCircle2, Star, Shield, Award, Rocket, Mail, User, Briefcase, Phone, Building2 } from 'lucide-react';

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const VIDEO_ID = "dQw4w9WgXcQ";

  // --- FUNCIÓN MAILTO (NATIVA) ---
  const handleSponsorSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const nombre = formData.get('nombre') as string;
    const puesto = formData.get('puesto') as string;
    const empresa = formData.get('empresa') as string;
    const telefono = formData.get('telefono') as string;
    const email = formData.get('email') as string;

    const subject = encodeURIComponent(`Solicitud de Sponsor - ${empresa}`);

    const body = encodeURIComponent(
`Hola, estoy interesado en ser sponsor del Food Delivery Day 2026.

Mis datos son:
------------------------------------------------
Nombre: ${nombre}
Puesto: ${puesto}
Empresa: ${empresa}
Teléfono: ${telefono}
Email: ${email}
------------------------------------------------

Quedo a la espera de la propuesta comercial.
Saludos.`
    );

    // Abre el cliente de correo en la misma ventana (evita bloqueos de popup)
    window.location.href = `mailto:info@fooddeliveryday.com.ar?subject=${subject}&body=${body}`;
  };

  return (
    <main className="bg-brand-dark min-h-screen text-white overflow-x-hidden font-sans selection:bg-brand-lime selection:text-brand-dark">
      <Header onReserve={() => setModalOpen(true)} />
      <BookingModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center pt-24 md:pt-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-lime/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col h-full items-center text-center">
          
          {/* Fecha y Lugar (Arriba) */}
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
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-[1.2]">
            El evento más importante del ecosistema de delivery en Argentina. Conectando restaurantes, plataformas tecnológicas y el futuro de la gastronomía digital.
          </p>

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

          {/* MAIN PARTNERS (UBICACIÓN CORRECTA: ABAJO DEL TODO) */}
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 mb-10">
             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-6">Main Partners</p>
             <div className="flex items-center justify-center gap-10 md:gap-16 grayscale-0">
                <div className="relative w-32 h-12 md:w-44 md:h-16 hover:scale-105 transition-transform duration-300">
                  <Image src="/sponsors/mercadopagoo.png" alt="Mercado Pago" fill className="object-contain" />
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="relative w-24 h-10 md:w-32 md:h-14 hover:scale-105 transition-transform duration-300">
                  <Image src="/sponsors/rappii.png" alt="Rappi" fill className="object-contain" />
                </div>
             </div>
          </div>

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

          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-video bg-gray-900 group">
             {!isPlaying ? (
               <button 
                 onClick={() => setIsPlaying(true)}
                 className="absolute inset-0 w-full h-full flex items-center justify-center group cursor-pointer z-20"
               >
                 <div className="absolute inset-0 bg-brand-lime/10 group-hover:bg-brand-lime/5 transition-colors z-10" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-0" />
                 <div className="relative z-30 w-20 h-20 bg-brand-lime text-brand-dark rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(190,242,100,0.4)]">
                    <Play className="w-8 h-8 fill-current ml-1" />
                 </div>
                 <span className="absolute bottom-8 text-sm font-bold tracking-widest text-white z-30 uppercase">
                   VER PRESENTACIÓN 2026
                 </span>
               </button>
             ) : (
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

          {/* SPONSORS BRONCE Y EMPRENDEDOR */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            
            {/* BRONCE */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-6 drop-shadow-[0_0_12px_rgba(194,65,12,0.6)]">
                <Award className="w-4 h-4 text-orange-700" />
                <h3 className="text-orange-700 font-bold text-xs tracking-widest uppercase">Sponsors Bronce</h3>
                <Award className="w-4 h-4 text-orange-700" />
              </div>
              <div className="grid grid-cols-2 gap-4 opacity-90">
                {[
                  { name: "McCain", src: "/sponsors/mccainn.png" },
                  { name: "Cabify", src: "/sponsors/cabify.png" }
                ].map((sponsor) => (
                  <div key={sponsor.name} className="h-28 bg-white/5 border border-orange-800/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all p-4 relative group">
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

            {/* EMPRENDEDOR */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-6 drop-shadow-[0_0_15px_rgba(190,242,100,0.6)]">
                <Rocket className="w-4 h-4 text-brand-lime" />
                <h3 className="text-brand-lime font-bold text-xs tracking-widest uppercase">Sponsors Emprendedor</h3>
                <Rocket className="w-4 h-4 text-brand-lime" />
              </div>
              <div className="grid grid-cols-3 gap-3 opacity-90">
                {[
                  { name: "RapiBoy", src: "/sponsors/rapiboy.png" },
                  { name: "MasDelivery", src: "/sponsors/masdelivery.png" },
                  { name: "Food Packaging", src: "/sponsors/food-packaging.png" },
                  { name: "SourcingUp", src: "/sponsors/sourcingup.png" } 
                ].map((sponsor) => (
                  <div key={sponsor.name} className="h-24 bg-white/5 border border-lime-400/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all p-2 relative group">
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

            <form className="space-y-6" onSubmit={handleSponsorSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-3 h-3" /> Nombre y Apellido
                  </label>
                  <input type="text" name="nombre" required className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-lime outline-none" placeholder="Juan Pérez" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-3 h-3" /> Puesto
                  </label>
                  <input type="text" name="puesto" required className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-lime outline-none" placeholder="Gerente de Marketing" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-3 h-3" /> Empresa
                  </label>
                  <input type="text" name="empresa" required className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-lime outline-none" placeholder="Tu Empresa SA" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-3 h-3" /> Teléfono
                  </label>
                  <input type="tel" name="telefono" required className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-lime outline-none" placeholder="+54 9 11..." />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email
                </label>
                <input type="email" name="email" required className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-lime outline-none" placeholder="vos@empresa.com" />
              </div>

              <button type="submit" className="w-full bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black py-4 rounded-xl transition-all uppercase tracking-wide">
                Enviar Solicitud
              </button>
            </form>
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

          <div className="space-y-2">
            <AccordionItem title="¿Qué incluye la entrada?">
              La entrada incluye acceso completo al evento, participación en todas las charlas y paneles, networking con profesionales del sector y acceso a los stands de los sponsors. La opción con almuerzo incluye además el almuerzo gourmet durante el evento.
            </AccordionItem>

            <AccordionItem title="¿Dónde se realiza el evento?">
              El evento se realiza en Buenos Aires, Argentina. La ubicación exacta será comunicada a todos los registrados por email una semana antes del evento.
            </AccordionItem>

            <AccordionItem title="¿Hay estacionamiento disponible?">
              Sí, el venue cuenta con estacionamiento para los asistentes. También hay opciones de transporte público cercanas que compartiremos en el email de confirmación.
            </AccordionItem>

            <AccordionItem title="¿Puedo cambiar o cancelar mi entrada?">
              Podés solicitar cambios o cancelaciones hasta 7 días antes del evento. Para más información, contactanos por email a <a href="mailto:info@fooddeliveryday.com.ar" className="text-brand-lime hover:underline font-bold">info@fooddeliveryday.com.ar</a>
            </AccordionItem>

            <AccordionItem title="¿Quiénes participan como speakers?">
              Contamos con la participación de Country Managers de Rappi, Mercado Pago y Atomic Kitchens, además de un panel con gastronómicos exitosos en delivery y un cierre especial con el comediante Gerardo Freideles.
            </AccordionItem>
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
              <div className="flex gap-2">
                <input type="email" placeholder="Tu email" className="bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs w-full focus:ring-1 focus:ring-brand-lime outline-none" />
                <button className="bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-bold px-3 py-2 rounded-lg text-xs transition-colors">
                  OK
                </button>
              </div>
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
                  <span className="block">Buenos Aires, Argentina</span>
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