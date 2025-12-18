'use client';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation'; 
import Link from 'next/link';
import { Check, X, Loader2, ArrowRight, UserPlus } from 'lucide-react';

export default function SuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams(); 
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // Obtenemos la cantidad de la URL, si no existe asumimos 1
  const qtyParam = searchParams.get('qty');
  const quantity = qtyParam ? parseInt(qtyParam) : 1;

  const [status, setStatus] = useState<'loading' | 'paid' | 'failed'>('loading');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/publicapi/foodday";
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
          body: JSON.stringify({ orderid: Number(orderId) })
        });

        if (res.ok) {
            const data = await res.json();
            
            // Verificación real del estado del pago
            if (data.response === true) {
                setStatus('paid');
                
                if (typeof window !== 'undefined') {
                    (window as any).dataLayer = (window as any).dataLayer || [];
                    (window as any).dataLayer.push({ 
                      event: 'purchase_verified',
                      order_id: orderId,
                      status: 'success'
                    });
                }
            } else {
                // El backend dice que NO está pagado
                setStatus('failed');
            }
        } else {
            // Error HTTP (500, 404, etc.)
            setStatus('failed');
        }

      } catch (error) {
        console.error("Error verificando pago:", error);
        setStatus('failed'); 
      }
    };

    verifyPayment();

  }, [orderId, API_URL, API_TOKEN]);

  return (
    <main className="bg-brand-dark min-h-screen flex items-center justify-center p-6 text-white font-sans selection:bg-brand-lime selection:text-brand-dark">
      
      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-20 bg-brand-lime/10 blur-3xl -z-10" />

        {/* CARGANDO */}
        {status === 'loading' && (
          <div className="py-10 flex flex-col items-center animate-in fade-in">
            <Loader2 className="w-16 h-16 text-brand-lime animate-spin mb-6" />
            <h1 className="text-2xl font-bold mb-2">Verificando tu pago...</h1>
            <p className="text-gray-400 text-sm">Por favor espera unos segundos.</p>
          </div>
        )}

        {/* PAGO EXITOSO */}
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
                Te enviamos el comprobante a tu email. <br/>
                Para generar los QRs de acceso, debés completar los datos de los asistentes.
              </p>
            </div>

            {/* BOTÓN AL FORMULARIO DE NOMINACIÓN */}
            <Link 
              href={`/nominar/${orderId}?qty=${quantity}`} 
              className="w-full bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 group mb-4 shadow-[0_0_20px_-5px_rgba(190,242,100,0.4)]"
            >
              ASIGNAR ENTRADAS
              <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>

            <Link 
              href="/" 
              className="text-gray-500 hover:text-white text-sm font-bold transition-colors py-2"
            >
              Volver al inicio
            </Link>
          </div>
        )}

        {/* ERROR (PAGO NO CONFIRMADO O FALLIDO) */}
        {status === 'failed' && (
          <div className="py-6 flex flex-col items-center animate-in shake">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
              <X className="w-12 h-12 text-red-500" strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Pago no confirmado</h1>
            <p className="text-gray-400 mb-8">No detectamos el pago de la orden #{orderId} o aún está pendiente.</p>
            <button onClick={() => window.location.reload()} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all">
              Reintentar Verificación
            </button>
            <Link 
              href="/" 
              className="text-gray-500 hover:text-white text-sm font-bold transition-colors py-4 block"
            >
              Volver al inicio
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}