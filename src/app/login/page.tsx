'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { foodDayApi } from '@/lib/api';
import { authUtils } from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await foodDayApi.login(email, password);

            if (response.success && response.sessionToken) {
                authUtils.saveToken(response.sessionToken);
                router.push('/mis-entradas');
            } else {
                setError('Error al iniciar sesión');
            }
        } catch (err: any) {
            if (err.message.includes('PASSWORD_NOT_SET')) {
                setError('Aún no creaste tu contraseña. Revisá tu email para el link de acceso.');
            } else {
                setError('Email o contraseña incorrectos');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await foodDayApi.forgotPassword(forgotEmail);
            setForgotSuccess(true);
        } catch (err) {
            setError('Error al enviar el email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 font-sans text-white">
            <div className="absolute top-0 left-0 w-full h-[600px] bg-brand-lime/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />

            <div className="max-w-md w-full relative z-10">
                <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-wide">
                            Iniciar Sesión
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Accedé a tus entradas de Food Delivery Day
                        </p>
                    </div>

                    {!showForgotPassword ? (
                        <form onSubmit={handleLogin} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                    Email
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
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black py-3 px-6 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide shadow-[0_0_20px_rgba(255,0,84,0.3)] hover:shadow-[0_0_30px_rgba(255,0,84,0.5)]"
                            >
                                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="w-full text-sm text-brand-lime hover:text-white transition-colors font-medium hover:underline"
                            >
                                ¿Olvidaste tu contraseña?
                            </button>

                            <div className="text-center text-sm text-gray-500 pt-4 border-t border-white/10">
                                ¿Primera vez?{' '}
                                <a href="/" className="text-brand-lime hover:text-white transition-colors font-bold hover:underline">
                                    Solicitá tu link de acceso
                                </a>
                            </div>
                        </form>
                    ) : (
                        <div>
                            {forgotSuccess ? (
                                <div className="text-center space-y-4">
                                    <div className="bg-green-500/10 border border-green-500/20 text-green-200 px-4 py-3 rounded-lg text-sm">
                                        ✓ Si el email existe, te enviamos un link para resetear tu contraseña.
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowForgotPassword(false);
                                            setForgotSuccess(false);
                                            setForgotEmail('');
                                        }}
                                        className="text-brand-lime hover:text-white font-bold transition-colors"
                                    >
                                        ← Volver al login
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleForgotPassword} className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold mb-2 text-white">Resetear Contraseña</h2>
                                        <p className="text-sm text-gray-400 mb-4">
                                            Te enviaremos un link para crear una nueva contraseña
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor="forgotEmail" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                            Email
                                        </label>
                                        <input
                                            id="forgotEmail"
                                            type="email"
                                            required
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition text-white placeholder-gray-500"
                                            placeholder="tu@email.com"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black py-3 px-6 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 uppercase tracking-wide shadow-[0_0_20px_rgba(255,0,84,0.3)] hover:shadow-[0_0_30px_rgba(255,0,84,0.5)]"
                                    >
                                        {loading ? 'Enviando...' : 'Enviar Link'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForgotPassword(false);
                                            setError('');
                                        }}
                                        className="w-full text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        ← Volver al login
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
