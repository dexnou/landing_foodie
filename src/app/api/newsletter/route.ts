import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const API_URL = process.env.API_URL;
    const CLIENT = process.env.CLIENT_HEADER || 'foodday';

    // Nota: El endpoint original de subscribe no usaba bearer token en tu código anterior,
    // pero si lo necesita, agrégalo aquí. Asumo que no por tu código previo.
    const res = await fetch(`${API_URL}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client': CLIENT
      },
      body: JSON.stringify(body)
    });

    // Manejo robusto de respuesta
    if (!res.ok) throw new Error('Falló suscripción');
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error suscribiendo' }, { status: 500 });
  }
}