'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { User, Building2, Mail, Phone, Ticket, ArrowRight, Loader2, Check, Download } from 'lucide-react';

interface AttendeeData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
}

export default function NominatePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [attendees, setAttendees] = useState<AttendeeData[]>([]);

  useEffect(() => {
    // Simulamos carga de datos y leemos la cantidad de la URL
    const timer = setTimeout(() => {
      const qtyParam = searchParams.get('qty');
      const qty = qtyParam ? parseInt(qtyParam) : 1; // Por defecto 1
      
      setTicketQuantity(qty);
      // Inicializamos los campos vacíos según la cantidad
      setAttendees(Array(qty).fill({
        firstName: '', lastName: '', company: '', email: '', phone: ''
      }));
      
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleInputChange = (index: number, field: keyof AttendeeData, value: string) => {
    const newAttendees = [...attendees];
    newAttendees[index] = { ...newAttendees[index], [field]: value };
    setAttendees(newAttendees);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validación simple
    const isValid = attendees.every(a => a.firstName && a.lastName && a.company && a.email && a.phone);
    if (!isValid) {
      alert("Por favor completá todos los campos.");
      setIsSubmitting(false);
      return;
    }

    // Aquí iría la llamada real a tu backend para guardar los nominados
    // await fetch('/api/nominar', ... )
    
    // Simulación de éxito
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  // --- VISTA DE CARGA ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-brand-lime animate-spin mb-4" />
        <p className="text-gray-400 animate-pulse">Cargando reserva #{orderId}...</p>
      </div>
    );
  }

  // --- VISTA DE ÉXITO FINAL ---
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-500">
          <Check className="w-12 h-12 text-green-500" strokeWidth={3} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-6 uppercase">
          ¡Entradas <span className="text-brand-lime">Enviadas!</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-lg mb-10">
          Los códigos QR han sido enviados a los correos electrónicos de cada asistente.
        </p>
        
        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
            <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                <Download className="w-5 h-5" /> Descargar Todo (PDF)
            </button>
            <Link href="/" className="text-brand-lime font-bold hover:underline py-2">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  // --- VISTA DE FORMULARIO ---
  return (
    <main className="min-h-screen bg-brand-dark text-white font-sans pb-20 selection:bg-brand-lime selection:text-brand-dark">
      {/* Header Fijo */}
      <header className="py-6 px-6 border-b border-white/10 bg-brand-dark/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tighter hover:opacity-80 transition-opacity">
            FOOD DELIVERY <span className="text-brand-lime">DAY</span>
          </Link>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">
            Orden #{orderId}
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 pt-12">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-3xl md:text-5xl font-black mb-4 uppercase leading-none">
            Asignar <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-white">Entradas</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Tenés <strong>{ticketQuantity} {ticketQuantity === 1 ? 'cupo' : 'cupos'}</strong> disponibles. <br className="hidden md:block"/>
            Ingresá los datos de quienes asistirán al evento para generar sus QRs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {attendees.map((attendee, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-8 shadow-xl" style={{ animationDelay: `${index * 150}ms` }}>
              
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <div className="w-8 h-8 bg-brand-lime text-brand-dark rounded-full flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(190,242,100,0.4)]">
                  {index + 1}
                </div>
                <h3 className="font-bold text-xl text-white tracking-tight">Entrada #{index + 1}</h3>
                <Ticket className="w-5 h-5 text-gray-600 ml-auto" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex gap-2 tracking-wider"><User className="w-3 h-3" /> Nombre</label>
                  <input required type="text" value={attendee.firstName} onChange={(e) => handleInputChange(index, 'firstName', e.target.value)} className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-brand-lime focus:border-brand-lime outline-none transition-all placeholder:text-gray-700" placeholder="Ej: Juan" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex gap-2 tracking-wider"><User className="w-3 h-3" /> Apellido</label>
                  <input required type="text" value={attendee.lastName} onChange={(e) => handleInputChange(index, 'lastName', e.target.value)} className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-brand-lime focus:border-brand-lime outline-none transition-all placeholder:text-gray-700" placeholder="Ej: Pérez" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex gap-2 tracking-wider"><Building2 className="w-3 h-3" /> Empresa</label>
                  <input required type="text" value={attendee.company} onChange={(e) => handleInputChange(index, 'company', e.target.value)} className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-brand-lime focus:border-brand-lime outline-none transition-all placeholder:text-gray-700" placeholder="Nombre de la empresa" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex gap-2 tracking-wider"><Mail className="w-3 h-3" /> Email</label>
                  <input required type="email" value={attendee.email} onChange={(e) => handleInputChange(index, 'email', e.target.value)} className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-brand-lime focus:border-brand-lime outline-none transition-all placeholder:text-gray-700" placeholder="juan@mail.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex gap-2 tracking-wider"><Phone className="w-3 h-3" /> Teléfono</label>
                  <input required type="tel" value={attendee.phone} onChange={(e) => handleInputChange(index, 'phone', e.target.value)} className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-brand-lime focus:border-brand-lime outline-none transition-all placeholder:text-gray-700" placeholder="+54 9 11 6633-2211" />
                </div>
              </div>
            </div>
          ))}

          <div className="pt-8 pb-20 flex justify-center">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full md:w-auto min-w-[300px] bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black text-lg py-5 px-10 rounded-xl shadow-[0_0_30px_-5px_rgba(190,242,100,0.3)] transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-wide"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generando Tickets...
                </>
              ) : (
                <>
                  CONFIRMAR NOMINACIÓN
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}