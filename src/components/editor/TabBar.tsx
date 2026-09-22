'use client';

import React from 'react';
import { X, FileCode, FileText, Settings, Layers } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';

export function TabBar() {
  const { openTabs, activeFilePath, openFile, closeTab } = useSimulatorStore();

  const getFileIcon = (path: string) => {
    if (path.endsWith('.blade.php')) {
      return <Layers className="w-3.5 h-3.5 text-orange-400" />;
    }
    if (path.endsWith('.php')) {
      return <FileCode className="w-3.5 h-3.5 text-indigo-400" />;
    }
    if (path.endsWith('.env')) {
      return <Settings className="w-3.5 h-3.5 text-amber-400" />;
    }
    return <FileText className="w-3.5 h-3.5 text-zinc-400" />;
  };

  const getFileName = (path: string) => {
    return path.split('/').pop() || path;
  };

  if (openTabs.length === 0) {
    return (
      <div className="h-9 bg-[#1e1e1e] border-b border-[#333333] flex items-center px-4 text-xs text-zinc-500 italic">
        Tidak ada file yang terbuka
      </div>
    );
  }

  return (
    <div className="h-9 bg-[#252526] border-b border-[#333333] flex items-center overflow-x-auto select-none no-scrollbar">
      {openTabs.map((path) => {
        const isActive = path === activeFilePath;
        return (
          <div
            key={path}
            onClick={() => openFile(path)}
            className={`group h-full flex items-center gap-2 px-3 text-xs font-mono border-r border-[#333333] cursor-pointer transition-colors ${
              isActive
                ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500'
                : 'bg-[#2d2d2d] text-zinc-400 hover:bg-[#1e1e1e]/60 hover:text-zinc-200'
            }`}
          >
            {getFileIcon(path)}
            <span className="truncate max-w-[140px]">{getFileName(path)}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(path);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
              title="Tutup Tab"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
