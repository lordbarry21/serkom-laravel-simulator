'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Wand2,
  Copy,
  Check,
  MapPin,
} from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { getCodeLocationGuide } from '@/data/codeLocationGuides';

export function ValidationBanner() {
  const {
    validationResult,
    getCurrentStep,
    activeFilePath,
    openFile,
    applyAutocomplete,
    setIsHintModalOpen,
  } = useSimulatorStore();

  const [hasCopied, setHasCopied] = useState(false);

  const currentStep = getCurrentStep();
  const hasCodeCriteria = currentStep.criteria.some((c) => c.type === 'code_edit');

  // If this step does not require code editing, no banner needed
  if (!hasCodeCriteria || !currentStep.targetFilePath) return null;

  const isTargetFile = activeFilePath === currentStep.targetFilePath;
  const guide = getCodeLocationGuide(currentStep.id, currentStep.stepNumber);

  const handleCopy = () => {
    if (!guide?.snippetToInsert) return;
    navigator.clipboard.writeText(guide.snippetToInsert);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // 1. Alert if the user is viewing the wrong file
  if (!isTargetFile) {
    return (
      <div className="bg-amber-950/70 border-b border-amber-500/40 px-3.5 py-2 flex items-center justify-between text-xs text-amber-200 select-none animate-in fade-in duration-200">
        <div className="flex items-center gap-2 overflow-hidden">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="leading-tight">
            <span className="font-bold text-amber-300">File Berbeda Terbuka! </span>
            <span className="text-zinc-300">
              Langkah {currentStep.stepNumber} harus dikerjakan pada:
            </span>
            <code className="ml-1.5 font-mono font-bold text-white bg-black/60 px-1.5 py-0.5 rounded border border-amber-500/30">
              {currentStep.targetFilePath}
            </code>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openFile(currentStep.targetFilePath!)}
          className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-semibold text-[11px] transition shrink-0 flex items-center gap-1 shadow"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Buka File Target</span>
        </button>
      </div>
    );
  }

  // 2. Success state when code meets all criteria
  if (validationResult.isValid) {
    return (
      <div className="bg-emerald-950/40 border-b border-emerald-500/30 px-3.5 py-2 flex items-center justify-between text-xs text-emerald-200 select-none animate-in fade-in duration-200">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">
            Kode valid! Seluruh baris sintaks di file ini sudah sesuai modul Serkom.
          </span>
        </div>
      </div>
    );
  }

  // 3. Incomplete code state: show exact location and snippets
  return (
    <div className="bg-[#1a1508] border-b border-amber-500/30 px-3.5 py-2.5 text-xs text-amber-200 select-none space-y-2 animate-in fade-in duration-200 font-sans">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-bold text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Kriteria Kode Langkah {currentStep.stepNumber} Belum Lengkap</span>
        </div>

        <div className="flex items-center gap-1.5">
          {guide?.snippetToInsert && (
            <button
              type="button"
              onClick={handleCopy}
              className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-200 text-[11px] font-semibold flex items-center gap-1 border border-zinc-700 transition"
              title="Salin kode yang harus ditulis"
            >
              {hasCopied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-zinc-400" />
                  <span>Salin Kode</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsHintModalOpen(true)}
            className="text-[11px] text-amber-300 hover:text-white underline cursor-pointer px-1"
          >
            Petunjuk
          </button>

          <button
            type="button"
            onClick={applyAutocomplete}
            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white transition shadow cursor-pointer"
            title="Langsung terapkan kodingan lengkap yang benar"
          >
            <Wand2 className="w-3 h-3 text-amber-300" />
            <span>Terapkan Kode</span>
          </button>
        </div>
      </div>

      {/* Position guide if available */}
      {guide?.locationTitle && (
        <div className="text-[11.5px] text-zinc-300 bg-black/40 p-2 rounded border border-amber-500/20 flex items-start gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-sky-300">Lokasi: </strong>
            <span className="text-zinc-200">{guide.locationTitle}. </span>
            <span className="text-zinc-400">{guide.locationDetail}</span>
          </div>
        </div>
      )}

      {/* Missing items list */}
      {validationResult.missingRequirements &&
        validationResult.missingRequirements.length > 0 && (
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-100/90 pl-1">
            {validationResult.missingRequirements.map((msg, index) => (
              <li key={index} className="truncate">
                {msg}
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
