import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-api';
import { sendMagicLinkEmail } from '@/lib/mail';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email requerido' }, { status: 400 });
        }

        // 1. Pedir al backend que genere el token (endpoint forgotPassword)
        const result = await backendFetch('/forgotPassword', {
            method: 'POST',
            body: { email }
        });

        if (!result.ok || !result.data.success) {
            return NextResponse.json({
                success: true,
                message: 'Si el email existe, se envió el link.'
            });
        }

        const token = result.data.token;

        // Si hay token, enviamos el email desde aquí
        if (token) {
            const publicUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            const magicLinkUrl = `${publicUrl}/crear-password?token=${token}`;

            console.log(`[NextAPI] Enviando Password Reset a ${email}`);
            await sendMagicLinkEmail(email, magicLinkUrl, true); // true = es password reset
        }

        return NextResponse.json({
            success: true,
            message: 'Si el email existe, se envió el link.'
        });

    } catch (error) {
        console.error('[NextAPI] Error:', error);
        return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
    }
}
