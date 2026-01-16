'use client';
import { X, User, Briefcase, Building2, Phone, Mail, AlertCircle, Loader2, Check } from 'lucide-react';

interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formStatus: 'idle' | 'loading' | 'success' | 'error';
  setFormStatus: (status: 'idle' | 'loading' | 'success' | 'error') => void;
}

export default function SponsorModal({ isOpen, onClose, onSubmit, formStatus, setFormStatus }: SponsorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 animate-fade-in"
        onClick={onClose}
      />
      
      <div className="bg-brand-dark border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden relative z-10 animate-zoom-in shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/10">
          <h3 className="font-bold text-white text-lg">Solicitud de Sponsoreo</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
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
                onClick={() => {
                    setFormStatus('idle');
                    onClose();
                }}
                className="text-brand-lime hover:underline font-bold"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="grid md:grid-cols-2 gap-5">
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

              <div className="grid md:grid-cols-2 gap-5">
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
                  <input type="tel" name="telefono" required disabled={formStatus === 'loading'} className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-lime outline-none disabled:opacity-50" placeholder="+54 9 11..." />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email
                </label>
                <input type="email" name="email" required disabled={formStatus === 'loading'} className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-lime outline-none disabled:opacity-50" placeholder="vos@empresa.com" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Mensaje / Comentarios
                </label>
                <textarea 
                  name="mensaje" 
                  rows={3}
                  disabled={formStatus === 'loading'} 
                  className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-lime outline-none disabled:opacity-50 resize-none" 
                  placeholder="Contanos qué tenés en mente..." 
                />
              </div>

              {formStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-900/50">
                  <AlertCircle className="w-4 h-4" />
                  Hubo un error al enviar el mensaje.
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
    </div>
  );
}