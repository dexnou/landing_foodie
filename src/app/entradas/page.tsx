import { redirect } from 'next/navigation';

export default function EntradasRedirect({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Redirigimos a /mis-entradas, preservando el token si es necesario para algo futuro,
    // o simplemente enviamos al usuario al dashboard.
    // El usuario pidió explícitamente redirigir a /mis-entradas.

    // Si queremos preservar params:
    // const token = searchParams.token;
    // if (token) redirect(`/mis-entradas?token=${token}`);

    redirect('/mis-entradas');
}
