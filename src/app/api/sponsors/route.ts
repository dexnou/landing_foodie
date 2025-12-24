import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const API_URL = process.env.API_URL;
    const API_TOKEN = process.env.API_TOKEN;
    const CLIENT = process.env.CLIENT_HEADER || 'foodday';

    const res = await fetch(`${API_URL}/agregarSponsors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client': CLIENT,
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify(body)
    });

    // Manejo flexible por si la API externa no devuelve JSON estricto
    let data;
    try {
        data = await res.json();
    } catch {
        data = { success: res.ok };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno sponsors' }, { status: 500 });
  }
}

// PARA CUANDO USEMOS COMMERCEUP API

