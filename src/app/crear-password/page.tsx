'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { foodDayApi } from '@/lib/api';
import { authUtils } from '@/lib/auth';

export default function CrearPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tokenError, setTokenError] = useState('');

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (!tokenParam) {
            setTokenError('Link inválido. No se encontró el token.');
        } else {
            setToken(tokenParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validations
        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        if (password.length > 72) {
            setError('La contraseña no debe superar 72 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        try {
            const response = await foodDayApi.setPassword(token, password, confirmPassword);

            if (response.success && response.sessionToken) {
                // Save JWT
                authUtils.saveToken(response.sessionToken);
                router.push('/mis-entradas');
            } else {
                setError('Error al crear la contraseña');
            }
        } catch (err: any) {
            if (err.message.includes('TOKEN_ALREADY_USED')) {
                setError('Este link ya fue utilizado. Solicitá uno nuevo.');
            } else if (err.message.includes('TOKEN_EXPIRED')) {
                setError('El link ha expirado. Solicitá uno nuevo.');
            } else {
                setError('Error al crear contraseña. Verificá tu link.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (tokenError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 font-sans text-white">
                <div className="max-w-md w-full">
                    <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-8 text-center backdrop-blur-sm">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-wide">Link Inválido</h1>
                        <p className="text-gray-400 mb-6 font-medium">{tokenError}</p>
                        <a
                            href="/"
                            className="inline-block bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black py-3 px-6 rounded-lg transition-all transform active:scale-95 uppercase tracking-wide"
                        >
                            Volver al inicio
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 font-sans text-white">
            <div className="absolute top-0 left-0 w-full h-[600px] bg-brand-lime/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />

            <div className="max-w-md w-full relative z-10">
                <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">🔐</div>
                        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-wide">
                            Creá tu Contraseña
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Elegí una contraseña segura para acceder a tus entradas
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition text-white placeholder-gray-500"
                                placeholder="Mínimo 8 caracteres"
                                minLength={8}
                                maxLength={72}
                            />
                            <p className="text-xs text-gray-500 mt-1 font-medium">
                                Entre 8 y 72 caracteres
                            </p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                Confirmar Contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition text-white placeholder-gray-500"
                                placeholder="Repetí tu contraseña"
                                minLength={8}
                                maxLength={72}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black py-3 px-6 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide shadow-[0_0_20px_rgba(255,0,84,0.3)] hover:shadow-[0_0_30px_rgba(255,0,84,0.5)]"
                        >
                            {loading ? 'Creando...' : 'Crear Contraseña y Acceder'}
                        </button>

                        <p className="text-xs text-center text-gray-500 font-medium">
                            Al crear tu contraseña, podrás iniciar sesión cuando quieras sin necesidad de links.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
