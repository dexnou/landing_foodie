import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <main className="bg-brand-dark min-h-screen text-white font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* BOTÓN VOLVER */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-lime transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Volver al inicio</span>
          </Link>
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-8 uppercase tracking-tight">
            Política de <span className="text-brand-lime">Privacidad</span>
          </h1>
          
          <section className="space-y-4 text-gray-300 leading-relaxed">
            <p><strong>Última actualización:</strong> Diciembre 2025</p>
            <p>
              En <strong>Food Delivery Day</strong> (en adelante, "el Organizador"), nos comprometemos a proteger la privacidad de los asistentes y usuarios de nuestro sitio web. Esta política describe cómo recopilamos, usamos y protegemos su información personal, en cumplimiento con la <strong>Ley de Protección de Datos Personales N° 25.326</strong> de la República Argentina.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">1. Información que Recopilamos</h2>
            <p>Recopilamos información personal que usted nos proporciona voluntariamente al registrarse o comprar una entrada, incluyendo:</p>
            <ul className="list-disc pl-5 space-y-2 marker:text-brand-lime">
              <li>Nombre y apellido.</li>
              <li>Correo electrónico corporativo o personal.</li>
              <li>Número de teléfono.</li>
              <li>Nombre de la empresa u organización.</li>
              <li>Datos de facturación (procesados de forma segura a través de Mercado Pago).</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">2. Finalidad del Tratamiento</h2>
            <p>Utilizamos sus datos personales para los siguientes fines:</p>
            <ul className="list-disc pl-5 space-y-2 marker:text-brand-lime">
              <li>Procesar su inscripción y enviar sus entradas digitales (QR).</li>
              <li>Comunicar novedades, cambios de agenda o información logística del evento.</li>
              <li>Enviar newsletters o promociones de nuestros sponsors, siempre que haya dado su consentimiento (opt-in).</li>
              <li>Realizar análisis estadísticos anónimos para mejorar futuras ediciones.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">3. Compartición de Datos</h2>
            <p>
              No vendemos sus datos a terceros. Podemos compartir información limitada con proveedores de servicios estrictamente necesarios para la operación del evento (ej: plataforma de acreditación, servicio de mailing) o con Sponsors oficiales únicamente si usted ha dado su consentimiento explícito.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">4. Derechos del Titular (Derechos ARCO)</h2>
            <p>
              El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley Nº 25.326.
            </p>
            <p>
              La <strong>AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA</strong>, Órgano de Control de la Ley Nº 25.326, tiene la atribución de atender las denuncias y reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de datos personales.
            </p>
            <p className="pt-4">
              Para ejercer sus derechos, contáctenos en: <a href="mailto:hola@fooddeliveryday.com" className="text-brand-lime hover:underline font-bold">hola@fooddeliveryday.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}