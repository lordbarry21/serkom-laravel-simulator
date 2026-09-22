'use client';

import React, { useState } from 'react';
import { Sidebar, Code2, Check, Wand2 } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { FileExplorer } from './FileExplorer';
import { TabBar } from './TabBar';
import { CodeEditor } from './CodeEditor';
import { ValidationBanner } from './ValidationBanner';

export function EditorPanel() {
  const [showExplorer, setShowExplorer] = useState(true);
  const { activeFilePath, applyAutocomplete } = useSimulatorStore();

  return (
    <main className="h-full flex flex-col bg-[#1e1e1e] border-r border-zinc-800 overflow-hidden relative">
      {/* Editor Top Bar: Toggle Explorer + TabBar + Quick Actions */}
      <div className="flex items-center bg-[#252526] border-b border-[#333333]">
        <button
          onClick={() => setShowExplorer(!showExplorer)}
          className={`px-2.5 h-9 flex items-center justify-center border-r border-[#333333] transition ${
            showExplorer ? 'text-blue-400 bg-zinc-800' : 'text-zinc-400 hover:text-white'
          }`}
          title="Toggle Sidebar Explorer"
        >
          <Sidebar className="w-4 h-4" />
        </button>

        <div className="flex-1 overflow-hidden">
          <TabBar />
        </div>

        <div className="flex items-center px-2">
          <button
            onClick={applyAutocomplete}
            className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
            title="Lengkapi kode untuk file ini"
          >
            <Wand2 className="w-3 h-3 text-indigo-400" />
            <span className="hidden sm:inline">Autocomplete</span>
          </button>
        </div>
      </div>

      {/* Editor Body: Explorer + Monaco Editor */}
      <div className="flex-1 flex overflow-hidden">
        {showExplorer && <FileExplorer />}

        <div className="flex-1 flex flex-col overflow-hidden">
          <ValidationBanner />
          <div className="flex-1 overflow-hidden">
            <CodeEditor />
          </div>
        </div>
      </div>

      {/* VS Code Mock Status Bar */}
      <div className="h-6 bg-[#007acc] text-white px-3 flex items-center justify-between text-[11px] font-mono select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold">
            <Code2 className="w-3 h-3" />
            <span>Laravel 11</span>
          </span>
          <span className="truncate max-w-[280px] opacity-90">{activeFilePath}</span>
        </div>

        <div className="flex items-center gap-4 opacity-90">
          <span>UTF-8</span>
          <span>Spaces: 4</span>
          <span>PHP / Blade</span>
        </div>
      </div>
    </main>
  );
}
