import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-brand-dark/90 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-6 transition-all">
      <div className="font-bold text-white text-xl tracking-tighter">
        FOOD DELIVERY <span className="text-brand-lime">DAY</span>
      </div>
      
      <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
        <Link href="#evento" className="hover:text-brand-lime transition-colors">El Evento</Link>
        <Link href="#agenda" className="hover:text-brand-lime transition-colors">Agenda</Link>
        <Link href="#sponsors" className="hover:text-brand-lime transition-colors">Sponsors</Link>
      </nav>

      <button className="md:hidden text-brand-lime font-bold text-sm uppercase tracking-widest">
        Menú
      </button>
    </header>
  );
}