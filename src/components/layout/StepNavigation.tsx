'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, Lock, Sparkles, Wand2 } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';

export function StepNavigation() {
  const {
    currentModuleId,
    currentStepIndex,
    getCurrentStep,
    isCurrentStepCompleted,
    nextStep,
    prevStep,
    applyAutocomplete,
    setIsHintModalOpen,
  } = useSimulatorStore();

  const isCompleted = isCurrentStepCompleted();
  const currentStep = getCurrentStep();
  const isFirstStep = currentModuleId === 1 && currentStepIndex === 0;

  return (
    <div className="border-t border-zinc-800 bg-[#141416] p-3 flex items-center justify-between gap-2 select-none">
      {/* Left: Hint and Autocomplete */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsHintModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800/80 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 transition shadow-sm"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Petunjuk</span>
        </button>

        <button
          onClick={applyAutocomplete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 transition shadow-sm"
          title="Terapkan solusi otomatis jika macet"
        >
          <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Isi Otomatis</span>
        </button>
      </div>

      {/* Right: Prev & Next Guard */}
      <div className="flex items-center gap-2">
        <button
          onClick={prevStep}
          disabled={isFirstStep}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
            isFirstStep
              ? 'opacity-40 cursor-not-allowed text-zinc-500 border-zinc-800'
              : 'text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border-zinc-700'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        <button
          onClick={nextStep}
          disabled={!isCompleted}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition duration-200 shadow-md ${
            isCompleted
              ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-emerald-950/50 animate-pulse-glow cursor-pointer'
              : 'bg-zinc-800/90 text-zinc-500 border border-zinc-800 cursor-not-allowed'
          }`}
        >
          {isCompleted ? (
            <>
              <span>Lanjut Langkah</span>
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
              <span>Selesaikan Kriteria</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
