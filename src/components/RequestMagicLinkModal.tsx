'use client';

import { useState } from 'react';
import { foodDayApi } from '@/lib/api';

interface RequestMagicLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RequestMagicLinkModal({ isOpen, onClose }: RequestMagicLinkModalProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await foodDayApi.requestMagicLink(email);
            setSuccess(true);
            setEmail('');
        } catch (err) {
            setError('Error al enviar el link. Intentá nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSuccess(false);
        setError('');
        setEmail('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl max-w-md w-full p-8 border border-white/10 relative">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <div className="sr-only">Cerrar</div>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {success ? (
                    <div className="text-center">
                        <div className="text-6xl mb-6">✉️</div>
                        <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-wide">
                            ¡Listo!
                        </h3>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Si el email tiene entradas compradas, te enviamos un link de acceso.
                            <br />Revisá tu bandeja de entrada.
                        </p>
                        <button
                            onClick={handleClose}
                            className="w-full bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black py-3 px-6 rounded-lg transition-all transform active:scale-95 uppercase tracking-wide shadow-lg shadow-brand-lime/20"
                        >
                            Entendido
                        </button>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">
                            Acceder a tus entradas
                        </h3>
                        <p className="text-gray-400 mb-6 text-sm">
                            Ingresá el email con el que compraste las entradas para recibir un link de acceso.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="modalEmail" className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                    Email
                                </label>
                                <input
                                    id="modalEmail"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition text-white placeholder-gray-600"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black py-3 px-6 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 uppercase tracking-wide shadow-lg shadow-brand-lime/20"
                                >
                                    {loading ? 'Enviando...' : 'Enviar Link'}
                                </button>
                            </div>

                            <p className="text-xs text-center text-gray-500 mt-4">
                                ¿Ya tenés contraseña?{' '}
                                <a href="/login" className="text-brand-lime hover:text-white font-bold transition-colors hover:underline">
                                    Iniciar sesión
                                </a>
                            </p>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
