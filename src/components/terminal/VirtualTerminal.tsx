'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';

export function VirtualTerminal() {
  const {
    terminalLogs,
    commandHistory,
    terminalCwd,
    executeTerminalCommand,
  } = useSimulatorStore();

  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const logEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
                className="text-red-400 bg-red-950/25 border-l-2 border-red-500 pl-2.5 py-1 my-1 text-[11.5px] whitespace-pre-line"
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

        {/* Windows PowerShell Active Prompt Line */}
        <div className="flex items-center gap-2 pt-0.5 text-zinc-100">
          <span className="text-sky-400 font-semibold select-none shrink-0">
            PS {terminalCwd}&gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono text-[12.5px] p-0 m-0 focus:ring-0 focus:outline-none placeholder:text-zinc-600"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        <div ref={logEndRef} />
      </div>
    </div>
  );
}
