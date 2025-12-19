'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation'; // Agregamos useRouter
import Link from 'next/link';
import { User, Mail, Phone, Ticket, ArrowRight, Loader2, Check, Download } from 'lucide-react';

interface AttendeeData {
  id: number | string; 
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function NominatePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter(); // Instancia del router
  const orderId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const [attendees, setAttendees] = useState<AttendeeData[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/publicapi/foodday";
  const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || "cliiver";

  // --- 1. FETCH INICIAL (Check Payment + Get Tickets) ---
  useEffect(() => {
    const initPage = async () => {
      try {
        if (!orderId) return;

        console.log(`🔒 Verificando estado del pago para orden: ${orderId}`);

        // PASO 1: Verificar si está pagado
        const payRes = await fetch(`${API_URL}/checkIfPaid`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'client': 'intercap',
            'Authorization': `Bearer ${API_TOKEN}`
          },
          body: JSON.stringify({ orderid: Number(orderId) })
        });

        if (!payRes.ok) throw new Error("Error al verificar pago");
        
        const payData = await payRes.json();
        
        // Si NO está pagada, cortamos el flujo
        if (payData.response !== true) {
          console.warn("⛔ La orden no está pagada. Redirigiendo...");
          alert("Esta orden no se encuentra abonada o confirmada.");
          router.push('/'); // Redirigimos al home
          return;
        }

        // PASO 2: Si está pagada, traemos los productos
        console.log(`📡 Pago confirmado. Buscando entradas...`);
        
        const response = await fetch(`${API_URL}/traerProdsOrden/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'client': 'intercap',
            'Authorization': `Bearer ${API_TOKEN}`
          }
        });

        if (response.ok) {
          const resJson = await response.json();
          console.log("🎟️ Respuesta Backend:", resJson);

          const safeValue = (val: any) => {
            if (val === undefined || val === null) return "";
            if (String(val) === "NULL") return "";
            return String(val).trim();
          };

          if (resJson.success && Array.isArray(resJson.data)) {
             const ticketsFromBackend = resJson.data.map((t: any) => {
              
              const ticketId = t.orderprodid || t.prodinfoid;

              if (!ticketId) {
                console.error("⚠️ ALERTA: No se encontró ID válido en:", t);
              }

              const rawName = safeValue(t.prodinfo_nombre || t.nombre);
              const rawMail = safeValue(t.prodinfo_mail || t.mail);
              const rawPhone = safeValue(t.prodinfo_telefono || t.telefono);

              const splitName = rawName.split(' ');
              const derivedFirstName = splitName[0] || '';
              const derivedLastName = splitName.slice(1).join(' ') || '';

              return {
                id: ticketId, 
                firstName: derivedFirstName,
                lastName: derivedLastName,
                email: rawMail,
                phone: rawPhone
              };
            });
            
            setAttendees(ticketsFromBackend);
          } else {
            console.warn("Estructura de datos inesperada o array vacío");
            fallbackToQueryParams();
          }

        } else {
          console.error("Error al traer entradas");
          fallbackToQueryParams();
        }

      } catch (error) {
        console.error("Error general:", error);
        fallbackToQueryParams();
      } finally {
        setIsLoading(false);
      }
    };

    const fallbackToQueryParams = () => {
        const qtyParam = searchParams.get('qty');
        const qty = qtyParam ? parseInt(qtyParam) : 1;
        setAttendees(Array(qty).fill(null).map((_, i) => ({
          id: `temp-${i}`,
          firstName: '', lastName: '', email: '', phone: ''
        })));
    };

    if (orderId) {
      initPage();
    }
  }, [orderId, searchParams, API_URL, API_TOKEN, router]);

  const handleInputChange = (index: number, field: keyof AttendeeData, value: string) => {
    const newAttendees = [...attendees];
    newAttendees[index] = { ...newAttendees[index], [field]: value };
    setAttendees(newAttendees);
  };

  // --- 2. UPDATE DE INFO (PUT) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = attendees.every(a => 
      a.firstName.trim() !== '' && 
      a.lastName.trim() !== '' && 
      a.email.trim() !== '' && 
      a.phone.trim() !== ''
    );

    if (!isValid) {
      alert("Por favor completá todos los campos.");
      setIsSubmitting(false);
      return;
    }

    try {
      const updatePromises = attendees.map(attendee => {
        
        if (!attendee.id || String(attendee.id).startsWith('temp-')) {
            console.error("❌ Error: Intentando actualizar sin ID válido:", attendee);
            throw new Error("ID de entrada inválido");
        }

        const url = `${API_URL}/actualizarProdInfo/${attendee.id}`;
        const fullName = `${attendee.firstName} ${attendee.lastName}`.trim();

        console.log(`📤 Enviando PUT a: ${url}`, { nombre: fullName, ...attendee });

        return fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'client': 'intercap',
            'Authorization': `Bearer ${API_TOKEN}`
          },
          body: JSON.stringify({
            nombre: fullName,
            mail: attendee.email,
            telefono: attendee.phone
          })
        });
      });

      await Promise.all(updatePromises);
      
      console.log("✅ Info de productos actualizada");
      
      setTimeout(() => {
        setIsSubmitting(false);
        setIsCompleted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);

    } catch (error) {
      console.error("Error actualizando info:", error);
      alert("Hubo un error al guardar los datos.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-brand-lime animate-spin mb-4" />
        <p className="text-gray-400 animate-pulse">Verificando orden y cargando cupos...</p>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-500">
          <Check className="w-12 h-12 text-green-500" strokeWidth={3} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-6 uppercase">
          ¡Datos <span className="text-brand-lime">Guardados!</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-lg mb-10">
          La información de las entradas ha sido actualizada correctamente.
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

  return (
    <main className="min-h-screen bg-brand-dark text-white font-sans pb-20 selection:bg-brand-lime selection:text-brand-dark">
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
            Tenés <strong>{attendees.length} {attendees.length === 1 ? 'cupo' : 'cupos'}</strong> disponibles. <br className="hidden md:block"/>
            Completá los datos para generar los QRs de acceso.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {attendees.map((attendee, index) => (
            <div key={attendee.id || index} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-8 shadow-xl" style={{ animationDelay: `${index * 150}ms` }}>
              
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
                  Guardando Entradas...
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