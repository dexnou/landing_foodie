'use client';
import { X } from 'lucide-react';
import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: ModalProps) {
  const [includeLunch, setIncludeLunch] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 sm:p-6">
      {/* Backdrop oscuro con blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Contenido del Modal */}
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md overflow-hidden relative z-10 animate-zoom-in shadow-2xl">
        
        {/* Header Modal */}
        <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Reserva tu lugar</h3>
            <p className="text-xs text-gray-500">Cupos limitados para líderes del sector</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form className="p-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Empresa</label>
            <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all" placeholder="Ej: PedidosYa, Logística SA..." />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-brand-lime outline-none" placeholder="Tu nombre" />
            </div>
             <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp</label>
              <input type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-brand-lime outline-none" placeholder="+54 9..." />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Corporativo</label>
            <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-brand-lime outline-none" placeholder="nombre@empresa.com" />
          </div>

          {/* Toggle Almuerzo */}
          <div 
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-brand-lime transition-colors"
            onClick={() => setIncludeLunch(!includeLunch)}
          >
            <div className="flexflex-col">
              <span className="text-sm font-bold text-gray-800">¿Incluir Almuerzo VIP?</span>
              <p className="text-xs text-gray-500">Networking exclusivo con speakers</p>
            </div>
            <div className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${includeLunch ? 'bg-brand-lime' : 'bg-gray-300'}`}>
              <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${includeLunch ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black py-4 rounded-xl shadow-lg shadow-brand-lime/20 transform active:scale-[0.98] transition-all text-lg uppercase tracking-wide">
              IR A PAGAR {includeLunch ? '($$$)' : '($)'}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-3">
              Pagos procesados de forma segura vía MercadoPago / Stripe.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}