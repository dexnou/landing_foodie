import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/mail';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderid, name, email, ticketType, quantity, unitPrice, totalPrice } = body;

        // Validación básica
        if (!orderid || !email) {
            return NextResponse.json(
                { error: 'Faltan datos requeridos (orderId, email)' },
                { status: 400 }
            );
        }

        // Enviar email (no bloqueante para la UI, pero esperamos resultado aquí para confirmar)
        const emailSent = await sendOrderConfirmationEmail({
            to: email,
            name: name || 'Invitado',
            orderId: String(orderid),
            ticketType: ticketType || 'Entrada General',
            quantity: Number(quantity) || 1,
            unitPrice: unitPrice || '$12.000',
            totalPrice: totalPrice || unitPrice || '$12.000',
        });

        if (emailSent) {
            return NextResponse.json({ success: true, message: 'Email enviado' });
        } else {
            // Retornamos 200 aunque falle el email para no romper el flujo del usuario, pero logueamos error antes
            return NextResponse.json({ success: false, message: 'Error enviando email' }, { status: 200 });
        }

    } catch (error) {
        console.error("Error en confirmación de orden:", error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
