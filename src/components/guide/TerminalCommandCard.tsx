'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, Play, AlertCircle, ArrowRight } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';

interface CommandInfo {
  command: string;
  description: string;
  warning?: string;
}

const STEP_COMMAND_INFOS: Record<string, CommandInfo[]> = {
  'm1-step-1': [
    {
      command: 'composer create-project laravel/laravel pesanmakan',
      description: 'Inisialisasi aplikasi Laravel 11 baru dalam folder "pesanmakan"',
    },
    {
      command: 'cd pesanmakan',
      description: 'Pindah ke dalam folder direktori proyek pesanmakan',
    },
  ],
  'm1-step-2': [
    {
      command: 'php artisan make:model Food -mcr',
      description: 'Buat Model Food, Migrasi foods, dan FoodController (Resource) sekaligus',
    },
    {
      command: 'php artisan make:model Order -mcr',
      description: 'Buat Model Order, Migrasi orders, dan OrderController (Resource) sekaligus',
    },
    {
      command: 'php artisan make:model OrderDetail -m',
      description: 'Buat Model OrderDetail dan Migrasi order_details (HANYA flag -m)',
      warning: 'Jangan pakai -mcr! OrderDetail tidak butuh controller terpisah.',
    },
  ],
  'm1-step-6': [
    {
      command: 'php artisan migrate:fresh --seed',
      description: 'Reset database dari nol, jalankan semua migrasi, dan eksekusi seeder',
      warning: 'Wajib gunakan flag --seed agar 5 data makanan dan akun admin terisi otomatis.',
    },
  ],
  'm2-step-7': [
    {
      command: 'composer require laravel/breeze --dev',
      description: 'Pasang package scaffolding autentikasi Laravel Breeze untuk development',
    },
    {
      command: 'php artisan breeze:install',
      description: 'Install scaffolding Breeze dengan stack Blade template',
    },
    {
      command: 'php artisan storage:link',
      description: 'Buat symlink dari public/storage ke storage/app/public untuk file foto makanan',
      warning: 'Wajib dijalankan agar gambar menu makanan bisa diakses dan muncul di browser.',
    },
  ],
};

export function TerminalCommandCard() {
  const { getCurrentStep, executeTerminalCommand, setRightTab } = useSimulatorStore();
  const currentStep = getCurrentStep();

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const commandInfos =
    STEP_COMMAND_INFOS[currentStep.id] ||
    currentStep.expectedCommands?.map((cmd) => ({
      command: cmd,
      description: `Perintah modul untuk ${currentStep.title}`,
    })) ||
    [];

  if (commandInfos.length === 0) return null;

  const handleCopy = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRun = (cmd: string) => {
    setRightTab('terminal');
    executeTerminalCommand(cmd);
  };

  return (
    <div className="rounded-xl border border-emerald-500/40 bg-[#061811]/70 backdrop-blur p-3.5 space-y-3 shadow-lg ring-1 ring-emerald-500/20 text-zinc-100 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <Terminal className="w-3 h-3 text-emerald-400" />
            <span>Perintah Terminal Langkah Ini</span>
          </span>
        </div>
        <span className="text-[11px] text-emerald-400/90 font-mono">
          {commandInfos.length} Perintah
        </span>
      </div>

      <p className="text-xs text-zinc-300 leading-relaxed">
        Jalankan perintah berikut di PowerShell Terminal di panel sebelah kanan:
      </p>

      {/* Commands List */}
      <div className="space-y-2.5">
        {commandInfos.map((info, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-lg bg-black/60 border border-emerald-900/50 space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span className="text-zinc-300 text-[11px]">{info.description}</span>
              </span>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(info.command, idx)}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-200 text-[10.5px] font-semibold flex items-center gap-1 border border-zinc-700 transition"
                  title="Salin perintah ke clipboard"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-zinc-400" />
                      <span>Salin</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleRun(info.command)}
                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-[10.5px] font-semibold flex items-center gap-1 transition shadow"
                  title="Jalankan perintah ini langsung di terminal"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Jalankan</span>
                </button>
              </div>
            </div>

            {/* Syntax Code Block */}
            <div className="p-2 rounded bg-[#030a07] border border-emerald-950 font-mono text-[11.5px] text-emerald-300 flex items-center gap-2 overflow-x-auto select-text">
              <span className="text-emerald-600 font-bold select-none">$</span>
              <code className="break-all font-semibold">{info.command}</code>
            </div>

            {/* Warning if any */}
            {info.warning && (
              <div className="flex items-start gap-1.5 text-[11px] text-amber-300/90 bg-amber-950/20 p-1.5 rounded border border-amber-500/20">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{info.warning}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
