'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function AccordionItem({ title, time, children }: { title: string, time?: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full py-5 flex justify-between items-center text-left group"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
            {time && <span className="text-brand-lime font-mono text-sm font-bold">{time}</span>}
            <span className="font-bold text-white text-lg group-hover:text-brand-lime transition-colors">{title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mb-5' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden text-gray-400 text-sm leading-relaxed pr-8">
          {children}
        </div>
      </div>
    </div>
  );
}