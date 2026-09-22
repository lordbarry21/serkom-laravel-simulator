'use client';

import React from 'react';
import { Terminal, Monitor, HelpCircle, CheckCircle } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { InstructionPanel } from '../guide/InstructionPanel';
import { EditorPanel } from '../editor/EditorPanel';
import { VirtualTerminal } from '../terminal/VirtualTerminal';
import { PreviewPanel } from '../preview/PreviewPanel';
import { HintModal } from '../guide/HintModal';
import { CompletionModal } from '../guide/CompletionModal';
import { PanduanModal } from '../guide/PanduanModal';

export function ThreePanelLayout() {
  const { activeRightTab, setRightTab } = useSimulatorStore();

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
      {/* Panel 1: Left Guide Panel (approx 30% width) */}
      <section className="w-full md:w-[32%] lg:w-[28%] xl:w-[26%] h-1/3 md:h-full shrink-0 overflow-hidden">
        <InstructionPanel />
      </section>

      {/* Panel 2: Center Code Editor (approx 38-42% width) */}
      <section className="w-full md:flex-1 h-1/3 md:h-full overflow-hidden">
        <EditorPanel />
      </section>

      {/* Panel 3: Right Panel - Terminal & Preview (approx 32-34% width) */}
      <section className="w-full md:w-[36%] lg:w-[34%] xl:w-[34%] h-1/3 md:h-full shrink-0 flex flex-col bg-[#0c0c0e] border-l border-zinc-800 overflow-hidden">
        {/* Right Panel Header Switch Tabs */}
        <div className="h-9 px-3 bg-[#16161a] border-b border-zinc-800 flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setRightTab('terminal')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition ${
                activeRightTab === 'terminal'
                  ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Artisan Shell</span>
            </button>

            <button
              onClick={() => setRightTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition ${
                activeRightTab === 'preview'
                  ? 'bg-zinc-800 text-blue-400 border border-blue-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Interactive Preview</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-zinc-400 font-mono">127.0.0.1:8000</span>
          </div>
        </div>

        {/* Right Panel Body */}
        <div className="flex-1 overflow-hidden">
          {activeRightTab === 'terminal' ? <VirtualTerminal /> : <PreviewPanel />}
        </div>
      </section>

      {/* Modals */}
      <HintModal />
      <CompletionModal />
      <PanduanModal />
    </div>
  );
}
