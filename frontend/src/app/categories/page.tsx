'use client';

import React, { useEffect, useState } from 'react';
import { Category } from '../../types';
import apiService from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { Tags, Plus, Edit2, Salad, UtensilsCrossed, Fish, Cake, Wine, Layers } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await apiService.createCategory({ name, description });
    setName('');
    setDescription('');
    setShowModal(false);
    fetchCategories();
  };

  const getCategoryIcon = (index: number) => {
    const icons = [Salad, UtensilsCrossed, Fish, Cake, Wine, Layers];
    const Icon = icons[index % icons.length];
    return <Icon className="w-6 h-6 text-[#E07B39]" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Tags className="w-7 h-7 text-[#E07B39]" />
            Danh Mục Món Ăn
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Phân loại thực đơn nhà hàng (Khai vị, Món chính, Hải sản, Tráng miệng, Đồ uống...).
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#E07B39] hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm danh mục mới</span>
        </button>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
              {getCategoryIcon(idx)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base text-slate-800">{cat.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {cat.description || 'Danh mục các món ăn hảo hạng tại nhà hàng'}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#E07B39]">
                  {cat.itemCount || 5} món đang bán
                </span>
                <div className="flex items-center gap-1">
                  <button className="p-1 text-slate-400 hover:text-slate-700 rounded-md">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Thêm Danh Mục Mới"
        subtitle="Tạo phân nhóm món ăn mới cho menu"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên danh mục *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Món Chay Tinh Hoa, Lẩu Nướng..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả ngắn</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả tóm tắt đặc điểm danh mục..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#E07B39] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20"
            >
              Tạo danh mục
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
