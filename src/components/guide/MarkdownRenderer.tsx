'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode, Layers, Info, AlertTriangle } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

// Tokenizer & Syntax Highlighter for Code Snippets
function highlightCode(code: string, language: string): React.ReactNode[] {
  const lines = code.trim().split('\n');

  return lines.map((line, lineIdx) => {
    // If empty line
    if (!line.trim()) {
      return (
        <div key={lineIdx} className="table-row">
          <span className="table-cell pr-3 select-none text-zinc-600 text-right text-[10px] w-6">
            {lineIdx + 1}
          </span>
          <span className="table-cell whitespace-pre">&nbsp;</span>
        </div>
      );
    }

    // Comment line
    if (line.trim().startsWith('//') || line.trim().startsWith('#') || line.trim().startsWith('{{--')) {
      return (
        <div key={lineIdx} className="table-row">
          <span className="table-cell pr-3 select-none text-zinc-600 text-right text-[10px] w-6">
            {lineIdx + 1}
          </span>
          <span className="table-cell whitespace-pre text-emerald-400/90 italic font-mono">
            {line}
          </span>
        </div>
      );
    }

    // Advanced token replacement for PHP/Blade/Bash
    // We split into tokens while preserving delimiters
    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let keyIdx = 0;

    // Pattern matching strings, variables, keywords, and operators
    const pattern =
      /('(?:\\'|[^'])*'|"(?:\\"|[^"])*"|\$[a-zA-Z0-9_]+|\b(?:function|return|class|extends|public|private|protected|use|namespace|new|if|else|foreach|as|try|catch|throw|finally|static|abstract|const)\b|\b(?:string|integer|int|text|enum|float|bool|boolean|array|void|nullable|default|constrained|onDelete|timestamps|id)\b|->|=>|\/\/.*$)/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(remaining)) !== null) {
      // Non-matched plain text before this token
      if (match.index > lastIndex) {
        tokens.push(
          <span key={keyIdx++} className="text-zinc-300">
            {remaining.substring(lastIndex, match.index)}
          </span>
        );
      }

      const matchText = match[0];

      // Comment at end of line
      if (matchText.startsWith('//')) {
        tokens.push(
          <span key={keyIdx++} className="text-emerald-400/90 italic">
            {matchText}
          </span>
        );
      }
      // String literal
      else if (matchText.startsWith("'") || matchText.startsWith('"')) {
        tokens.push(
          <span key={keyIdx++} className="text-amber-300 font-semibold">
            {matchText}
          </span>
        );
      }
      // PHP Variable
      else if (matchText.startsWith('$')) {
        tokens.push(
          <span key={keyIdx++} className="text-sky-300 font-semibold">
            {matchText}
          </span>
        );
      }
      // Keywords
      else if (
        /^(function|return|class|extends|public|private|protected|use|namespace|new|if|else|foreach|as|try|catch|throw|finally|static|abstract|const)$/.test(
          matchText
        )
      ) {
        tokens.push(
          <span key={keyIdx++} className="text-purple-400 font-bold">
            {matchText}
          </span>
        );
      }
      // Laravel Migration Types & Methods
      else if (
        /^(string|integer|int|text|enum|float|bool|boolean|array|void|nullable|default|constrained|onDelete|timestamps|id)$/.test(
          matchText
        )
      ) {
        tokens.push(
          <span key={keyIdx++} className="text-cyan-400 font-semibold">
            {matchText}
          </span>
        );
      }
      // Arrows
      else if (matchText === '->' || matchText === '=>') {
        tokens.push(
          <span key={keyIdx++} className="text-pink-400 font-bold">
            {matchText}
          </span>
        );
      } else {
        tokens.push(<span key={keyIdx++}>{matchText}</span>);
      }

      lastIndex = pattern.lastIndex;
    }

    // Trailing non-matched text
    if (lastIndex < remaining.length) {
      tokens.push(
        <span key={keyIdx++} className="text-zinc-300">
          {remaining.substring(lastIndex)}
        </span>
      );
    }

    return (
      <div key={lineIdx} className="table-row">
        <span className="table-cell pr-3 select-none text-zinc-600 text-right text-[10px] w-6 font-mono">
          {lineIdx + 1}
        </span>
        <span className="table-cell whitespace-pre font-mono leading-relaxed">{tokens}</span>
      </div>
    );
  });
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLangBadge = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'php':
        return { label: 'PHP Laravel', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      case 'bash':
      case 'sh':
        return { label: 'Terminal / Shell', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'blade':
      case 'html':
        return { label: 'Blade Template', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' };
      case 'env':
        return { label: '.ENV Config', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      default:
        return { label: lang.toUpperCase(), color: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
    }
  };

  const badge = getLangBadge(language || 'code');

  return (
    <div className="my-3 rounded-xl border border-[#333333] bg-[#141416] overflow-hidden shadow-lg shadow-black/40">
      {/* Code Editor Mini Header */}
      <div className="px-3 py-1.5 bg-[#1c1c20] border-b border-[#2d2d32] flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block" />
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badge.color}`}
          >
            {badge.label}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
          title="Salin potongan kode ini"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 text-[10px]">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-[10px]">Salin</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-3 overflow-x-auto text-[11.5px] leading-relaxed font-mono no-scrollbar">
        <div className="table w-full">{highlightCode(code, language)}</div>
      </div>
    </div>
  );
}

// Render text with inline formatting (code pills, bold, italic)
function renderFormattedText(text: string): React.ReactNode {
  // Replace inline backticks `code` with styled pill
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const codeText = part.slice(1, -1);
      return (
        <code
          key={index}
          className="mx-0.5 px-1.5 py-0.5 rounded-md bg-zinc-800/90 text-cyan-300 font-mono text-[11px] border border-zinc-700/80 font-bold shadow-sm"
        >
          {codeText}
        </code>
      );
    }

    // Bold text **bold**
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={index}>
        {boldParts.map((bPart, bIdx) => {
          if (bPart.startsWith('**') && bPart.endsWith('**')) {
            return (
              <strong key={bIdx} className="font-bold text-white">
                {bPart.slice(2, -2)}
              </strong>
            );
          }
          return bPart;
        })}
      </span>
    );
  });
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Split content by code blocks ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
  const elements: React.ReactNode[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let elementIdx = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    if (textBefore.trim()) {
      elements.push(
        <div key={elementIdx++} className="space-y-2 text-zinc-300 leading-relaxed text-xs">
          {renderTextSection(textBefore)}
        </div>
      );
    }

    const language = match[1] || 'php';
    const code = match[2];
    elements.push(<CodeBlock key={elementIdx++} code={code} language={language} />);

    lastIndex = codeBlockRegex.lastIndex;
  }

  // Trailing text
  if (lastIndex < content.length) {
    const trailingText = content.substring(lastIndex);
    if (trailingText.trim()) {
      elements.push(
        <div key={elementIdx++} className="space-y-2 text-zinc-300 leading-relaxed text-xs">
          {renderTextSection(trailingText)}
        </div>
      );
    }
  }

  return <div className="space-y-3 font-sans select-text">{elements}</div>;
}

function renderTextSection(section: string): React.ReactNode {
  const lines = section.split('\n');

  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return null;

    // Heading 3: ### Title
    if (trimmed.startsWith('###')) {
      const headingText = trimmed.replace(/^###\s*/, '');
      return (
        <h3
          key={idx}
          className="text-sm font-bold text-white pt-2 pb-1 border-b border-zinc-800 flex items-center gap-2"
        >
          <span className="w-1.5 h-4 rounded-full bg-red-500 inline-block" />
          <span>{renderFormattedText(headingText)}</span>
        </h3>
      );
    }

    // Heading 4 / Subheading
    if (trimmed.startsWith('####')) {
      const headingText = trimmed.replace(/^####\s*/, '');
      return (
        <h4 key={idx} className="text-xs font-bold text-zinc-200 uppercase tracking-wider pt-1.5">
          {renderFormattedText(headingText)}
        </h4>
      );
    }

    // Blockquote / Alert: > ...
    if (trimmed.startsWith('>')) {
      const quoteText = trimmed.replace(/^>\s*/, '');
      const isImportant = quoteText.includes('PENTING') || quoteText.includes('Tips');
      return (
        <div
          key={idx}
          className={`p-3 my-2 rounded-xl border flex items-start gap-2.5 text-xs ${
            isImportant
              ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
              : 'bg-blue-950/20 border-blue-500/40 text-blue-200'
          }`}
        >
          {isImportant ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          )}
          <div className="leading-relaxed">{renderFormattedText(quoteText)}</div>
        </div>
      );
    }

    // Unordered List item: - ... or * ...
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.replace(/^[-*]\s+/, '');
      return (
        <div key={idx} className="flex items-start gap-2 pl-2 text-xs text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
          <div className="leading-relaxed">{renderFormattedText(itemText)}</div>
        </div>
      );
    }

    // Numbered List item: 1. ...
    if (/^\d+\.\s+/.test(trimmed)) {
      const numberMatch = trimmed.match(/^(\d+)\.\s+/);
      const itemNumber = numberMatch ? numberMatch[1] : '1';
      const itemText = trimmed.replace(/^\d+\.\s+/, '');

      return (
        <div key={idx} className="flex items-start gap-2 pl-2 text-xs text-zinc-200">
          <span className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 text-red-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
            {itemNumber}
          </span>
          <div className="leading-relaxed">{renderFormattedText(itemText)}</div>
        </div>
      );
    }

    // Regular paragraph line
    return (
      <p key={idx} className="text-xs text-zinc-300 leading-relaxed">
        {renderFormattedText(trimmed)}
      </p>
    );
  });
}
