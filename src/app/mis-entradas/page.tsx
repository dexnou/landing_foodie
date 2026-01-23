'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { foodDayApi } from '@/lib/api';
import { authUtils, PROVINCIAS_ARGENTINA, INDUSTRIAS } from '@/lib/auth';
import { Ticket as TicketIcon, Lock, User, Briefcase, MapPin, Linkedin, Edit3, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';

interface Ticket {
    prodinfoid: number;
    orderid: number;
    nombre: string;
    apellido: string | null;
    empresa: string | null;
    provincia: string | null;
    industria: string | null;
    linkedin: string | null;
    interes: string | null;
    mail: string | null;
    telefono: string | null;
    is_complete: number;
    updated_at: string | null;
}

export default function MisEntradasPage() {
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [progress, setProgress] = useState({ completed: 0, total: 0 });
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = authUtils.getToken();

        if (!token) {
            router.push('/login');
            return;
        }

        if (authUtils.isTokenExpired(token)) {
            authUtils.clearToken();
            router.push('/login');
            return;
        }

        loadTickets(token);
    }, [router]);

    const loadTickets = async (token: string) => {
        setLoading(true);
        setError('');

        try {
            const response = await foodDayApi.getMyTickets(token);

            if (response.success) {
                setTickets(response.tickets);
                setEmail(response.email);
                setProgress(response.progress);
            }
        } catch (err: any) {
            if (err.message.includes('401') || err.message.includes('UNAUTHORIZED')) {
                authUtils.clearToken();
                router.push('/login');
            } else {
                setError('Error al cargar las entradas');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (ticket: Ticket) => {
        setEditingTicket({ ...ticket });
        setError('');
    };

    const handleSave = async () => {
        if (!editingTicket) return;

        const token = authUtils.getToken();
        if (!token) {
            router.push('/login');
            return;
        }

        // Validations
        if (!editingTicket.nombre || !editingTicket.apellido || !editingTicket.empresa || !editingTicket.provincia) {
            setError('Nombre, apellido, empresa y provincia son obligatorios');
            return;
        }

        if (editingTicket.linkedin && !editingTicket.linkedin.match(/^https?:\/\/(www\.)?linkedin\.com\//i)) {
            setError('LinkedIn debe ser una URL válida (https://linkedin.com/...)');
            return;
        }

        if (editingTicket.interes && editingTicket.interes.length > 500) {
            setError('El interés no debe superar 500 caracteres');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const response = await foodDayApi.updateTicket(token, editingTicket.prodinfoid, {
                nombre: editingTicket.nombre,
                apellido: editingTicket.apellido,
                empresa: editingTicket.empresa,
                provincia: editingTicket.provincia,
                industria: editingTicket.industria || null,
                linkedin: editingTicket.linkedin || null,
                interes: editingTicket.interes || null,
            });

            if (response.success) {
                setTickets(tickets.map(t =>
                    t.prodinfoid === editingTicket.prodinfoid ? response.ticket : t
                ));

                const completedCount = tickets.filter(t =>
                    t.prodinfoid === editingTicket.prodinfoid ? response.ticket.is_complete : t.is_complete
                ).length;
                setProgress({ ...progress, completed: completedCount });

                setEditingTicket(null);
            }
        } catch (err: any) {
            setError(err.message || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        authUtils.clearToken();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-dark">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-lime mx-auto mb-4"></div>
                    <p className="text-gray-400 font-medium">Cargando tus entradas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-dark py-12 px-4 font-sans text-white">
            <div className="absolute top-0 left-0 w-full h-[300px] bg-brand-lime/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 mb-8 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-wide">
                                Mis Entradas
                            </h1>
                            <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
                                <User className="w-4 h-4 text-brand-lime" />
                                {email}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-bold transition flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" /> Cerrar Sesión
                        </button>
                    </div>

                    {/* Progress */}
                    <div className="bg-black/30 rounded-xl p-5 border border-white/5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                                Progreso de acreditación
                            </span>
                            <span className="text-sm font-black text-brand-lime">
                                {progress.completed} / {progress.total} COMPLETAS
                            </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-brand-lime h-4 rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(255,0,84,0.5)]"
                                style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-right">
                            Completá los datos de todos los asistentes para generar sus QR.
                        </p>
                    </div>
                </div>

                {/* Tickets Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {tickets.map((ticket) => (
                        <div
                            key={ticket.prodinfoid}
                            className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 hover:border-brand-lime/30 transition-all hover:bg-white/[0.07] group"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-white/5">
                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-lime/10 p-3 rounded-lg border border-brand-lime/20 group-hover:border-brand-lime/50 transition-colors">
                                        <TicketIcon className="w-8 h-8 text-brand-lime" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">
                                            Entrada #{ticket.prodinfoid}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-mono">
                                            ORDEN #{ticket.orderid}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    {ticket.is_complete ? (
                                        <span className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wide">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Completa
                                        </span>
                                    ) : (
                                        <span className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase tracking-wide">
                                            <AlertCircle className="w-3.5 h-3.5" /> Pendiente
                                        </span>
                                    )}

                                    <button
                                        onClick={() => handleEdit(ticket)}
                                        className="flex-1 sm:flex-none px-4 py-1.5 bg-brand-lime hover:bg-brand-limeHover text-brand-dark rounded-full text-xs font-black uppercase tracking-wide transition-transform active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" /> Editar
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                                <div>
                                    <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Nombre</span>
                                    <p className="font-medium text-white flex items-center gap-2">
                                        <User className="w-3.5 h-3.5 text-gray-400" /> {ticket.nombre || '-'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Apellido</span>
                                    <p className="font-medium text-white">{ticket.apellido || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Empresa</span>
                                    <p className="font-medium text-white flex items-center gap-2">
                                        <Briefcase className="w-3.5 h-3.5 text-gray-400" /> {ticket.empresa || '-'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Provincia</span>
                                    <p className="font-medium text-white flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-gray-400" /> {ticket.provincia || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Modal */}
            {editingTicket && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 border border-white/10 relative">

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                                Editar Entrada #{editingTicket.prodinfoid}
                            </h2>
                            <button
                                onClick={() => setEditingTicket(null)}
                                className="text-gray-500 hover:text-white transition-colors"
                            >
                                <div className="sr-only">Cerrar</div>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg text-sm mb-6">
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                                        Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingTicket.nombre || ''}
                                        onChange={(e) => setEditingTicket({ ...editingTicket, nombre: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none text-white transition placeholder-gray-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                                        Apellido *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingTicket.apellido || ''}
                                        onChange={(e) => setEditingTicket({ ...editingTicket, apellido: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none text-white transition placeholder-gray-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                                    Empresa *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editingTicket.empresa || ''}
                                    onChange={(e) => setEditingTicket({ ...editingTicket, empresa: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none text-white transition placeholder-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                                    Provincia *
                                </label>
                                <select
                                    required
                                    value={editingTicket.provincia || ''}
                                    onChange={(e) => setEditingTicket({ ...editingTicket, provincia: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none text-white transition"
                                >
                                    <option value="" className="bg-brand-dark text-gray-400">Seleccioná una provincia</option>
                                    {PROVINCIAS_ARGENTINA.map((prov) => (
                                        <option key={prov} value={prov} className="bg-brand-dark">
                                            {prov}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                                    Industria (opcional)
                                </label>
                                <select
                                    value={editingTicket.industria || ''}
                                    onChange={(e) => setEditingTicket({ ...editingTicket, industria: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none text-white transition"
                                >
                                    <option value="" className="bg-brand-dark text-gray-400">Seleccioná una industria</option>
                                    {INDUSTRIAS.map((ind) => (
                                        <option key={ind} value={ind} className="bg-brand-dark">
                                            {ind}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase flex items-center gap-2">
                                    <Linkedin className="w-3 h-3 text-brand-lime" /> LinkedIn (opcional)
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://linkedin.com/in/tu-perfil"
                                    value={editingTicket.linkedin || ''}
                                    onChange={(e) => setEditingTicket({ ...editingTicket, linkedin: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none text-white transition placeholder-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                                    Interés / Comentarios (opcional)
                                </label>
                                <textarea
                                    rows={3}
                                    maxLength={500}
                                    placeholder="¿Qué te interesa del evento?"
                                    value={editingTicket.interes || ''}
                                    onChange={(e) => setEditingTicket({ ...editingTicket, interes: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none resize-none text-white transition placeholder-gray-600"
                                ></textarea>
                                <p className="text-xs text-gray-500 mt-1 text-right font-mono">
                                    {editingTicket.interes?.length || 0} / 500
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black py-4 px-6 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 uppercase tracking-wide shadow-lg shadow-brand-lime/20"
                            >
                                {saving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                            <button
                                onClick={() => {
                                    setEditingTicket(null);
                                    setError('');
                                }}
                                className="px-6 py-4 border border-white/10 rounded-lg text-gray-400 font-bold hover:bg-white/5 hover:text-white transition uppercase tracking-wide"
                            >
                                Cancelar
                            </button>
                        </div>

                        <p className="text-[10px] text-gray-600 mt-4 text-center uppercase tracking-widest">
                            * Campos obligatorios para acreditarse
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
