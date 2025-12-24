import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Variables de entorno para CommerceUp
    const COMMERCEUP_URL = process.env.COMMERCEUP_API_URL;
    const COMMERCEUP_TOKEN = process.env.COMMERCEUP_TOKEN || process.env.API_TOKEN;

    // Si no está configurada la URL, devolvemos vacío y seguimos (fail-safe)
    if (!COMMERCEUP_URL) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    // Llamada a la API de CommerceUp (Asumiendo endpoint /contactos)
    const res = await fetch(`${COMMERCEUP_URL}/contactos?tipo=sponsor`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COMMERCEUP_TOKEN}`,
        'dbtoken': COMMERCEUP_TOKEN || ''
      },
      next: { revalidate: 60 } // Cache de 60 segundos para optimizar
    });

    if (!res.ok) {
        // Si el endpoint no existe o falla, devolvemos vacío sin romper nada
        console.warn(`[BFF Sponsors] API respondió status: ${res.status}`);
        return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    const data = await res.json();
    // Normalizamos la respuesta por si viene como { data: [...] } o [...]
    const sponsors = Array.isArray(data) ? data : (data.data || []);

    return NextResponse.json({ success: true, data: sponsors }, { status: 200 });

  } catch (error) {
    console.error("[BFF Sponsors] Error interno:", error);
    // En caso de error crítico, devolvemos vacío para proteger el frontend
    return NextResponse.json({ success: true, data: [] }, { status: 200 });
  }
}