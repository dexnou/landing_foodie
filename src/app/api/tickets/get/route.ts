import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) return NextResponse.json({ error: 'Falta Order ID' }, { status: 400 });

    const API_URL = process.env.API_URL;
    const API_TOKEN = process.env.API_TOKEN;
    const CLIENT = process.env.CLIENT_HEADER || 'foodday';

    const res = await fetch(`${API_URL}/traerProdsOrden/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'client': CLIENT,
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: 'Error obteniendo entradas' }, { status: 500 });
  }
}