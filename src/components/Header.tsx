'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  onReserve: () => void;
}

export default function Header({ onReserve }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 h-20 flex justify-center transition-all duration-300 ${isScrolled
          ? 'bg-brand-dark/90 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-transparent border-transparent'
        }`}
    >
      {/* Container Principal con 'relative' para centrar el nav */}
      <div className="w-full max-w-6xl flex items-center justify-between px-6 relative h-full">

        {/* 1. LOGO IMAGEN */}
        <div className="z-10 flex items-center">
          <Link href="/" className="group">
            {/* Contenedor relativo para la imagen */}
            <div className="relative w-40 h-10 md:w-48 md:h-12 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo-foodie.png"
                alt="Food Delivery Day Logo"
                fill
                className="object-contain object-left"
                priority // Carga prioritaria al ser el header
              />
            </div>
          </Link>
        </div>

        {/* 2. NAV - CENTRADO ABSOLUTO */}
        <nav className="hidden md:flex gap-8 text-sm font-bold text-gray-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="#evento" className="hover:text-brand-lime transition-colors uppercase tracking-wider">El Evento</Link>
          <Link href="#agenda" className="hover:text-brand-lime transition-colors uppercase tracking-wider">Agenda</Link>
          <Link href="#sponsors" className="hover:text-brand-lime transition-colors uppercase tracking-wider">Sponsors</Link>
        </nav>

        {/* 3. ACCIONES */}
        <div className="flex items-center gap-4 z-10">
          <button
            onClick={onReserve}
            className="bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-black text-xs px-6 py-2.5 rounded-full transition-all cursor-pointer transform hover:scale-105 uppercase tracking-wide shadow-[0_0_15px_-3px_rgba(190,242,100,0.3)]"
          >
            Reservar
          </button>
        </div>

      </div>
    </header>
  );
}