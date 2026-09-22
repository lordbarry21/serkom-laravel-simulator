'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit, Check, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { FoodCategory, FoodItem } from '@/types/preview';

export function FoodCrudView() {
  const { mockDb, createFoodItem, deleteFoodItem, setPreviewRoute, activeRoute } = useSimulatorStore();

  const isCreateMode = activeRoute === '/admin/foods/create';

  // Form states for creation
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('makanan');
  const [price, setPrice] = useState<number>(20000);
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createFoodItem({
      name,
      category,
      price: Number(price),
      description,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    });

    setName('');
    setDescription('');
    setSuccessMessage('Data makanan berhasil ditambahkan!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Yakin ingin menghapus menu makanan ini?')) {
      deleteFoodItem(id);
      setSuccessMessage('Data makanan berhasil dihapus dari database & storage!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  if (isCreateMode) {
    return (
      <div className="min-h-full bg-slate-50 text-slate-900 p-4 sm:p-6 font-sans">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewRoute('/admin/foods')}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-lg font-bold text-slate-800">Tambah Makanan Baru</h1>
          </div>

          <form
            onSubmit={handleCreateSubmit}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3.5 text-xs"
          >
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Makanan</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Sate Ayam Madura"
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
                <option value="cemilan">Cemilan</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Harga Satuan (Rp)</label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Deskripsi</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi bahan dan rasa makanan..."
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Upload Foto (enctype=&quot;multipart/form-data&quot;)
              </label>
              <div className="border border-dashed border-slate-300 rounded-lg p-3 text-center bg-slate-50 cursor-pointer">
                <ImageIcon className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <span className="text-[11px] text-slate-500">
                  Simulasi upload file foto (JPG, PNG max 2MB)
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPreviewRoute('/admin/foods')}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow transition"
              >
                Simpan Menu
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 text-slate-900 p-4 sm:p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Master Data Makanan</h1>
            <p className="text-xs text-slate-500">Kelola daftar menu, foto, dan harga restoran</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewRoute('/admin/foods/create')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Makanan</span>
            </button>
            <button
              onClick={() => setPreviewRoute('/dashboard')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs shadow transition"
            >
              Dashboard Pesanan
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Table of Foods */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/80 text-slate-600 uppercase font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3 text-center">Gambar</th>
                <th className="p-3">Nama Menu</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Harga</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockDb.foods.map((food) => (
                <tr key={food.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 text-center">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-12 h-12 object-cover rounded-lg mx-auto shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </td>
                  <td className="p-3 font-semibold text-slate-800">{food.name}</td>
                  <td className="p-3">
                    <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded text-[11px] uppercase">
                      {food.category}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-emerald-600">
                    Rp {food.price.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => alert(`Edit simulasi untuk menu: ${food.name}`)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(food.id)}
                        className="text-rose-600 hover:text-rose-800 font-semibold text-xs"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
