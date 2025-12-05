'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Check, X, Loader2, Home, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
  const params = useParams();
  // En Next.js App Router, los params pueden venir como string o array, nos aseguramos de tomar el string
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [status, setStatus] = useState<'loading' | 'paid' | 'failed'>('loading');

  // Variables de entorno
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://productos.cliiver.com/api/publicapi/foodday";
  const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || "cliiver";

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId) return;

      try {
        const res = await fetch(`${API_URL}/checkIfPaid`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'client': 'intercap',
            'Authorization': `Bearer ${API_TOKEN}`
          },
          body: JSON.stringify({ orderid: Number(orderId) }) // Convertimos a Number porque tu endpoint espera int
        });

        if (res.ok) {
          const data = await res.json();
          
          if (data.response === true) {
            setStatus('paid');
            // Tracking de conversión
            if (typeof window !== 'undefined') {
                (window as any).dataLayer = (window as any).dataLayer || [];
                (window as any).dataLayer.push({ 
                  event: 'purchase_verified',
                  order_id: orderId,
                  status: 'success'
                });
            }
          } else {
            setStatus('failed');
          }
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error("Error verificando pago:", error);
        setStatus('failed');
      }
    };

    // Ejecutamos la verificación
    verifyPayment();

  }, [orderId, API_URL, API_TOKEN]);

  return (
    <main className="bg-brand-dark min-h-screen flex items-center justify-center p-6 text-white font-sans selection:bg-brand-lime selection:text-brand-dark">
      
      {/* CARD CONTENEDORA */}
      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
        
        {/* Fondo decorativo sutil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-20 bg-brand-lime/10 blur-3xl -z-10" />

        {/* ESTADO: CARGANDO */}
        {status === 'loading' && (
          <div className="py-10 flex flex-col items-center animate-in fade-in">
            <Loader2 className="w-16 h-16 text-brand-lime animate-spin mb-6" />
            <h1 className="text-2xl font-bold mb-2">Verificando tu pago...</h1>
            <p className="text-gray-400 text-sm">Por favor espera unos segundos.</p>
          </div>
        )}

        {/* ESTADO: PAGO EXITOSO */}
        {status === 'paid' && (
          <div className="py-6 flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <Check className="w-12 h-12 text-green-500" strokeWidth={3} />
            </div>
            
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">¡Todo Listo!</h1>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Tu pago para la orden <span className="font-mono text-brand-lime">#{orderId}</span> se procesó correctamente.
            </p>

            <div className="bg-white/5 rounded-xl p-4 mb-8 w-full border border-white/5">
              <p className="text-sm text-gray-400">
                Te enviamos el comprobante y el código QR de acceso a tu correo electrónico.
              </p>
            </div>

            <Link 
              href="/" 
              className="w-full bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
              VOLVER AL INICIO
              <Home className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        )}

        {/* ESTADO: FALLÓ O PENDIENTE */}
        {status === 'failed' && (
          <div className="py-6 flex flex-col items-center animate-in shake">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
              <X className="w-12 h-12 text-red-500" strokeWidth={3} />
            </div>
            
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Pago no confirmado</h1>
            <p className="text-gray-400 mb-8">
              Aún no detectamos el pago para la orden <span className="font-mono text-white">#{orderId}</span> o hubo un problema en el proceso.
            </p>

            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Actualizar estado
                <Loader2 className="w-4 h-4" />
              </button>

              <Link 
                href="/" 
                className="text-gray-500 hover:text-white text-sm font-medium py-2 transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}