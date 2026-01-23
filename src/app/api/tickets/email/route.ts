
import { NextResponse } from 'next/server';
import { sendTicketAccessEmail } from '@/lib/mail';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nombre, apellido, email, ticketId, token, almuerzo } = body;

        if (!email || !token || !ticketId) {
            return NextResponse.json({ success: false, error: 'Faltan datos requeridos' }, { status: 400 });
        }

        const emailSuccess = await sendTicketAccessEmail({
            nombre,
            apellido,
            email,
            ticketId,
            token,
            almuerzo
        });

        if (emailSuccess) {
            return NextResponse.json({ success: true, message: 'Email enviado correctamente' });
        } else {
            return NextResponse.json({ success: false, error: 'Error al enviar email' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error en API send-email:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
