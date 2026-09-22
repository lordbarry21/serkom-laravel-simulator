'use client';

import React from 'react';
import { BookOpen, CheckCircle2, RotateCcw, Sparkles, Terminal, Monitor, Code2 } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';

export function Header() {
  const {
    modules,
    currentModuleId,
    currentStepIndex,
    setModule,
    resetAll,
    activeRightTab,
    setRightTab,
    setIsPanduanModalOpen,
  } = useSimulatorStore();

  const currentModule = modules.find((m) => m.id === currentModuleId) || modules[0];
  const totalStepsInModule = currentModule.steps.length;
  const currentStepNumberInModule = currentStepIndex + 1;
  const progressPercent = Math.round((currentStepNumberInModule / totalStepsInModule) * 100);

  return (
    <header className="h-11 bg-[#121214] border-b border-zinc-800/80 text-zinc-200 px-3.5 flex items-center justify-between select-none z-20 shrink-0">
      {/* Brand & Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded bg-red-500/15 border border-red-500/30 text-red-500 flex items-center justify-center shrink-0">
          <Code2 className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white tracking-tight">
            Serkom Laravel Simulator
          </span>
          <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/60">
            LSP
          </span>
        </div>
      </div>

      {/* Module Selector Segmented Tabs */}
      <div className="hidden lg:flex items-center bg-zinc-900/90 p-0.5 rounded-lg border border-zinc-800/80 gap-0.5">
        {modules.map((mod) => {
          const isActive = mod.id === currentModuleId;
          return (
            <button
              key={mod.id}
              onClick={() => setModule(mod.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-zinc-800 text-white border border-zinc-700/70 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <span className={`font-mono text-[11px] font-bold ${isActive ? 'text-red-400' : 'text-zinc-500'}`}>
                M{mod.id}
              </span>
              <span className="hidden xl:inline">{mod.badge}</span>
            </button>
          );
        })}
      </div>

      {/* Progress & Quick Controls */}
      <div className="flex items-center gap-3">
        {/* Module Step Progress */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-zinc-400 font-mono text-[11px]">
            Langkah {currentStepNumberInModule}/{totalStepsInModule}
          </span>
          <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="hidden md:block h-3.5 w-px bg-zinc-800" />

        {/* Right Panel View Mode Switch */}
        <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs">
          <button
            onClick={() => setRightTab('terminal')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs font-medium transition ${
              activeRightTab === 'terminal'
                ? 'bg-zinc-800 text-emerald-400 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Tampilkan Terminal"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Terminal</span>
          </button>
          <button
            onClick={() => setRightTab('preview')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs font-medium transition ${
              activeRightTab === 'preview'
                ? 'bg-zinc-800 text-sky-400 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Tampilkan Live Preview"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>

        {/* Panduan & Mindmap Button */}
        <button
          onClick={() => setIsPanduanModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700/80 transition"
          title="Buka Buku Panduan, Mindmap & Tabel Sintaks Keramat"
        >
          <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden sm:inline">Buku Panduan</span>
        </button>

        {/* Reset button */}
        <button
          onClick={() => {
            if (window.confirm('Reset seluruh progress ke kondisi awal (dari 0)?')) {
              resetAll();
            }
          }}
          className="p-1 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800/80 transition"
          title="Reset Simulator ke Nol"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
