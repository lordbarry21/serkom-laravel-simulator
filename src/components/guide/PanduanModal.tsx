'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Copy,
  Check,
  Lightbulb,
  Terminal,
  Database,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import {
  CHEAT_SHEET_COMMANDS,
  FOUR_STAGES_MINDMAP,
  ASSESSOR_CHECKLIST_FULL,
} from '@/data/panduanReference';

export function PanduanModal() {
  const { isPanduanModalOpen, setIsPanduanModalOpen, executeTerminalCommand } =
    useSimulatorStore();
  const [activeTab, setActiveTab] = useState<'mindmap' | 'cheatsheet' | 'formulas' | 'asesor'>(
    'mindmap'
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  React.useEffect(() => {
    if (!isPanduanModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPanduanModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPanduanModalOpen, setIsPanduanModalOpen]);

  if (!isPanduanModalOpen) return null;

  const handleCopyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRunCommand = (cmd: string) => {
    executeTerminalCommand(cmd);
    setIsPanduanModalOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Buku Panduan dan Alur Hafalan Serkom"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200 select-none"
    >
      <div className="bg-[#18181b] border border-zinc-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Topbar */}
        <div className="p-4 border-b border-zinc-800 bg-[#1f1f23] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600 text-white shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Buku Panduan & Alur Hafalan Serkom</span>
                <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700">
                  LSP / BNSP
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Peta mental, tabel sintaks keramat, dan rumus logika ujian kompetensi
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPanduanModalOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 bg-[#141416] border-b border-zinc-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'mindmap', label: '1. Peta Mental 4 Babak' },
            { id: 'cheatsheet', label: '2. Tabel Perintah Keramat' },
            { id: 'formulas', label: '3. Rumus Hafalan Kode' },
            { id: 'asesor', label: '4. Checklist Pengujian Asesor' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-red-500 text-white font-bold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-zinc-300 space-y-4">
          {/* TAB 1: PETA MENTAL 4 BABAK */}
          {activeTab === 'mindmap' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-blue-200">
                <span className="font-bold text-xs text-blue-300 block mb-1">
                  Alur Kehidupan Data Restoran:
                </span>
                <p className="text-[11.5px] leading-relaxed">
                  Untuk menghafal seluruh aplikasi di luar kepala tanpa pusing, ingat alurnya:
                  <br />
                  <strong>BABAK 1 (Struktur)</strong>: Komputer butuh wadah data dulu (Tabel & Model). &rarr;{' '}
                  <strong>BABAK 2 (Master Data)</strong>: Siapkan menu makanan via Admin. &rarr;{' '}
                  <strong>BABAK 3 (Transaksi)</strong>: Customer datang memesan makanan (DB Transaction). &rarr;{' '}
                  <strong>BABAK 4 (Monitoring)</strong>: Kasir/Admin memantau rekap & ganti status.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {FOUR_STAGES_MINDMAP.map((stage, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#1f1f23] border border-zinc-800 space-y-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {stage.stage}
                      </span>
                      <h4 className="font-bold text-sm text-white">{stage.title}</h4>
                    </div>
                    <p className="text-[11.5px] text-zinc-400 leading-relaxed">{stage.summary}</p>
                    <div className="pt-2 border-t border-zinc-800/80 space-y-1">
                      {stage.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-start gap-1.5 text-[11px] text-zinc-300">
                          <span className="text-emerald-400 font-bold">&bull;</span>
                          <span className="font-mono">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TABEL PERINTAH KERAMAT */}
          {activeTab === 'cheatsheet' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-400">
                Hafalkan perintah terminal ini. Anda dapat mengklik <strong>&quot;Jalankan di Shell&quot;</strong>{' '}
                untuk mengeksekusinya secara instan di terminal simulator:
              </p>

              <div className="border border-zinc-800 rounded-xl overflow-hidden bg-[#1a1a1e]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] font-bold border-b border-zinc-800">
                    <tr>
                      <th className="p-3">Perintah Terminal</th>
                      <th className="p-3">Kegunaan & Alur</th>
                      <th className="p-3">Tips Ingat</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-sans">
                    {CHEAT_SHEET_COMMANDS.map((row, idx) => (
                      <tr key={idx} className="hover:bg-zinc-800/40 transition">
                        <td className="p-3 font-mono text-[11px] text-emerald-400 font-bold">
                          {row.command}
                        </td>
                        <td className="p-3 text-zinc-200 font-medium">{row.useCase}</td>
                        <td className="p-3 text-zinc-400 text-[11px]">{row.tips}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleCopyCommand(row.command, idx)}
                              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                              title="Salin Perintah"
                            >
                              {copiedIndex === idx ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleRunCommand(row.command)}
                              className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition"
                            >
                              Jalankan
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: RUMUS HAFALAN KODE */}
          {activeTab === 'formulas' && (
            <div className="space-y-4">
              {/* Rumus Relasi Eloquent */}
              <div className="p-4 rounded-xl bg-[#1e1e24] border border-zinc-800 space-y-2">
                <h4 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>1. Rumus Relasi Eloquent (hasMany vs belongsTo)</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-zinc-300 text-xs pl-2">
                  <li>
                    <strong>Induk ke Anak:</strong> Gunakan <code className="text-pink-400 font-mono">hasMany</code>{' '}
                    (Order memiliki banyak OrderDetail).
                  </li>
                  <li>
                    <strong>Anak ke Induk:</strong> Gunakan <code className="text-pink-400 font-mono">belongsTo</code>{' '}
                    (OrderDetail milik Food dan Order).
                  </li>
                  <li>
                    <strong>Mass Assignment:</strong> Selalu tambahkan{' '}
                    <code className="text-emerald-400 font-mono">protected $guarded = [&apos;id&apos;];</code> di semua
                    Model agar tidak error MassAssignmentException.
                  </li>
                </ul>
              </div>

              {/* Rumus Database Transaction */}
              <div className="p-4 rounded-xl bg-[#1e1e24] border border-zinc-800 space-y-2">
                <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  <span>2. Rumus Checkout Multi-Tabel (DB::transaction)</span>
                </h4>
                <div className="p-3 bg-zinc-950 rounded-lg font-mono text-[11px] text-zinc-300 space-y-1">
                  <div>1. Validasi: customer_name, table_number, items</div>
                  <div>2. DB::beginTransaction();</div>
                  <div>3. $order = Order::create([... &apos;total_price&apos; =&gt; 0, &apos;status&apos; =&gt; &apos;pending&apos;]);</div>
                  <div>4. Looping items: hitung subtotal = price * qty -&gt; OrderDetail::create([...])</div>
                  <div>5. $order-&gt;update([&apos;total_price&apos; =&gt; $totalPrice]);</div>
                  <div>6. DB::commit();</div>
                  <div>7. catch (\Exception $e) &#123; DB::rollBack(); &#125;</div>
                </div>
              </div>

              {/* Rumus Blade Form Upload & Method Spoofing */}
              <div className="p-4 rounded-xl bg-[#1e1e24] border border-zinc-800 space-y-2">
                <h4 className="font-bold text-sm text-blue-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>3. Rumus Blade Form Directive</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-zinc-300 text-xs pl-2">
                  <li>
                    Form Upload Foto: Wajib atribut <code className="text-yellow-400 font-mono">enctype=&quot;multipart/form-data&quot;</code>.
                  </li>
                  <li>
                    Form Update: Wajib directive <code className="text-yellow-400 font-mono">@method(&apos;PUT&apos;)</code>.
                  </li>
                  <li>
                    Form Hapus: Wajib directive <code className="text-yellow-400 font-mono">@method(&apos;DELETE&apos;)</code>.
                  </li>
                  <li>
                    Semua form Laravel wajib menyertakan token keamanan <code className="text-yellow-400 font-mono">@csrf</code>.
                  </li>
                </ul>
              </div>

              {/* Rumus Eager Loading */}
              <div className="p-4 rounded-xl bg-[#1e1e24] border border-zinc-800 space-y-2">
                <h4 className="font-bold text-sm text-purple-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>4. Rumus Anti N+1 Problem (Eager Loading)</span>
                </h4>
                <p className="text-xs text-zinc-300">
                  Gunakan <code className="text-cyan-300 font-mono">Order::with(&apos;orderDetails.food&apos;)-&gt;latest()-&gt;get();</code>{' '}
                  untuk mengambil pesanan, detail item, dan nama makanan dalam 1 query efisien.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CHECKLIST ASESOR */}
          {activeTab === 'asesor' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-400">
                10 Kriteria Pengujian Asesor yang menentukan kelulusan Sertifikasi Kompetensi:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ASSESSOR_CHECKLIST_FULL.map((item) => (
                  <div
                    key={item.no}
                    className="p-3.5 rounded-xl bg-[#1a1a1e] border border-zinc-800 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">
                        #{item.no} {item.feature}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      <strong>Uji:</strong> {item.testScenario}
                    </div>
                    <div className="text-[11px] text-emerald-400/90">
                      <strong>Hasil:</strong> {item.expected}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-zinc-800 bg-[#161618] flex items-center justify-end">
          <button
            onClick={() => setIsPanduanModalOpen(false)}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white transition"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
