import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const API_URL = process.env.API_URL;
    const API_TOKEN = process.env.API_TOKEN;
    const CLIENT = process.env.CLIENT_HEADER || 'foodday';
    const SECRET_KEY = process.env.FOODDAY_SECRET_KEY; // <--- LLAVE

    const res = await fetch(`${API_URL}/agregarSponsors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client': CLIENT,
        'Authorization': `Bearer ${API_TOKEN}`,
        'x-foodday-secret': SECRET_KEY || '' // <--- SOLO AGREGAMOS ESTO
      },
      body: JSON.stringify(body)
    });

let data;
    try {
        data = await res.json();
    } catch {
        data = { success: res.ok };
    }

    // Si falla el backend, devolvemos el error al front
    if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error en API Route Sponsors:", error);
    return NextResponse.json({ error: 'Error interno sponsors' }, { status: 500 });
  }
}