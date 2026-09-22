'use client';

import React, { useState } from 'react';
import { FileCode, Check, Copy, Zap, MapPin, Lightbulb } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { getCodeLocationGuide } from '@/data/codeLocationGuides';

export function CodeLocationCard() {
  const { getCurrentStep, activeFilePath, openFile, applyAutocomplete } =
    useSimulatorStore();
  const currentStep = getCurrentStep();

  const [hasCopied, setHasCopied] = useState(false);

  const guide = getCodeLocationGuide(currentStep.id, currentStep.stepNumber);

  // If this step does not involve code editing and has no target file, do not render
  if (!guide && !currentStep.targetFilePath) return null;

  const targetFile = guide?.targetFile || currentStep.targetFilePath || '';
  const isCurrentlyOpen = activeFilePath === targetFile;

  const handleCopySnippet = () => {
    if (!guide?.snippetToInsert) return;
    navigator.clipboard.writeText(guide.snippetToInsert);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-sky-500/40 bg-[#0f172a]/60 backdrop-blur p-3.5 space-y-3 shadow-lg ring-1 ring-sky-500/20 text-zinc-100 animate-in fade-in duration-200">
      {/* Header Badge & Title */}
      <div className="flex items-center justify-between border-b border-sky-800/40 pb-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/40">
            <MapPin className="w-3 h-3 text-sky-400" />
            <span>Lokasi Penulisan Kode</span>
          </span>
        </div>
        <span className="text-[11px] text-sky-400/90 font-mono">
          Langkah {currentStep.stepNumber}
        </span>
      </div>

      {/* Target File Selector Row */}
      <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-black/50 border border-sky-900/60">
        <div className="flex items-center gap-2 overflow-hidden">
          <FileCode className="w-4 h-4 text-sky-400 shrink-0" />
          <div className="overflow-hidden">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
              File yang harus diedit:
            </div>
            <code className="font-mono text-xs font-bold text-white block truncate">
              {targetFile}
            </code>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openFile(targetFile)}
          className={`px-3 py-1.5 rounded text-[11.5px] font-semibold transition shrink-0 flex items-center gap-1.5 shadow ${
            isCurrentlyOpen
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/50 cursor-default'
              : 'bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white'
          }`}
        >
          {isCurrentlyOpen ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>File Aktif</span>
            </>
          ) : (
            <>
              <span>📂 Buka File Ini</span>
            </>
          )}
        </button>
      </div>

      {/* Position in File (Where to write) */}
      {guide?.locationTitle && (
        <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800/80 space-y-1 text-xs">
          <div className="font-bold text-sky-300 flex items-center gap-1.5 text-[11.5px]">
            <span>🎯 Posisi di Dalam File:</span>
            <span className="text-zinc-200 font-mono text-[11px] bg-zinc-800/80 px-1.5 py-0.5 rounded">
              {guide.locationTitle}
            </span>
          </div>
          <p className="text-[11.5px] text-zinc-300 leading-relaxed pl-0.5">
            {guide.locationDetail}
          </p>
        </div>
      )}

      {/* Code Snippet Box (How to write) */}
      {guide?.snippetToInsert && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 font-medium">
              {guide.snippetDescription || 'Kodingan yang harus dimasukkan:'}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopySnippet}
                className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-200 text-[11px] font-semibold flex items-center gap-1 border border-zinc-700 transition"
                title="Salin kodingan ini ke clipboard"
              >
                {hasCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-300">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-zinc-400" />
                    <span>Salin Kode</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={applyAutocomplete}
                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-[11px] font-semibold flex items-center gap-1 transition shadow"
                title="Langsung terapkan kodingan lengkap ke editor"
              >
                <Zap className="w-3 h-3 text-amber-300" />
                <span>Masukkan ke File</span>
              </button>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0b0f19] border border-sky-900/40 font-mono text-[11.5px] text-sky-200 overflow-x-auto leading-relaxed select-text shadow-inner">
            <pre className="m-0 whitespace-pre-wrap">{guide.snippetToInsert}</pre>
          </div>
        </div>
      )}

      {/* Exam Tips if available */}
      {guide?.tips && (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-amber-300 font-semibold">Tips Asesor: </strong>
            {guide.tips}
          </span>
        </div>
      )}
    </div>
  );
}
