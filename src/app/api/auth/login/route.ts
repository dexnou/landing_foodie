import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-api';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email y password requeridos' },
                { status: 400 }
            );
        }

        const result = await backendFetch('/login', {
            method: 'POST',
            body: { email, password }
        });

        return NextResponse.json(result.data, { status: result.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
    }
}
