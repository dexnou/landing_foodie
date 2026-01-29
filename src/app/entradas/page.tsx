import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function EntradasPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const token = searchParams.token;

    // Check for staff session
    const cookieStore = await cookies();
    const staffSession = cookieStore.get('staff_session');

    if (staffSession?.value === 'active' && token) {
        // Si es Staff y hay token -> Redirigir a validar en lugar de mis-entradas
        redirect(`/entrada/validar?token=${token}`);
    }

    // Comportamiento normal (Usuario final) -> Redirigir a sus entradas
    redirect('/mis-entradas');
}
