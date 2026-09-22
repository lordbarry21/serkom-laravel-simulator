'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, RotateCcw, Sparkles, X } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';

const asesorChecklist = [
  { no: 1, title: 'Database & Seeder', desc: '3 tabel terbuat, 1 admin terbuat, 5 menu terisi otomatis via seeder' },
  { no: 2, title: 'Login Admin Breeze', desc: 'Login admin@gmail.com / password123 sukses masuk dashboard' },
  { no: 3, title: 'CRUD Tambah Menu', desc: 'Upload foto disimpan ke public storage dan path tersimpan di DB' },
  { no: 4, title: 'CRUD Edit Menu', desc: 'Ubah harga atau ganti foto, foto lama terhapus dari storage' },
  { no: 5, title: 'CRUD Hapus Menu', desc: 'Record terhapus dari database beserta file foto fisik' },
  { no: 6, title: 'Katalog Pelanggan', desc: 'Rute publik "/" menampilkan seluruh menu & filter tab berfungsi' },
  { no: 7, title: 'Keranjang & Modal Konfirmasi', desc: 'Modal popup menampilkan kalkulasi subtotal dan grand total akurat' },
  { no: 8, title: 'Multi-Tabel DB::transaction', desc: 'Integritas data orders & order_details terjaga dengan commit/rollBack' },
  { no: 9, title: 'Monitoring Admin Eager Loading', desc: 'Query Order::with("orderDetails.food") efisien bebas N+1 problem' },
  { no: 10, title: 'Instant Status Patch', desc: 'Form PATCH dropdown status onchange otomatis memperbarui status pesanan' },
];

export function CompletionModal() {
  const { isGraduationModalOpen, setIsGraduationModalOpen, resetAll } = useSimulatorStore();

  useEffect(() => {
    if (isGraduationModalOpen) {
      // Fire confetti celebration!
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);
    }
  }, [isGraduationModalOpen]);

  if (!isGraduationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#18181b] border border-amber-500/40 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-red-600 p-6 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex p-3 rounded-full bg-white/20 backdrop-blur-sm mb-3">
              <Award className="w-10 h-10 text-amber-200" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              SELAMAT! ANDA 100% KOMPETEN SERKOM!
            </h2>
            <p className="text-sm text-amber-100 mt-1 max-w-md mx-auto">
              Seluruh 4 Modul Aplikasi Pemesanan Makanan Laravel berhasil Anda selesaikan dengan sempurna.
            </p>
          </div>
          <button
            onClick={() => setIsGraduationModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10 Asesor Criteria Checklist */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              10 Poin Pengujian Asesor (Zero-Error Serkom):
            </h4>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              10 / 10 Lulus
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {asesorChecklist.map((item) => (
              <div
                key={item.no}
                className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 fill-emerald-400/20" />
                <div className="min-w-0 text-xs">
                  <div className="font-bold text-zinc-200">{item.title}</div>
                  <div className="text-[11px] text-zinc-400 leading-snug mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-[#141416] flex items-center justify-between">
          <button
            onClick={() => {
              resetAll();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulangi Simulasi dari Awal</span>
          </button>

          <button
            onClick={() => setIsGraduationModalOpen(false)}
            className="px-6 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition"
          >
            Tutup & Eksplorasi Bebas
          </button>
        </div>
      </div>
    </div>
  );
}
