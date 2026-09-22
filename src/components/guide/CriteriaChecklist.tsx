'use client';

import React from 'react';
import { CheckCircle2, CircleDashed, Terminal, FileCode, MousePointerClick } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { CriterionType } from '@/types/simulator';

export function CriteriaChecklist() {
  const { getCurrentStep, criteriaStatus, openFile, setRightTab } = useSimulatorStore();
  const currentStep = getCurrentStep();

  const getCriterionIcon = (type: CriterionType) => {
    switch (type) {
      case 'terminal_command':
        return <Terminal className="w-3 h-3 text-emerald-400" />;
      case 'code_edit':
        return <FileCode className="w-3 h-3 text-blue-400" />;
      case 'ui_action':
        return <MousePointerClick className="w-3 h-3 text-purple-400" />;
    }
  };

  const getCriterionBadge = (type: CriterionType) => {
    switch (type) {
      case 'terminal_command':
        return 'Terminal Shell';
      case 'code_edit':
        return 'Edit File';
      case 'ui_action':
        return 'Interaksi Preview';
    }
  };

  return (
    <div className="bg-[#18181b]/80 border border-zinc-800 rounded-xl p-3.5 space-y-2.5">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          <span>Kriteria Kelulusan Langkah Ini</span>
        </h4>
        <span className="text-[11px] font-medium text-zinc-400">
          {currentStep.criteria.filter((c) => criteriaStatus[c.id]).length} /{' '}
          {currentStep.criteria.length} Terpenuhi
        </span>
      </div>

      <div className="space-y-2">
        {currentStep.criteria.map((criterion) => {
          const isDone = criteriaStatus[criterion.id] === true;

          return (
            <div
              key={criterion.id}
              className={`p-2.5 rounded-lg border transition-all duration-200 flex items-start gap-2.5 ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                ) : (
                  <CircleDashed className="w-4 h-4 text-amber-400/80" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {getCriterionIcon(criterion.type)}
                    {getCriterionBadge(criterion.type)}
                  </span>
                  {criterion.targetPath && (
                    <button
                      onClick={() => openFile(criterion.targetPath!)}
                      className="text-[10px] text-sky-400 hover:text-sky-300 font-mono hover:underline cursor-pointer"
                      title="Klik untuk membuka file di editor"
                    >
                      {criterion.targetPath.split('/').pop()}
                    </button>
                  )}
                  {criterion.type === 'ui_action' && (
                    <button
                      onClick={() => setRightTab('preview')}
                      className="text-[10px] text-purple-300 hover:text-purple-200 font-medium hover:underline cursor-pointer"
                    >
                      Buka Preview
                    </button>
                  )}
                </div>

                <p className="text-xs leading-relaxed font-medium">{criterion.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
