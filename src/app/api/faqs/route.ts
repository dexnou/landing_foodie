import { NextResponse } from 'next/server';
import https from 'https';

export async function GET() {
  try {
    const COMMERCEUP_URL = process.env.COMMERCEUP_API_URL;
    const COMMERCEUP_TOKEN = process.env.COMMERCEUP_TOKEN || process.env.API_TOKEN;

    if (!COMMERCEUP_URL) {
      return NextResponse.json({ error: 'Configuración COMMERCEUP_URL faltante' }, { status: 500 });
    }

    // Agent para ignorar SSL en local si fuera necesario
    const agent = new https.Agent({ rejectUnauthorized: false });

    console.log(`📡 [BFF] Consultando: ${COMMERCEUP_URL}/frequentquestions`);

    const res = await fetch(`${COMMERCEUP_URL}/frequentquestions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COMMERCEUP_TOKEN}` // ✅ SOLO Bearer, sin dbtoken
      },
      next: { revalidate: 0 },
      // @ts-ignore
      agent: agent 
    });

    if (!res.ok) {
        console.warn(`⚠️ [BFF] Error status CommerceUp: ${res.status} - ${res.statusText}`);
        return NextResponse.json({ success: false, data: [] }, { status: res.status });
    }

    const rawData = await res.json();
    
    // --- LOG PARA DEBUGGEAR (MIRA LA TERMINAL) ---
    console.log("📦 [BFF] Respuesta CRUDA de CommerceUp:", JSON.stringify(rawData, null, 2));
    // ---------------------------------------------

    let faqs = Array.isArray(rawData) ? rawData : (rawData.data || []);

    // Filtrado (aseguramos que visible sea true/1)
    faqs = faqs.filter((f: any) => f.visible === 1 || f.visible === true || f.visible === "1");
    
    // Ordenamiento
    faqs.sort((a: any, b: any) => (a.orden || 0) - (b.orden || 0));

    console.log(`✅ [BFF] Enviando ${faqs.length} FAQs filtradas al frontend.`);

    return NextResponse.json({ success: true, data: faqs }, { status: 200 });

  } catch (error) {
    console.error("💥 [BFF] Error interno:", error);
    return NextResponse.json({ error: 'Error interno obteniendo FAQs' }, { status: 500 });
  }
}