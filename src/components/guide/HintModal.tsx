'use client';

import React from 'react';
import { HelpCircle, Lightbulb, X, Wand2, Check, Copy } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';

export function HintModal() {
  const {
    isHintModalOpen,
    setIsHintModalOpen,
    getCurrentStep,
    hintLevel,
    setHintLevel,
    applyAutocomplete,
  } = useSimulatorStore();

  const [copied, setCopied] = React.useState(false);

  if (!isHintModalOpen) return null;

  const currentStep = getCurrentStep();
  const totalHints = currentStep.hints.length;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-[#18181b] border border-zinc-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-[#1f1f23]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Bantuan & Petunjuk: {currentStep.title}
              </h3>
              <p className="text-[11px] text-zinc-400">
                Pahami petunjuk bertahap agar hafal saat ujian Serkom
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsHintModalOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Hints list */}
          <div className="space-y-3">
            {currentStep.hints.map((hint, idx) => {
              const isRevealed = idx <= hintLevel;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition duration-200 ${
                    isRevealed
                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-100'
                      : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-amber-400">
                      Petunjuk #{idx + 1}
                    </span>
                    {!isRevealed && idx === hintLevel + 1 && (
                      <button
                        onClick={() => setHintLevel(idx)}
                        className="text-[10px] font-semibold text-blue-400 hover:underline"
                      >
                        Buka Petunjuk Ini 🔓
                      </button>
                    )}
                  </div>
                  {isRevealed ? (
                    <p className="leading-relaxed text-zinc-200">{hint}</p>
                  ) : (
                    <p className="italic text-zinc-600">Klik &quot;Buka Petunjuk Ini&quot; untuk melihat...</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Solution Code Section */}
          {currentStep.solutionCode && (
            <div className="pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-300">
                  Kode Solusi Sesuai Panduan:
                </span>
                <button
                  onClick={() => handleCopy(currentStep.solutionCode!)}
                  className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded bg-zinc-800 text-zinc-300 hover:text-white transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>
              </div>

              <pre className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-zinc-300 font-mono text-[11px] overflow-x-auto max-h-48 leading-relaxed">
                {currentStep.solutionCode}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-zinc-800 bg-[#161618] flex items-center justify-between">
          <button
            onClick={() => {
              applyAutocomplete();
              setIsHintModalOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Terapkan Solusi Otomatis & Lanjut</span>
          </button>

          <button
            onClick={() => setIsHintModalOpen(false)}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
