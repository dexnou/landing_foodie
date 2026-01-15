import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const API_URL = process.env.API_URL;
    const API_TOKEN = process.env.API_TOKEN;
    const CLIENT = process.env.CLIENT_HEADER || 'foodday';
    const SECRET_KEY = process.env.FOODDAY_SECRET_KEY; // <--- LLAVE

    const res = await fetch(`${API_URL}/crearOrden`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client': CLIENT,
        'Authorization': `Bearer ${API_TOKEN}`,
        'x-foodday-secret': SECRET_KEY || '' // <--- SOLO AGREGAMOS ESTO
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status }); 
  } catch (error) {
    return NextResponse.json({ error: 'Error interno al crear orden' }, { status: 500 });
  }
}