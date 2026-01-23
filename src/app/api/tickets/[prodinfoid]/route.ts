import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-api';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ prodinfoid: string }> }
) {
    try {
        const { prodinfoid } = await params;

        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
        }
        const token = authHeader.substring(7);

        const body = await request.json();

        const result = await backendFetch(`/ticket/${prodinfoid}`, {
            method: 'PUT',
            token,
            body
        });

        return NextResponse.json(result.data, { status: result.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
    }
}
