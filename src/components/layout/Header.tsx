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
  } = useSimulatorStore();

  const currentModule = modules.find((m) => m.id === currentModuleId) || modules[0];
  const totalStepsInModule = currentModule.steps.length;
  const currentStepNumberInModule = currentStepIndex + 1;
  const progressPercent = Math.round((currentStepNumberInModule / totalStepsInModule) * 100);

  return (
    <header className="bg-[#18181b] border-b border-[#27272a] text-zinc-200 px-4 py-2.5 flex items-center justify-between select-none z-20">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold text-base shadow-md shadow-red-950/40">
          <Code2 className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              Serkom Laravel Simulator
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                Pesan Makan LSP
              </span>
            </h1>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">
            Interactive 3-Panel EdTech Workspace &bull; 4 Modul Terpadu
          </p>
        </div>
      </div>

      {/* Module Selector Pills */}
      <div className="hidden lg:flex items-center bg-[#27272a]/60 p-1 rounded-xl border border-zinc-800 gap-1">
        {modules.map((mod) => {
          const isActive = mod.id === currentModuleId;
          return (
            <button
              key={mod.id}
              onClick={() => setModule(mod.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-red-600 text-white shadow-sm shadow-red-900/50'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <span>{mod.id === 1 ? 'M1' : mod.id === 2 ? 'M2' : mod.id === 3 ? 'M3' : 'M4'}</span>
              <span className="hidden xl:inline">{mod.badge}</span>
            </button>
          );
        })}
      </div>

      {/* Progress & Quick Controls */}
      <div className="flex items-center gap-4">
        {/* Module Step Progress */}
        <div className="hidden sm:flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-zinc-400">Modul {currentModuleId}:</span>
            <span className="font-bold text-white">
              {currentStepNumberInModule} / {totalStepsInModule} Langkah
            </span>
          </div>
          <div className="w-28 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right Panel View Mode Switch (Mobile / Tablet Quick Access) */}
        <div className="flex items-center bg-zinc-900 rounded-lg p-0.5 border border-zinc-800 text-xs">
          <button
            onClick={() => setRightTab('terminal')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium transition ${
              activeRightTab === 'terminal'
                ? 'bg-zinc-800 text-emerald-400 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Tampilkan Terminal"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Terminal</span>
          </button>
          <button
            onClick={() => setRightTab('preview')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium transition ${
              activeRightTab === 'preview'
                ? 'bg-zinc-800 text-blue-400 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Tampilkan Live Preview"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Live Preview</span>
          </button>
        </div>

        {/* Reset button */}
        <button
          onClick={() => {
            if (window.confirm('Reset seluruh progress ke kondisi awal?')) {
              resetAll();
            }
          }}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800/70 transition"
          title="Reset Simulator"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
