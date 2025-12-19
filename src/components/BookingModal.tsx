'use client';
import { X, Check, Shield, Loader2, ExternalLink, Minus, Plus, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Estados del proceso de compra
type BookingState = 'idle' | 'creating' | 'pending_payment' | 'paid' | 'error';

export default function BookingModal({ isOpen, onClose }: ModalProps) {
  const [bookingState, setBookingState] = useState<BookingState>('idle');
  const [includeLunch, setIncludeLunch] = useState(false);
  const [optIn, setOptIn] = useState(true);
  
  // Estado para la cantidad de entradas
  const [quantity, setQuantity] = useState(1);
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    company: '',
    firstName: '', 
    lastName: '',  
    email: '',
    phone: ''
  });

  const [orderId, setOrderId] = useState<number | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  // CONFIGURACIÓN DE PRECIOS
  const BASE_PRICE = 12000;
  const LUNCH_PRICE = 8000;
  
  // Cálculo del precio unitario y total
  const unitPrice = includeLunch ? BASE_PRICE + LUNCH_PRICE : BASE_PRICE;
  const totalPrice = unitPrice * quantity;
  
  // URL del Backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://productos.cliiver.com/";
  const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || "cliiver";

  // Referencia para datos de tracking
  const trackingDataRef = useRef({ quantity, unitPrice, totalPrice, includeLunch });

  useEffect(() => {
    trackingDataRef.current = { quantity, unitPrice, totalPrice, includeLunch };
  }, [quantity, unitPrice, totalPrice, includeLunch]);

  // Resetea el formulario al cerrar el modal
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setBookingState('idle');
        setOrderId(null);
        setPaymentLink(null);
        setFormData({ company: '', firstName: '', lastName: '', email: '', phone: '' });
        setQuantity(1);
        setIncludeLunch(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Funciones para manejar la cantidad
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // POLLING: Consultar estado del pago
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (bookingState === 'pending_payment' && orderId) {
      console.log(`🔄 Esperando pago para OrderID: ${orderId}...`);
      
      interval = setInterval(async () => {
        try {
          // Consultamos al backend real
          const res = await fetch(`${API_URL}/checkIfPaid`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'client': 'intercap',             
              'Authorization': `Bearer ${API_TOKEN}`
            },
            body: JSON.stringify({ orderid: orderId })
          });
          
          if (res.ok) {
            const data = await res.json();
            
            // Verificamos la respuesta real del backend
            // Se asume que data.response es true cuando el pago impactó
            const isPaid = data.response === true;

            if (isPaid) {
              setBookingState('paid');
              clearInterval(interval);
              
              const { quantity, unitPrice, totalPrice, includeLunch } = trackingDataRef.current;

              if (typeof window !== 'undefined') {
                (window as any).dataLayer = (window as any).dataLayer || [];
                (window as any).dataLayer.push({ 
                  event: 'purchase',
                  order_id: orderId,
                  value: totalPrice,
                  currency: 'ARS',
                  items: [{
                    item_name: includeLunch ? 'Entrada Full Experience' : 'Entrada General',
                    quantity: quantity,
                    price: unitPrice
                  }]
                });
              }
            }
          }
        } catch (error) {
          console.error("Error verificando pago:", error);
          // No cambiamos a error aquí para no interrumpir el polling por un fallo de red momentáneo
        }
      }, 3000); 
    }

    return () => clearInterval(interval);
  }, [bookingState, orderId, API_URL, API_TOKEN]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingState('creating');
    
    try {
      const response = await fetch(`${API_URL}/crearOrden`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'client': 'intercap',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
          nombre: formData.firstName, 
          apellido: formData.lastName,
          email: formData.email,
          almuerzo: includeLunch,
          cantidad: quantity,
          empresa: formData.company,
          telefono: formData.phone,
          newsletter: optIn
        })
      });

      if (!response.ok) {
        throw new Error('Error al comunicarse con el servidor');
      }

      const data = await response.json();
      console.log("📦 Orden creada:", data);

      if (data.orderid && data.paymentlink) {
        setOrderId(data.orderid);
        setPaymentLink(data.paymentlink);
        setBookingState('pending_payment');
        window.open(data.paymentlink, '_blank');
      } else {
        throw new Error('La respuesta del servidor no contiene link de pago');
      }

    } catch (error) {
      console.error(error);
      setBookingState('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 animate-fade-in"
        onClick={onClose}
      />
      
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md overflow-hidden relative z-10 animate-zoom-in shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              {bookingState === 'paid' ? '¡Entrada Confirmada!' : 'Reserva tu lugar'}
            </h3>
            <p className="text-xs text-gray-500">
              {bookingState === 'paid' ? 'Nos vemos en el evento' : 'Cupos limitados para líderes del sector'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-5 overflow-y-auto">
          
          {/* 1. FORMULARIO DE DATOS */}
          {bookingState === 'idle' && (
            <form className="space-y-5" onSubmit={handleSubmit}>
              
              {/* SELECCIÓN DE CANTIDAD */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">Cantidad de entradas</span>
                  <p className="text-xs text-gray-500">${unitPrice.toLocaleString('es-AR')} c/u</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm">
                  <button 
                    type="button" 
                    onClick={decreaseQuantity}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600 disabled:opacity-50 active:scale-95"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-gray-900 w-6 text-center select-none text-lg">{quantity}</span>
                  <button 
                    type="button" 
                    onClick={increaseQuantity}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Nombre de la Empresa</label>
                <input required name="company" value={formData.company} onChange={handleInputChange} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all min-h-[44px]" placeholder="Ej: Rappi" />
              </div>
              
              {/* Inputs Separados */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Nombre</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-brand-lime outline-none min-h-[44px]" placeholder="Juan" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Apellido</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-brand-lime outline-none min-h-[44px]" placeholder="Pérez" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Email</label>
                  <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-brand-lime outline-none min-h-[44px]" placeholder="nombre@empresa.com" />
                </div>
                 <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Teléfono</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-brand-lime outline-none min-h-[44px]" placeholder="+54 9 11 6633-2233" />
                </div>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    id="opt-in" 
                    checked={optIn} 
                    onChange={(e) => setOptIn(e.target.checked)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 bg-gray-50 transition-all checked:border-brand-lime checked:bg-brand-lime focus:ring-2 focus:ring-brand-lime focus:ring-offset-1"
                  />
                  <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-dark opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                </div>
                <label htmlFor="opt-in" className="text-xs text-gray-600 cursor-pointer select-none leading-tight">
                  Quiero recibir información y novedades sobre el evento por WhatsApp o email.
                </label>
              </div>

              <div 
                className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-brand-lime transition-colors group"
                onClick={() => setIncludeLunch(!includeLunch)}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 group-hover:text-brand-dark transition-colors">¿Incluir Almuerzo? (+ $8.000)</span>
                  <p className="text-xs text-gray-500">Almuerzo durante el evento.</p>
                </div>
                <div className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 flex-shrink-0 ${includeLunch ? 'bg-brand-lime' : 'bg-gray-300'}`}>
                  <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${includeLunch ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              <div className="pt-2 pb-2">
                <button type="submit" className="w-full bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black py-4 rounded-xl shadow-lg shadow-brand-lime/20 transform active:scale-[0.98] transition-all text-lg uppercase tracking-wide min-h-[56px] flex items-center justify-center gap-2">
                  IR A PAGAR ${totalPrice.toLocaleString('es-AR')}
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" /> Pagos procesados de forma segura.
                </p>
              </div>
            </form>
          )}

          {/* 2. CREANDO ORDEN */}
          {bookingState === 'creating' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in">
              <Loader2 className="w-10 h-10 text-brand-lime animate-spin" />
              <p className="text-gray-600 font-medium">Generando tu link de pago...</p>
            </div>
          )}

          {/* 3. ESPERANDO PAGO */}
          {bookingState === 'pending_payment' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center animate-in fade-in">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center animate-pulse">
                <ExternalLink className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">¡Se abrió una nueva pestaña!</h4>
                <p className="text-sm text-gray-600 max-w-xs mx-auto">
                  Por favor completa el pago en Mercado Pago para confirmar tu lugar.
                </p>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 w-full">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Esperando confirmación del pago...
                </div>
              </div>

              {paymentLink && (
                <a 
                  href={paymentLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-lime font-bold text-sm hover:underline mt-2 block"
                >
                  ¿No se abrió? Haz click aquí para pagar
                </a>
              )}
            </div>
          )}

          {/* 4. ÉXITO (BOTÓN NUEVO AQUÍ) */}
          {bookingState === 'paid' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
              </div>
              <div>
                <h4 className="text-2xl font-black text-gray-900 mb-2">¡Pago Exitoso!</h4>
                <p className="text-gray-600">
                  Tu entrada ha sido confirmada.
                </p>
              </div>
              
              {/* --- BOTÓN DE FLUJO --- */}
              <Link 
                href={`/success/${orderId}?qty=${quantity}`} // Pasamos la cantidad
                className="w-full bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-lime/20 flex items-center justify-center gap-2"
                onClick={onClose}
              >
                IR A MIS ENTRADAS
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-sm font-medium"
              >
                Cerrar
              </button>
            </div>
          )}

          {/* 5. ESTADO: ERROR */}
          {bookingState === 'error' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center animate-in fade-in">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-gray-800">Hubo un error al conectar con el servidor.</p>
              <button 
                onClick={() => setBookingState('idle')}
                className="text-brand-lime font-bold hover:underline"
              >
                Intentar nuevamente
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}