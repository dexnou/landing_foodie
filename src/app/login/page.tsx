'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { foodDayApi } from '@/lib/api';
import { authUtils } from '@/lib/auth';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // States
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [processingToken, setProcessingToken] = useState(false);

    // 1. Check for token in URL (Magic Link Callback)
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            handleMagicToken(token);
        }
    }, [searchParams]);

    const handleMagicToken = async (token: string) => {
        setProcessingToken(true);
        setError('');

        try {
            const response = await foodDayApi.loginWithMagicLink(token);

            if (response.success && response.sessionToken) {
                authUtils.saveToken(response.sessionToken);
                router.push('/mis-entradas');
            } else {
                setError(response.message || 'Token inválido o expirado.');
                setProcessingToken(false);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error al validar el enlace.');
            setProcessingToken(false);
        }
    };

    // 2. Handle Login Request (Send Email)
    const handleRequestLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            // Usamos requestMagicLink (misma API que antes pero ahora el proposito es login unico)
            const response = await foodDayApi.requestMagicLink(email);

            // La API siempre devuelve success: true por seguridad (blind user enumeration),
            // a menos que falle algo interno.
            if (response.success) {
                setSuccessMessage('¡Listo! Te enviamos un enlace de acceso a tu email. (Revisá spam por las dudas)');
                setEmail('');
            } else {
                setError(response.message || 'Error al solicitar el enlace.');
            }
        } catch (err: any) {
            setError('Error de conexión. Intentalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER: Validando Token ---
    if (processingToken) {
        return (
            <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-lime mx-auto mb-4"></div>
                <h2 className="text-xl font-bold mb-2">Validando tu acceso...</h2>
                <p className="text-gray-400">Por favor esperá un momento.</p>
            </div>
        );
    }

    // --- RENDER: Formulario ---
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-wide">
                    Acceso a Entradas
                </h1>
                <p className="text-gray-400 text-sm">
                    Ingresá el email con el que compraste tus entradas para recibir un enlace de acceso directo.
                </p>
            </div>

            <form onSubmit={handleRequestLink} className="space-y-6">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-200 px-4 py-3 rounded-lg text-sm text-center">
                        <p className="font-bold text-lg mb-1">📩 ¡Enlace enviado!</p>
                        <p>{successMessage}</p>
                    </div>
                )}

                {!successMessage && (
                    <>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                Email de compra
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition text-white placeholder-gray-500"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black py-3 px-6 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide shadow-[0_0_20px_rgba(255,0,84,0.3)] hover:shadow-[0_0_30px_rgba(255,0,84,0.5)]"
                        >
                            {loading ? 'Enviando...' : 'INGRESAR / VER MIS ENTRADAS'}
                        </button>
                    </>
                )}

                {successMessage && (
                    <button
                        type="button"
                        onClick={() => setSuccessMessage('')}
                        className="w-full text-brand-lime hover:text-white font-bold text-sm underline transition-colors"
                    >
                        Probar con otro email
                    </button>
                )}
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 font-sans text-white">
            <div className="absolute top-0 left-0 w-full h-[600px] bg-brand-lime/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
            <div className="max-w-md w-full relative z-10">
                <Suspense fallback={<div className="text-white text-center">Cargando...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
