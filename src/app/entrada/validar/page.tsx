import { cookies } from 'next/headers';
import ValidationClient from '@/app/entrada/validar/client';

export const metadata = {
    title: 'Food Delivery Day - Validación de Entradas',
    description: 'Sistema de validación de entradas para staff.',
};

export default async function ValidationPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('staff_session');
    // Check if session cookie exists and has the expected value
    const isAuthenticated = sessionCookie?.value === 'active';

    return (
        <main className="min-h-screen w-full bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />

            <ValidationClient isAuthenticated={isAuthenticated} />
        </main>
    );
}
