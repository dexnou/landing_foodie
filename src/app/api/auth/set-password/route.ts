import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-api';

export async function POST(request: NextRequest) {
    try {
        const json = await request.json();
        const { token, password, confirmPassword } = json;

        if (!token || !password || !confirmPassword) {
            return NextResponse.json(
                { success: false, message: 'Faltan datos requeridos' },
                { status: 400 }
            );
        }

        const result = await backendFetch('/validateTokenAndSetPassword', {
            method: 'POST',
            body: { token, password, confirmPassword }
        });

        return NextResponse.json(result.data, { status: result.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
    }
}
