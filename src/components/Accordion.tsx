'use client';
import { useState } from 'react';
import { ChevronDown, Clock } from 'lucide-react';

interface AccordionItemProps {
  time?: string;
  title: string;
  children: React.ReactNode;
}

export default function AccordionItem({ time, title, children }: AccordionItemProps) {
  // CAMBIO CLAVE: Estado inicial en 'true' para que esté abierto por defecto
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-white/10 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left group hover:bg-white/5 px-4 rounded-lg transition-colors"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
          {time && (
            <span className="flex items-center gap-2 text-brand-lime font-mono text-sm font-bold bg-brand-lime/10 px-3 py-1 rounded-full border border-brand-lime/20 min-w-[90px] justify-center">
              <Clock className="w-3 h-3" />
              {time}
            </span>
          )}
          <span className="font-bold text-lg md:text-xl text-white group-hover:text-brand-lime transition-colors">
            {title}
          </span>
        </div>
        
        <div className={`p-2 rounded-full border border-white/10 transition-all duration-300 ${isOpen ? 'bg-brand-lime text-brand-dark rotate-180' : 'text-gray-400 group-hover:border-brand-lime'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden px-4 md:pl-[130px]">
          <div className="text-gray-400 leading-relaxed border-l-2 border-brand-lime/20 pl-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}