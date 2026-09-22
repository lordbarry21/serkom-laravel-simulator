'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface SpotlightProps {
  label?: string;
  active?: boolean;
}

export function SpotlightPulse({ label = 'Interaksi Di Sini', active = true }: SpotlightProps) {
  if (!active) return null;

  return (
    <div className="relative inline-flex items-center">
      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap animate-bounce flex items-center gap-1 z-30">
        <Sparkles className="w-2.5 h-2.5" />
        <span>{label}</span>
      </span>
      <span className="absolute inset-0 rounded-xl border-2 border-blue-500 animate-ping opacity-75 pointer-events-none" />
    </div>
  );
}
