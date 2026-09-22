'use client';

import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { FoodCategory } from '@/types/preview';
import { SpotlightPulse } from './SpotlightOverlay';

export function CustomerCatalog() {
  const {
    mockDb,
    activeCategoryFilter,
    setCategoryFilter,
    submitCustomerOrder,
    getCurrentStep,
  } = useSimulatorStore();

  const [customerName, setCustomerName] = useState('Budi Santoso');
  const [tableNumber, setTableNumber] = useState('04');
  const [quantities, setQuantities] = useState<Record<number, number>>({ 1: 2, 3: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const currentStep = getCurrentStep();
  const isStep14 = currentStep.id === 'm3-step-14';

  const updateQuantity = (foodId: number, delta: number) => {
    setQuantities((prev) => {
      const current = prev[foodId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [foodId]: next };
    });
  };

  const filteredFoods = mockDb.foods.filter((food) => {
    if (activeCategoryFilter === 'all') return true;
    return food.category.toLowerCase() === activeCategoryFilter.toLowerCase();
  });

  const orderedItems = Object.entries(quantities)
    .filter(([_, qty]) => qty > 0)
    .map(([idStr, qty]) => {
      const food = mockDb.foods.find((f) => f.id === parseInt(idStr, 10));
      return {
        food,
        qty,
        subtotal: (food?.price || 0) * qty,
      };
    })
    .filter((item) => item.food !== undefined);

  const grandTotal = orderedItems.reduce((acc, item) => acc + item.subtotal, 0);

  const handleOpenModal = () => {
    if (!customerName.trim() || !tableNumber.trim()) {
      setNotification({
        type: 'error',
        message: 'Silakan isi Nama Lengkap dan Nomor Meja terlebih dahulu!',
      });
      return;
    }

    if (orderedItems.length === 0) {
      setNotification({
        type: 'error',
        message: 'Pilih minimal satu menu makanan dengan porsi lebih dari 0!',
      });
      return;
    }

    setNotification(null);
    setIsModalOpen(true);
  };

  const handleSubmitOrder = () => {
    const result = submitCustomerOrder({
      customer_name: customerName,
      table_number: tableNumber,
      items: quantities,
    });

    setIsModalOpen(false);

    if (result.success) {
      setNotification({ type: 'success', message: result.message });
      setQuantities({});
    } else {
      setNotification({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="min-h-full bg-slate-50 text-slate-900 p-4 sm:p-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Banner Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
            <span>Katalog Restoran Lezat</span>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
              Customer View
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Pilih menu favorit Anda dan konfirmasi pesanan untuk meja Anda
          </p>
        </div>

        {/* Notifications */}
        {notification && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
              notification.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {(['all', 'makanan', 'minuman', 'cemilan'] as const).map((cat) => {
            const isActive = activeCategoryFilter === cat;
            const label =
              cat === 'all'
                ? 'Semua Menu'
                : cat === 'makanan'
                ? 'Makanan'
                : cat === 'minuman'
                ? 'Minuman'
                : 'Cemilan';
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition shadow-sm ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-blue-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Customer Information Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b pb-2">
            1. Informasi Pemesan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Nama Pemesan</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Budi"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Nomor Meja</label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Contoh: 04"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Menu Cards Grid */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            2. Pilih Menu ({filteredFoods.length} Pilihan)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredFoods.map((food) => {
              const qty = quantities[food.id] || 0;
              return (
                <div
                  key={food.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <div className="h-32 w-full bg-slate-200 relative overflow-hidden">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if external image is blocked
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm uppercase">
                        {food.category}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm">{food.name}</h3>
                        <span className="text-xs font-extrabold text-emerald-600">
                          Rp {food.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {food.description}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500">Porsi:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(food.id, -1)}
                        className="w-6 h-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-800">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(food.id, 1)}
                        className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Floating Summary / Checkout Button */}
        <div className="sticky bottom-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-xl flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">
              Total ({orderedItems.length} menu dipilih):
            </span>
            <span className="text-base font-black text-emerald-600">
              Rp {grandTotal.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="relative">
            {isStep14 && <SpotlightPulse label="Klik Pesan Sekarang" active={true} />}
            <button
              id="btn-order-checkout"
              type="button"
              onClick={handleOpenModal}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pesan Sekarang</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="border-b pb-2.5">
              <h3 className="text-sm font-bold text-slate-900">Konfirmasi Pesanan</h3>
              <p className="text-[11px] text-slate-500">Periksa detail pesanan Anda sebelum dikirim</p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="font-medium text-slate-500">Nama Pelanggan:</span>
                <span className="font-bold text-slate-800">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-500">Nomor Meja:</span>
                <span className="font-bold text-blue-600">Meja {tableNumber}</span>
              </div>
            </div>

            <div className="border-y border-slate-100 py-2.5 max-h-40 overflow-y-auto space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Rincian Item:</span>
              {orderedItems.map((item) => (
                <div key={item.food?.id} className="flex justify-between text-xs items-center">
                  <div>
                    <span className="font-bold text-slate-800">{item.food?.name}</span>
                    <span className="text-[10px] text-slate-400 block">x{item.qty}</span>
                  </div>
                  <span className="font-semibold text-slate-700">
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm font-bold text-slate-900 pt-1">
              <span>Total Tagihan:</span>
              <span className="text-emerald-600 text-base">
                Rp {grandTotal.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-1/2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmitOrder}
                className="w-1/2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Ya, Kirim Pesanan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
