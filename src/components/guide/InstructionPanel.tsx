'use client';

import React from 'react';
import { BookOpen, FileCode, Lightbulb, Sparkles, Terminal } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { CriteriaChecklist } from './CriteriaChecklist';
import { StepNavigation } from '../layout/StepNavigation';
import { MarkdownRenderer } from './MarkdownRenderer';

export function InstructionPanel() {
  const { getCurrentStep, openFile, setRightTab } = useSimulatorStore();
  const currentStep = getCurrentStep();

  return (
    <aside className="h-full flex flex-col bg-[#111113] border-r border-zinc-800 text-zinc-200 overflow-hidden">
      {/* Header Info */}
      <div className="p-4 border-b border-zinc-800/80 bg-[#161618]">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
            Langkah {currentStep.stepNumber}
          </span>
          {currentStep.targetFilePath && (
            <button
              onClick={() => openFile(currentStep.targetFilePath!)}
              className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-blue-400 border border-zinc-700 hover:border-blue-500/50 hover:bg-zinc-700/60 transition"
              title="Buka file ini di editor"
            >
              <FileCode className="w-3 h-3" />
              <span>{currentStep.targetFilePath}</span>
            </button>
          )}
        </div>

        <h2 className="text-base font-bold text-white tracking-tight leading-snug">
          {currentStep.title}
        </h2>
        {currentStep.subtitle && (
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{currentStep.subtitle}</p>
        )}
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed text-zinc-300">
        {/* Theory / Memory Cheat Sheet Card */}
        {currentStep.theorySummary && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>KUNCI HAFALAN ASESOR (MINDMAP):</span>
            </div>
            <p className="text-[11.5px] leading-relaxed text-amber-100/90 pl-5">
              {currentStep.theorySummary}
            </p>
          </div>
        )}

        {/* Live Criteria Checklist */}
        <CriteriaChecklist />

        {/* Formatted Markdown Instructions with IDE Syntax Highlighting */}
        <div className="bg-[#18181b]/70 border border-zinc-800/80 rounded-xl p-3.5 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-800/80">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-red-400" />
              <span>PANDUAN &amp; ALUR EKSEKUSI:</span>
            </h4>
            <span className="text-[10px] font-semibold text-zinc-500">IDE Highlighting</span>
          </div>
          <MarkdownRenderer content={currentStep.descriptionMarkdown} />
        </div>

        {/* Quick Target Switcher */}
        {currentStep.preferredTab && (
          <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-400">Direkomendasikan fokus ke:</span>
            <button
              onClick={() => setRightTab(currentStep.preferredTab!)}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-[11px] flex items-center gap-1 transition"
            >
              {currentStep.preferredTab === 'terminal' ? (
                <>
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  <span>Tab Terminal</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  <span>Tab Live Preview</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Footer Navigation Bar */}
      <StepNavigation />
    </aside>
  );
}
