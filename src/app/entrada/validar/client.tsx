'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, ShieldCheck, ScanLine, LogIn } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

// Wrapper to handle Suspense for useSearchParams
export default function ValidationClientWrapper({ isAuthenticated }: { isAuthenticated: boolean }) {
    return (
        <Suspense fallback={<div className="text-white/50">Cargando sistema...</div>}>
            <ValidationClient isAuthenticated={isAuthenticated} />
        </Suspense>
    );
}

function ValidationClient({ isAuthenticated: initialAuth }: { isAuthenticated: boolean }) {
    const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Login State
    const [accessCode, setAccessCode] = useState('');

    // Validation State
    const [ticketData, setTicketData] = useState<any | null>(null);
    const [scanStatus, setScanStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
    const [manualToken, setManualToken] = useState('');

    const searchParams = useSearchParams();
    const router = useRouter();

    // Check for token in URL on mount (if authenticated)
    useEffect(() => {
        if (isAuthenticated) {
            const urlToken = searchParams.get('token');
            if (urlToken && scanStatus === 'idle') {
                validateTicket(urlToken);
            }
        }
    }, [isAuthenticated, searchParams, scanStatus]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/staff/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: accessCode }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Error de autenticación');
            }

            setIsAuthenticated(true);
            // If there was a token in URL, the useEffect will pick it up
            router.refresh(); // Refresh server state for cookies
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const validateTicket = async (token: string) => {
        setScanStatus('validating');
        setError(null);
        setTicketData(null);

        try {
            const res = await fetch('/api/tickets/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Special handling for already used
                if (res.status === 409) { // Conflict / Already Used
                    setTicketData(data.ticket);
                    throw new Error(data.message || 'Entrada ya utilizada');
                }
                throw new Error(data.message || 'Entrada inválida');
            }

            setTicketData(data.ticket);
            setScanStatus('success');
        } catch (err: any) {
            setError(err.message);
            setScanStatus('error');
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualToken.trim()) validateTicket(manualToken.trim());
    };

    const resetScanner = () => {
        setScanStatus('idle');
        setTicketData(null);
        setError(null);
        setManualToken('');
        // Remove token from URL so it doesn't auto-trigger again
        router.replace('/entrada/validar');
    };

    // --- RENDERERS ---

    if (!isAuthenticated) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-purple-500/20 p-4 rounded-2xl mb-4">
                        <ShieldCheck className="w-10 h-10 text-purple-400" />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        Staff Access
                    </h1>
                    <p className="text-white/50 text-sm mt-2">Sistema de Validación de Entradas</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="text-xs font-medium text-white/40 uppercase tracking-wider ml-1 mb-2 block">
                            Código de Acceso
                        </label>
                        <input
                            type="password"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-center tracking-widest text-lg"
                            placeholder="••••••••"
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm text-center"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><LogIn className="w-5 h-5" /> Ingresar</>}
                    </button>
                </form>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-lg relative z-10">
            <div className="flex justify-between items-center mb-6 px-2">
                <div>
                    <h2 className="text-2xl font-bold text-white">Validación</h2>
                    <p className="text-white/50 text-sm">Food Delivery Day</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                    <img src="/favicon.ico" alt="Logo" className="w-6 h-6 opacity-80" />
                </div>
            </div>

            <motion.div
                layout
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[400px]"
            >
                {scanStatus === 'idle' && (
                    <div className="p-8 flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <ScanLine className="w-10 h-10 text-white/50" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">Esperando Entrada...</h3>
                        <p className="text-white/40 text-sm mb-8 max-w-[250px]">
                            Escanea el QR con la cámara o ingresa el código manual.
                        </p>

                        <form onSubmit={handleManualSubmit} className="w-full">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Token Manual"
                                    value={manualToken}
                                    onChange={(e) => setManualToken(e.target.value)}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <button type="submit" className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-xl transition-colors">
                                    Validar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {scanStatus === 'validating' && (
                    <div className="p-8 flex flex-col items-center justify-center h-full min-h-[400px]">
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
                        <p className="text-white/60 animate-pulse">Verificando entrada...</p>
                    </div>
                )}

                {(scanStatus === 'success' || scanStatus === 'error') && (
                    <div className={cn("p-0 h-full flex flex-col", scanStatus === 'error' ? "bg-red-500/5" : "bg-emerald-500/5")}>

                        {/* Header Status */}
                        <div className={cn("p-6 flex flex-col items-center justify-center border-b border-white/5",
                            scanStatus === 'success' ? "bg-gradient-to-b from-emerald-500/20 to-emerald-500/5" : "bg-gradient-to-b from-red-500/20 to-red-500/5"
                        )}>
                            {scanStatus === 'success' ? (
                                <CheckCircle2 className="w-20 h-20 text-emerald-400 mb-2 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                            ) : (
                                <XCircle className="w-20 h-20 text-red-400 mb-2 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" />
                            )}
                            <h2 className={cn("text-2xl font-bold", scanStatus === 'success' ? "text-emerald-100" : "text-red-100")}>
                                {scanStatus === 'success' ? 'Entrada Válida' : 'Acceso Denegado'}
                            </h2>
                            {error && <p className="text-red-200/70 text-sm mt-1 max-w-[280px] text-center">{error}</p>}
                            {scanStatus === 'success' && <p className="text-emerald-200/70 text-sm mt-1">Check-in registrado</p>}
                        </div>

                        {/* Data Display */}
                        <div className="p-8 flex-1">
                            {ticketData ? (
                                <div className="space-y-4">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <label className="text-xs text-white/30 uppercase tracking-wider block mb-1">Nombre</label>
                                        <p className="text-lg font-semibold text-white">{ticketData.nombre} {ticketData.apellido}</p>
                                    </div>

                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <label className="text-xs text-white/30 uppercase tracking-wider block mb-1">Empresa</label>
                                        <p className="text-base text-white/90">{ticketData.empresa}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <label className="text-xs text-white/30 uppercase tracking-wider block mb-1">Sector</label>
                                            <p className="text-sm text-white/80 truncate">{ticketData.industria || '-'}</p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <label className="text-xs text-white/30 uppercase tracking-wider block mb-1">Estado</label>
                                            <p className={cn("text-sm font-medium", ticketData.checkin_status === 1 ? "text-emerald-400" : "text-white/80")}>
                                                {ticketData.checkin_status === 1 ? 'Validado' : 'Pendiente'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-white/20">
                                    Sin datos de entrada
                                </div>
                            )}
                        </div>

                        <div className="p-6 pt-0">
                            <button
                                onClick={resetScanner}
                                className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-4 rounded-xl transition-all"
                            >
                                Nueva Validación
                            </button>
                        </div>

                    </div>
                )}
            </motion.div>

            <div className="mt-8 text-center">
                <p className="text-white/20 text-xs">Food Delivery Day Access Control</p>
            </div>
        </div>
    );
}
