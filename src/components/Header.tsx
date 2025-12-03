'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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
      className={`fixed top-0 left-0 w-full z-50 h-16 flex justify-center transition-all duration-300 ${
        isScrolled 
          ? 'bg-brand-dark/90 backdrop-blur-md border-b border-white/10 shadow-lg' 
          : 'bg-transparent border-transparent'
      }`}
    >
      {/* Agregamos 'relative' para que el absolute funcione respecto a este contenedor */}
      <div className="w-full max-w-6xl flex items-center justify-between px-6 relative">
        
        {/* 1. LOGO */}
        <div className="font-bold text-white text-xl tracking-tighter cursor-pointer z-10">
          <Link href="/">
            FOOD DELIVERY <span className="text-brand-lime">DAY</span>
          </Link>
        </div>
        
        {/* 2. NAV - CENTRADO ABSOLUTO */}
        {/* Usamos absolute + transform para centrarlo matemáticamente perfecto */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="#evento" className="hover:text-brand-lime transition-colors">El Evento</Link>
          <Link href="#agenda" className="hover:text-brand-lime transition-colors">Agenda</Link>
          <Link href="#sponsors" className="hover:text-brand-lime transition-colors">Sponsors</Link>
        </nav>

        {/* 3. ACCIONES */}
        <div className="flex items-center gap-4 z-10">
          <button 
            onClick={onReserve}
            className="bg-brand-lime hover:bg-brand-limeHover text-brand-dark font-bold text-xs px-4 py-2 rounded-full transition-all cursor-pointer transform hover:scale-105"
          >
            RESERVAR
          </button>

          <button className="md:hidden text-brand-lime font-bold text-sm uppercase tracking-widest ml-2">
            Menú
          </button>
        </div>

      </div>
    </header>
  );
}