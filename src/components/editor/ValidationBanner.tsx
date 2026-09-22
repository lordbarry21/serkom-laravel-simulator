'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Wand2, HelpCircle } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';

export function ValidationBanner() {
  const {
    validationResult,
    getCurrentStep,
    activeFilePath,
    applyAutocomplete,
    setIsHintModalOpen,
  } = useSimulatorStore();

  const currentStep = getCurrentStep();
  const isTargetFile = activeFilePath === currentStep.targetFilePath;

  // Only show if the active file is the target file and step requires code edits
  const hasCodeCriteria = currentStep.criteria.some((c) => c.type === 'code_edit');
  if (!hasCodeCriteria || !isTargetFile) return null;

  if (validationResult.isValid) {
    return (
      <div className="bg-emerald-950/40 border-b border-emerald-500/30 px-3.5 py-2 flex items-center justify-between text-xs text-emerald-200 select-none animate-in fade-in duration-200">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">
            Kode valid! Seluruh baris sintaks sesuai dengan standar Serkom.
          </span>
        </div>
      </div>
    );
  }

  if (validationResult.missingRequirements && validationResult.missingRequirements.length > 0) {
    return (
      <div className="bg-amber-950/40 border-b border-amber-500/30 px-3.5 py-2 text-xs text-amber-200 select-none space-y-1 animate-in fade-in duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Kriteria Kode Belum Lengkap:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHintModalOpen(true)}
              className="text-[11px] text-amber-300 hover:text-white underline cursor-pointer"
            >
              Lihat Petunjuk
            </button>
            <button
              onClick={applyAutocomplete}
              className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition cursor-pointer"
            >
              <Wand2 className="w-3 h-3" />
              <span>Lengkapi Otomatis</span>
            </button>
          </div>
        </div>

        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-100/90 pl-1">
          {validationResult.missingRequirements.map((msg, index) => (
            <li key={index} className="truncate">
              {msg}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}
