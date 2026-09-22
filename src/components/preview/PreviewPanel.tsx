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
  const { activeRoute, setPreviewRoute } = useSimulatorStore();

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
        {activeRoute === '/' && <CustomerCatalog />}
        {activeRoute === '/dashboard' && <AdminDashboard />}
        {activeRoute.startsWith('/admin/foods') && <FoodCrudView />}
      </div>
    </div>
  );
}
