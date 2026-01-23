import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-api';
import { sendMagicLinkEmail } from '@/lib/mail';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email requerido' }, { status: 400 });
        }

        // 1. Pedir al backend que genere el token
        const result = await backendFetch('/requestMagicLink', {
            method: 'POST',
            body: { email }
        });

        if (!result.ok || !result.data.success) {
            // Si el backend falló o dijo que no (ej: no existe usuario)
            // Respondemos success igual para no revelar info, pero no mandamos mail
            return NextResponse.json({
                success: true,
                message: 'Si el email tiene entradas, se envió el link.'
            });
        }

        const token = result.data.token;

        // Si hay token, enviamos el email desde aquí
        if (token) {
            const publicUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            const magicLinkUrl = `${publicUrl}/login?token=${token}`;

            console.log(`[NextAPI] Enviando Magic Link a ${email}`);
            await sendMagicLinkEmail(email, magicLinkUrl, false); // false = es magic link normal, no reset
        } else {
            console.log(`[NextAPI] No se generó token para ${email} (probablemente no tiene órdenes)`);
        }

        return NextResponse.json({
            success: true,
            message: 'Si el email tiene entradas, se envió el link.'
        });

    } catch (error) {
        console.error('[NextAPI] Error:', error);
        return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
    }
}
