'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';

export function VirtualTerminal() {
  const {
    terminalLogs,
    commandHistory,
    terminalCwd,
    activeMistake,
    executeTerminalCommand,
    undoMistake,
    getCurrentStep,
  } = useSimulatorStore();

  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const logEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentStep = getCurrentStep();

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs, activeMistake]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (activeMistake) {
        // If mistake is pending, pressing enter with 'undo' or empty triggers undo
        if (!inputVal.trim() || inputVal.trim().toLowerCase() === 'undo') {
          undoMistake();
          setInputVal('');
          setHistoryIndex(-1);
          return;
        }
      }

      if (inputVal.trim()) {
        executeTerminalCommand(inputVal);
        setInputVal('');
        setHistoryIndex(-1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex < commandHistory.length) {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div
      className="h-full flex flex-col bg-[#0c0c0e] text-zinc-200 font-mono text-[12.5px] overflow-hidden select-text cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Scrollable PowerShell Output Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 leading-relaxed select-text">
        {terminalLogs.map((log) => {
          if (log.type === 'input') {
            return (
              <div key={log.id} className="flex items-start gap-2 text-zinc-100">
                <span className="text-sky-400 font-semibold select-none shrink-0">
                  PS {terminalCwd}&gt;
                </span>
                <span className="text-white font-medium">{log.content}</span>
              </div>
            );
          }

          if (log.type === 'error') {
            return (
              <div
                key={log.id}
                className="text-red-400 bg-red-950/25 border-l-2 border-red-500 pl-2.5 py-1.5 my-1 text-[11.5px] whitespace-pre-line leading-relaxed"
              >
                {log.content}
              </div>
            );
          }

          if (log.type === 'warning') {
            return (
              <div
                key={log.id}
                className="text-amber-300 bg-amber-950/20 border-l-2 border-amber-500 pl-2.5 py-1.5 my-1 text-[11.5px] whitespace-pre-line leading-relaxed"
              >
                {log.content}
              </div>
            );
          }

          if (log.type === 'rollback') {
            return (
              <div
                key={log.id}
                className="text-emerald-300 bg-emerald-950/25 border-l-2 border-emerald-500 pl-2.5 py-1.5 my-1 text-[11.5px] whitespace-pre-line leading-relaxed font-sans"
              >
                {log.content}
              </div>
            );
          }

          if (log.type === 'artisan') {
            return (
              <div
                key={log.id}
                className="text-cyan-300 font-mono text-[11.5px] whitespace-pre-line leading-snug py-0.5"
              >
                {log.content}
              </div>
            );
          }

          if (log.type === 'success') {
            return (
              <div key={log.id} className="text-emerald-400 whitespace-pre-line leading-snug">
                {log.content}
              </div>
            );
          }

          return (
            <div key={log.id} className="text-zinc-400 whitespace-pre-line leading-snug">
              {log.content}
            </div>
          );
        })}

        {/* Interactive Pedagogical Mistake & Mandatory Undo Card */}
        {activeMistake && (
          <div className="my-3 p-3.5 rounded-lg border border-red-500/50 bg-red-950/30 text-zinc-100 shadow-2xl ring-1 ring-red-500/30 space-y-3 font-sans animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between gap-2 border-b border-red-500/20 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10.5px] font-bold tracking-wide uppercase bg-red-500/20 text-red-300 border border-red-500/40">
                  ⚠️ Perintah Tidak Sesuai Modul
                </span>
                <h4 className="font-semibold text-[13px] text-red-200">
                  {activeMistake.reasonTitle}
                </h4>
              </div>
              <span className="text-[11px] text-red-400/90 font-mono font-semibold">
                Wajib Rollback
              </span>
            </div>

            {/* Perintah comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px] font-mono">
              <div className="p-2.5 rounded bg-black/50 border border-red-900/50">
                <div className="text-zinc-400 text-[11px] mb-1 font-sans flex items-center gap-1">
                  <span className="text-red-400 font-bold">✕</span> Perintah yang Anda ketik:
                </div>
                <code className="text-red-300 font-bold break-all">
                  {activeMistake.rawCommand}
                </code>
              </div>
              <div className="p-2.5 rounded bg-black/50 border border-emerald-900/50">
                <div className="text-zinc-400 text-[11px] mb-1 font-sans flex items-center gap-1">
                  <span className="text-emerald-400 font-bold">✓</span> Perintah yang benar sesuai modul:
                </div>
                <code className="text-emerald-300 font-bold break-all">
                  {activeMistake.expectedCommands.join(' ATAU ') || '(Bukan perintah terminal)'}
                </code>
              </div>
            </div>

            {/* In-depth pedagogical explanation */}
            <div className="text-[12px] leading-relaxed text-zinc-200 bg-black/30 p-2.5 rounded border border-red-900/30">
              <strong className="text-amber-300 block mb-1 text-[11.5px] uppercase tracking-wider flex items-center gap-1">
                <span>💡</span> Penjelasan Guru / Penguji Ujikom:
              </strong>
              <p className="whitespace-pre-line text-zinc-300">{activeMistake.explanation}</p>
            </div>

            {/* Unwanted generated files */}
            {activeMistake.createdFiles && activeMistake.createdFiles.length > 0 && (
              <div className="p-2.5 rounded bg-red-950/40 border border-red-900/50 text-[11.5px]">
                <div className="text-red-300 font-semibold mb-1 flex items-center gap-1">
                  <span>📁 File berlebih yang terbuat (akan dibersihkan saat Undo):</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 font-mono text-red-200">
                  {activeMistake.createdFiles.map((file) => (
                    <li key={file} className="break-all">
                      {file}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1 gap-3">
              <p className="text-[11px] text-zinc-400">
                Tekan <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-[10px]">Enter</kbd> atau klik tombol di sebelah kanan untuk membatalkan:
              </p>
              <button
                type="button"
                onClick={undoMistake}
                className="px-3.5 py-1.5 rounded-md bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-[12px] transition-all shadow-md flex items-center gap-1.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <span>↩️</span>
                <span>Batalkan Perintah (Undo)</span>
              </button>
            </div>
          </div>
        )}

        {/* Windows PowerShell Active Prompt Line */}
        <div className="flex items-center gap-2 pt-0.5 text-zinc-100">
          <span
            className={`font-semibold select-none shrink-0 ${
              activeMistake ? 'text-red-400' : 'text-sky-400'
            }`}
          >
            PS {terminalCwd}&gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeMistake
                ? '⚠️ Ketik "undo" atau tekan Enter untuk membatalkan...'
                : currentStep.expectedCommands?.[0]
                ? `Ketik perintah modul (contoh: ${currentStep.expectedCommands[0]})`
                : 'Ketik perintah atau "help"...'
            }
            className={`flex-1 bg-transparent border-none outline-none font-mono text-[12.5px] p-0 m-0 focus:ring-0 focus:outline-none ${
              activeMistake
                ? 'text-red-200 placeholder:text-red-400/60'
                : 'text-white placeholder:text-zinc-600'
            }`}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
          {activeMistake && (
            <button
              type="button"
              onClick={undoMistake}
              className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-red-600 hover:bg-red-500 text-white shrink-0 transition-colors shadow"
            >
              Undo
            </button>
          )}
        </div>

        <div ref={logEndRef} />
      </div>
    </div>
  );
}
