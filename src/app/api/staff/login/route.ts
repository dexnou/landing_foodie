import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code } = body;

        const API_URL = process.env.API_URL;
        const API_TOKEN = process.env.API_TOKEN;
        const CLIENT = process.env.CLIENT_HEADER || 'foodday';
        const SECRET_KEY = process.env.FOODDAY_SECRET_KEY;

        // 1. Proxy to External API
        const res = await fetch(`${API_URL}/staff/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'client': CLIENT,
                'Authorization': `Bearer ${API_TOKEN}`,
                'x-foodday-secret': SECRET_KEY || '',
                // Forward IP if possible, though Next.js might rely on x-forwarded-for headers from the hosting platform
            },
            body: JSON.stringify({ code })
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        // 2. Set Session Cookie on Success
        if (data.success) {
            const cookieStore = await cookies();
            // Set a simple session indicator. 
            // In a more complex app we might sign this, but here it's just a gatekeeper for the frontend
            // and the "Strict Mode" says Next.js shouldn't have business logic.
            // We'll set a simple value to indicate "logged in" for the middleware/frontend 
            // to check before showing the scanner.
            cookieStore.set('staff_session', 'active', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 3, // 3 hours
                path: '/',
            });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("❌ Error Staff Login:", error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
