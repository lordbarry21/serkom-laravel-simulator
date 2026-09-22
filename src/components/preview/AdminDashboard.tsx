'use client';

import React, { useState } from 'react';
import { Utensils, CheckCircle2, AlertCircle, Clock, ShoppingCart } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { OrderStatus } from '@/types/preview';
import { SpotlightPulse } from './SpotlightOverlay';

export function AdminDashboard() {
  const { mockDb, updateOrderStatus, setPreviewRoute, getCurrentStep } = useSimulatorStore();
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const currentStep = getCurrentStep();
  const isStep18 = currentStep.id === 'm4-step-18';

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    setSuccessToast(`Status pesanan #${orderId} berhasil diperbarui menjadi "${newStatus.toUpperCase()}"!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="min-h-full bg-slate-50 text-slate-900 p-4 sm:p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Daftar Pesanan Masuk</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                Admin Monitoring
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Pantau antrean pesanan dan ubah status pesanan secara realtime
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewRoute('/admin/foods')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition"
            >
              Kelola Menu
            </button>
            <button
              onClick={() => setPreviewRoute('/')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs shadow-sm transition"
            >
              Katalog Customer
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100/80 text-slate-600 uppercase font-bold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5"># ID</th>
                  <th className="p-3.5">Pelanggan</th>
                  <th className="p-3.5">No. Meja</th>
                  <th className="p-3.5">Rincian Menu</th>
                  <th className="p-3.5">Total Harga</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-center">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockDb.orders.map((order) => {
                  const isTargetOrder = isStep18 && order.status === 'pending';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-bold text-slate-700">#{order.id}</td>
                      <td className="p-3.5 font-semibold text-slate-900">{order.customer_name}</td>
                      <td className="p-3.5">
                        <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md text-[11px]">
                          Meja {order.table_number}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <ul className="space-y-1 text-[11px] text-slate-600">
                          {order.order_details.map((detail, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <span className="font-semibold text-slate-800">
                                {detail.food?.name || 'Menu'}
                              </span>
                              <span className="text-slate-400">x{detail.quantity}</span>
                              <span className="text-slate-400">
                                (Rp {(detail.subtotal || 0).toLocaleString('id-ID')})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-3.5 font-bold text-emerald-600">
                        Rp {order.total_price.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3.5">
                        {order.status === 'pending' && (
                          <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                            PENDING
                          </span>
                        )}
                        {order.status === 'completed' && (
                          <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                            SELESAI
                          </span>
                        )}
                        {order.status === 'cancelled' && (
                          <span className="bg-rose-100 text-rose-800 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                            BATAL
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center relative">
                        {isTargetOrder && (
                          <SpotlightPulse label="Ganti Jadi Selesai" active={true} />
                        )}
                        <select
                          id={`select-order-status-${order.id}`}
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className="text-xs border border-slate-300 rounded-lg p-1.5 bg-white font-semibold text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Selesai / Lunas</option>
                          <option value="cancelled">Batalkan</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}

                {mockDb.orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      Belum ada pesanan masuk.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
