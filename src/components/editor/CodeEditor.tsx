'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Code2 } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { detectLanguageFromPath } from '@/data/laravelProjectTree';

// Dynamically import Monaco Editor to avoid SSR mismatch
const Monaco = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#1e1e1e] flex items-center justify-center text-zinc-500 font-mono text-xs">
      Memuat Monaco Editor...
    </div>
  ),
});

export function CodeEditor() {
  const { virtualFiles, activeFilePath, updateFileContent } = useSimulatorStore();

  const currentContent = virtualFiles[activeFilePath] ?? '';
  const detectedLang = detectLanguageFromPath(activeFilePath);

  // Map internal languages to Monaco supported languages
  const getMonacoLang = (lang: string) => {
    switch (lang) {
      case 'blade':
      case 'html':
        return 'html';
      case 'php':
        return 'php';
      case 'sql':
        return 'sql';
      case 'bash':
        return 'shell';
      case 'json':
        return 'json';
      case 'env':
        return 'ini';
      default:
        return 'plaintext';
    }
  };

  if (!activeFilePath || !virtualFiles[activeFilePath]) {
    return (
      <div className="h-full w-full bg-[#1e1e1e] flex flex-col items-center justify-center p-6 text-center select-none space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-zinc-400">
          <Code2 className="w-6 h-6 text-red-500" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-sm font-bold text-white">Tidak Ada File Terbuka</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Workspace dimulai dari nol. Jalankan perintah di terminal sebelah kanan atau buka file dari explorer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#1e1e1e] relative overflow-hidden">
      <Monaco
        height="100%"
        language={getMonacoLang(detectedLang)}
        theme="vs-dark"
        value={currentContent}
        onChange={(value) => updateFileContent(activeFilePath, value || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          wordWrap: 'on',
          fontFamily: "'Fira Code', 'Cascadia Code', Consolas, Menlo, monospace",
          padding: { top: 12, bottom: 12 },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  );
}
