'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileCode,
  Layers,
  Settings,
  FileText,
  Pin,
} from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { FileTreeNode } from '@/types/laravelFileSystem';

export function FileExplorer() {
  const { fileTree, activeFilePath, openFile, getCurrentStep } = useSimulatorStore();
  const currentStep = getCurrentStep();
  const targetPath = currentStep.targetFilePath;

  // Track expanded folder paths
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    app: true,
    'app/Http': true,
    'app/Http/Controllers': true,
    'app/Models': true,
    database: true,
    'database/migrations': true,
    'database/seeders': true,
    resources: true,
    'resources/views': true,
    'resources/views/foods': true,
    'resources/views/customer': true,
    routes: true,
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.blade.php')) {
      return <Layers className="w-3.5 h-3.5 text-orange-400 shrink-0" />;
    }
    if (name.endsWith('.php')) {
      return <FileCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
    }
    if (name.endsWith('.env')) {
      return <Settings className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    }
    return <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
  };

  const renderNode = (node: FileTreeNode, depth = 0) => {
    if (node.type === 'directory') {
      const isExpanded = expandedFolders[node.path] ?? true;
      return (
        <div key={node.path} className="select-none">
          <div
            onClick={() => toggleFolder(node.path)}
            className="flex items-center gap-1.5 py-1 px-2 hover:bg-zinc-800/60 rounded cursor-pointer text-zinc-300 hover:text-white transition text-xs font-mono"
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-3.5 h-3.5 text-amber-500/80" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-amber-500/80" />
            )}
            <span className="font-semibold text-zinc-300">{node.name}</span>
          </div>

          {isExpanded && node.children && (
            <div>{node.children.map((child) => renderNode(child, depth + 1))}</div>
          )}
        </div>
      );
    }

    const isActive = activeFilePath === node.path;
    const isTarget = targetPath === node.path;

    return (
      <div
        key={node.path}
        onClick={() => openFile(node.path)}
        className={`flex items-center justify-between py-1 px-2 rounded cursor-pointer transition text-xs font-mono select-none ${
          isActive
            ? 'bg-blue-600/30 text-blue-200 font-semibold'
            : isTarget
            ? 'bg-amber-500/10 text-amber-300 hover:bg-zinc-800/80'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
        }`}
        style={{ paddingLeft: `${depth * 12 + 20}px` }}
        title={node.path}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {getFileIcon(node.name)}
          <span className="truncate">{node.name}</span>
        </div>

        {isTarget && (
          <span className="flex items-center text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-1 py-0.5 rounded ml-1 shrink-0">
            Target
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] border-r border-[#333333] text-zinc-300 overflow-hidden w-56 shrink-0 select-none">
      <div className="p-2.5 border-b border-[#333333] flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          Explorer (Laravel)
        </span>
        <span className="text-[10px] text-zinc-500">pesanmakan</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 no-scrollbar">
        {fileTree.length === 0 ? (
          <div className="p-3 text-center space-y-2 mt-6">
            <div className="text-[11px] font-semibold text-zinc-400">
              Workspace Kosong (Mulai dari 0)
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              Jalankan perintah di terminal untuk membuat proyek:
            </p>
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800 font-mono text-[10px] text-emerald-400 break-all text-left">
              composer create-project laravel/laravel pesanmakan
            </div>
          </div>
        ) : (
          fileTree.map((node) => renderNode(node, 0))
        )}
      </div>
    </div>
  );
}
