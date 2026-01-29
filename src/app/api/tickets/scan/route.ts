import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const sessionCallback = cookieStore.get('staff_session');

        // 1. Check Session
        if (!sessionCallback || sessionCallback.value !== 'active') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate request body
        if (!body || !body.token) {
            return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
        }

        const API_URL = process.env.API_URL;
        const API_TOKEN = process.env.API_TOKEN;
        const CLIENT = process.env.CLIENT_HEADER || 'foodday';
        const SECRET_KEY = process.env.FOODDAY_SECRET_KEY;

        // 2. Proxy to External API
        const res = await fetch(`${API_URL}/tickets/scan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'client': CLIENT,
                'Authorization': `Bearer ${API_TOKEN}`,
                'x-foodday-secret': SECRET_KEY || ''
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });

    } catch (error) {
        console.error("❌ Error Ticket Scan:", error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
