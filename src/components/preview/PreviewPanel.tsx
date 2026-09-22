'use client';

import React from 'react';
import {
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Laptop,
} from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { CustomerCatalog } from './CustomerCatalog';
import { AdminDashboard } from './AdminDashboard';
import { FoodCrudView } from './FoodCrudView';

export function PreviewPanel() {
  const { activeRoute, setPreviewRoute, isProjectCreated, isMigrated } = useSimulatorStore();

  const getFullUrl = () => {
    return `http://127.0.0.1:8000${activeRoute}`;
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden select-none">
      {/* Browser Chrome Header */}
      <div className="h-10 bg-[#1e1e24] border-b border-zinc-800 px-3 flex items-center justify-between gap-2 text-xs">
        {/* Navigation buttons */}
        <div className="flex items-center gap-1 text-zinc-400">
          <button
            onClick={() => setPreviewRoute('/')}
            className="p-1 rounded hover:bg-zinc-800 hover:text-white transition"
            title="Ke Katalog Pelanggan"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setPreviewRoute('/dashboard')}
            className="p-1 rounded hover:bg-zinc-800 hover:text-white transition"
            title="Ke Dashboard Admin"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              const current = activeRoute;
              setPreviewRoute('/');
              setTimeout(() => setPreviewRoute(current), 50);
            }}
            className="p-1 rounded hover:bg-zinc-800 hover:text-white transition"
            title="Muat Ulang Halaman"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-md h-7 bg-zinc-900 border border-zinc-700/80 rounded-lg px-2.5 flex items-center gap-1.5 text-zinc-300 font-mono text-[11px]">
          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate">{getFullUrl()}</span>
        </div>

        {/* Quick Route Switcher Tabs */}
        <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-[10px] font-semibold">
          <button
            onClick={() => setPreviewRoute('/')}
            className={`px-2 py-1 rounded transition ${
              activeRoute === '/'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Katalog
          </button>
          <button
            onClick={() => setPreviewRoute('/dashboard')}
            className={`px-2 py-1 rounded transition ${
              activeRoute === '/dashboard'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setPreviewRoute('/admin/foods')}
            className={`px-2 py-1 rounded transition ${
              activeRoute.startsWith('/admin/foods')
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            CRUD Menu
          </button>
        </div>
      </div>

      {/* Viewport Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50 relative">
        {!isProjectCreated ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-slate-100 select-none space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400">
              <Laptop className="w-7 h-7 text-slate-400" />
            </div>
            <div className="space-y-1 max-w-xs">
              <h3 className="font-bold text-slate-800 text-sm">Server Belum Aktif (Mulai dari 0)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Proyek Laravel belum dibuat. Buka tab <strong className="text-emerald-600 font-semibold">Artisan Shell</strong> di atas dan jalankan:
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] border border-slate-800 shadow-sm">
              composer create-project laravel/laravel pesanmakan
            </div>
          </div>
        ) : !isMigrated ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-amber-50/70 select-none space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white border border-amber-200 shadow-sm flex items-center justify-center text-amber-500">
              <ShieldCheck className="w-7 h-7 text-amber-500" />
            </div>
            <div className="space-y-1 max-w-xs">
              <h3 className="font-bold text-amber-900 text-sm">Database Belum Dimigrasi</h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                Tabel database dan menu seeder belum terisi. Selesaikan skema tabel di Modul 1 lalu jalankan:
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 text-cyan-300 font-mono text-[11px] border border-slate-800 shadow-sm">
              php artisan migrate:fresh --seed
            </div>
          </div>
        ) : (
          <>
            {activeRoute === '/' && <CustomerCatalog />}
            {activeRoute === '/dashboard' && <AdminDashboard />}
            {activeRoute.startsWith('/admin/foods') && <FoodCrudView />}
          </>
        )}
      </div>
    </div>
  );
}
