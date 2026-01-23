import { NextResponse } from 'next/server';
import https from 'https';
import http from 'http';

const API_URL = process.env.API_URL;
const API_SECRET = process.env.FOODDAY_SECRET_KEY;
const DB_TOKEN = process.env.COMMERCEUP_TOKEN;

// Agente HTTPS permisivo para desarrollo (ignora self-signed certs)
const httpsAgent = new https.Agent({
    rejectUnauthorized: process.env.NODE_ENV === 'production' // Solo validar en prod
});

// Agente HTTP (por si acaso hacemos keep-alive)
const httpAgent = new http.Agent({
    keepAlive: true
});

interface BackendRequestOptions {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    token?: string;
}

export async function backendFetch(endpoint: string, options: BackendRequestOptions = {}) {
    const { method = 'GET', body, headers = {}, token } = options;

    const reqHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-foodday-secret': API_SECRET || '',
        'dbtoken': DB_TOKEN || '',
        ...headers,
    };

    if (token) {
        reqHeaders['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_URL}${endpoint}`;

    // Seleccionar agente basado en protocolo
    const isHttps = url.startsWith('https:');
    const agent = isHttps ? httpsAgent : httpAgent;

    console.log(`[Backend-API] ${method} ${url}`);

    try {
        const response = await fetch(url, {
            method,
            headers: reqHeaders,
            body: body ? JSON.stringify(body) : undefined,
            // @ts-ignore - node-fetch support via nextjs polyfill usually handles agent but native fetch in Node 18+ might not.
            // Next.js 13+ extiende fetch. Para pasar opciones de bajo nivel de Node a veces se necesita algo específico.
            // Pero usualmente, si falla certificado, es mejor arreglar la URL.
            // Si estamos en entorno Node (Server Components / API Routes), podemos configurar el agente globalmente o usar trick.
            // Sin embargo, para no complicar, 'fetch' nativo no acepta 'agent'.
            // Solución: Si es dev y localhost, ignoramos error de SSL seteando variable de entorno temporalmente o confiando en el fix de la URL.
        });

        // NOTA: Native fetch de Node no usa 'agent'. Si seguimos teniendo dramas de SSL self-signed,
        // la solución es NODE_TLS_REJECT_UNAUTHORIZED='0' en el package.json dev script.
        // O usar http como hicimos en el .env.local.

        const data = await response.json();

        if (!response.ok) {
            console.error(`[Backend-API] Error ${response.status}:`, data);
            return { ok: false, status: response.status, data };
        }

        return { ok: true, status: 200, data };

    } catch (error: any) {
        console.error(`[Backend-API] Network Error calling ${url}:`, error.message);

        if (error.cause?.code === 'ERR_SSL_WRONG_VERSION_NUMBER') {
            console.error('🚨 DIAGNÓSTICO: Protocol Mismatch. Estás usando HTTPS contra un server HTTP.');
            console.error('👉 Solución: Cambiá API_URL a http:// en .env.local');
        }
        else if (error.cause?.code === 'ECONNREFUSED') {
            console.error('🚨 DIAGNÓSTICO: El servidor backend no está corriendo o el puerto es incorrecto.');
        }

        return {
            ok: false,
            status: 500,
            data: { success: false, message: 'Error de conexión con el backend', debug: error.message },
        };
    }
}
