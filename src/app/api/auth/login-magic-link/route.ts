import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-api';

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ success: false, message: 'Token requerido' }, { status: 400 });
        }

        const result = await backendFetch('/loginWithMagicLink', {
            method: 'POST',
            body: { token }
        });

        if (!result.ok) {
            return NextResponse.json(result.data, { status: result.status });
        }

        return NextResponse.json(result.data);

    } catch (error) {
        console.error('[NextAPI] Error en login-magic-link:', error);
        return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
    }
}
