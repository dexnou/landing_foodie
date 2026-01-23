import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-api';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
        }

        const token = authHeader.substring(7);

        const result = await backendFetch('/myTickets', {
            method: 'GET',
            token // Pass JWT for Bearer auth
        });

        return NextResponse.json(result.data, { status: result.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
    }
}
