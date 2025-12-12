import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsAndConditions() {
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
            Términos y <span className="text-brand-lime">Condiciones</span>
          </h1>
          
          <section className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              La compra de entradas y la asistencia al evento <strong>Food Delivery Day 2026</strong> implican la aceptación absoluta de los siguientes términos y condiciones:
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">1. Política de Entradas y Reembolsos</h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-brand-lime">
              <li>Las entradas son nominativas e intransferibles, salvo autorización expresa del Organizador.</li>
              <li><strong>No se aceptan cambios ni devoluciones</strong>, excepto en caso de cancelación total del evento por parte del Organizador.</li>
              <li>En caso de reprogramación por fuerza mayor, la entrada será válida para la nueva fecha.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">2. Derecho de Admisión y Permanencia</h2>
            <p>
              El Organizador se reserva el derecho de admisión y permanencia. Podrá denegarse el ingreso o expulsar del recinto a cualquier persona que no cumpla con las normas de conducta, ponga en riesgo la seguridad de los asistentes o realice actividades ilegales.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">3. Derechos de Imagen</h2>
            <p>
              Al asistir al evento, el titular de la entrada presta su conformidad y autorización expresa y gratuita para que su imagen y/o voz sea captada y fijada en cualquier tipo de soporte (fotografía, video, etc.) durante el evento, y autoriza su uso para la difusión y promoción del evento en cualquier medio de comunicación, a nivel mundial y sin límite de tiempo.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">4. Modificaciones del Evento</h2>
            <p>
              El Organizador se reserva el derecho de modificar la grilla de speakers, horarios o el lugar del evento por motivos de fuerza mayor o razones organizativas, sin que esto genere derecho a reclamo o devolución, siempre que se mantenga la esencia y calidad del evento.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">5. Jurisdicción</h2>
            <p>
              Para cualquier controversia que pudiera derivarse de la presente, las partes se someten a la jurisdicción de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}