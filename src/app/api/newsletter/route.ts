import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const API_URL = process.env.API_URL;
    const CLIENT = process.env.CLIENT_HEADER || 'foodday';
    const SECRET_KEY = process.env.FOODDAY_SECRET_KEY; // <--- LLAVE

    const res = await fetch(`${API_URL}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client': CLIENT,
        'x-foodday-secret': SECRET_KEY || '' // <--- SOLO AGREGAMOS ESTO
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error('Falló suscripción');
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error suscribiendo' }, { status: 500 });
  }
}