'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Trash2, CornerDownLeft, Sparkles, HelpCircle } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';

export function VirtualTerminal() {
  const {
    terminalLogs,
    commandHistory,
    terminalCwd,
    executeTerminalCommand,
    clearTerminal,
    getCurrentStep,
  } = useSimulatorStore();

  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const logEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentStep = getCurrentStep();

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
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

  const handleQuickCommand = (cmd: string) => {
    setInputVal(cmd);
    inputRef.current?.focus();
  };

  return (
    <div
      className="h-full flex flex-col bg-[#0c0c0e] text-zinc-200 font-mono text-xs overflow-hidden select-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Header */}
      <div className="h-9 px-3 bg-[#16161a] border-b border-zinc-800/80 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-[11px] font-bold text-zinc-400 ml-1 flex items-center gap-1">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>bash — {terminalCwd}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearTerminal();
            }}
            className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition"
            title="Bersihkan Terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Commands for this Step */}
      {currentStep.expectedCommands && currentStep.expectedCommands.length > 0 && (
        <div className="px-3 py-1.5 bg-zinc-900/60 border-b border-zinc-800/50 flex items-center gap-2 overflow-x-auto no-scrollbar select-none">
          <span className="text-[10px] uppercase font-bold text-zinc-500 shrink-0">
            Saran Perintah:
          </span>
          {currentStep.expectedCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={(e) => {
                e.stopPropagation();
                handleQuickCommand(cmd);
              }}
              className="text-[11px] px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-emerald-400 border border-emerald-500/30 shrink-0 transition"
              title="Klik untuk mengisi input terminal"
            >
              {cmd}
            </button>
          ))}
        </div>
      )}

      {/* Terminal Log Outputs */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 leading-relaxed font-mono select-text">
        {terminalLogs.map((log) => {
          if (log.type === 'input') {
            return (
              <div key={log.id} className="flex items-start gap-1.5 text-zinc-100">
                <span className="text-emerald-400 font-bold select-none">
                  user@serkom:{terminalCwd}$
                </span>
                <span className="font-bold text-white">{log.content}</span>
              </div>
            );
          }

          if (log.type === 'error') {
            return (
              <div
                key={log.id}
                className="text-red-400 bg-red-950/20 border-l-2 border-red-500 pl-2 py-1 my-1 text-[11.5px] whitespace-pre-line"
              >
                {log.content}
              </div>
            );
          }

          if (log.type === 'artisan') {
            return (
              <div
                key={log.id}
                className="text-cyan-300 font-mono text-[11px] whitespace-pre-line leading-snug py-0.5"
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
        <div ref={logEndRef} />
      </div>

      {/* Terminal Input Line */}
      <div className="p-2.5 bg-[#121215] border-t border-zinc-800/80 flex items-center gap-1.5">
        <span className="text-emerald-400 font-bold select-none shrink-0">
          user@serkom:{terminalCwd}$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik perintah artisan/composer di sini..."
          className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs placeholder:text-zinc-600"
          autoFocus
        />
        <button
          onClick={() => {
            if (inputVal.trim()) {
              executeTerminalCommand(inputVal);
              setInputVal('');
            }
          }}
          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition shrink-0"
          title="Kirim (Enter)"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
