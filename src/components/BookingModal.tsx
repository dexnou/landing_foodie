'use client';
import { X, Check, Shield } from 'lucide-react';
import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: ModalProps) {
  const [includeLunch, setIncludeLunch] = useState(false);
  const [optIn, setOptIn] = useState(true);

  // Lógica de precios
  const BASE_PRICE = 12000;
  const LUNCH_PRICE = 8000;
  const totalPrice = includeLunch ? BASE_PRICE + LUNCH_PRICE : BASE_PRICE;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TRACKING: DataLayer Push
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ 
        event: 'submit_form',
        ticket_type: includeLunch ? 'full_experience' : 'general',
        value: totalPrice
      });
    }

    // Aquí iría la lógica real de envío o redirección a pago
    alert(`Redirigiendo a pago por $${totalPrice.toLocaleString('es-AR')}...`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 sm:p-6">
      {/* Backdrop oscuro con blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Contenido del Modal */}
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md overflow-hidden relative z-10 animate-zoom-in shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Reserva tu lugar</h3>
            <p className="text-xs text-gray-500">Cupos limitados para líderes del sector</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Formulario Scrollable */}
        <form className="p-5 space-y-5 overflow-y-auto" onSubmit={handleSubmit}>
          
          {/* 1. Empresa */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Nombre de la Empresa</label>
            <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all min-h-[44px]" placeholder="Ej: PedidosYa, Logística SA..." />
          </div>
          
          {/* 2. Nombre y Apellido */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Nombre y Apellido</label>
            <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-brand-lime outline-none min-h-[44px]" placeholder="Tu nombre completo" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* 3. Email */}
             <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Email Corporativo</label>
              <input required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-brand-lime outline-none min-h-[44px]" placeholder="nombre@empresa.com" />
            </div>
             {/* 4. Teléfono */}
             <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Teléfono / WhatsApp</label>
              <input required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-brand-lime outline-none min-h-[44px]" placeholder="+54 9..." />
            </div>
          </div>

          {/* Opt-in Checkbox */}
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

          {/* Toggle Almuerzo */}
          <div 
            className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-brand-lime transition-colors group"
            onClick={() => setIncludeLunch(!includeLunch)}
          >
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 group-hover:text-brand-dark transition-colors">¿Incluir Almuerzo? (+ $8.000)</span>
              {/* CAMBIO DE TEXTO AQUÍ: */}
              <p className="text-xs text-gray-500">Almuerzo gourmet durante el evento.</p>
            </div>
            <div className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 flex-shrink-0 ${includeLunch ? 'bg-brand-lime' : 'bg-gray-300'}`}>
              <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${includeLunch ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Botón de Acción */}
          <div className="pt-2 pb-2">
            <button type="submit" className="w-full bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black py-4 rounded-xl shadow-lg shadow-brand-lime/20 transform active:scale-[0.98] transition-all text-lg uppercase tracking-wide min-h-[56px] flex items-center justify-center">
              IR A PAGAR ${totalPrice.toLocaleString('es-AR')}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" /> Pagos procesados de forma segura.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}