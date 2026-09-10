'use client';

import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Product, Table, getProductImage } from '../../types';
import { Plus, Minus, Search, ShoppingBag } from 'lucide-react';
import apiService from '../../services/api';

interface AddFoodToTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table | null;
  products: Product[];
  onSuccess: () => void;
}

export const AddFoodToTableModal: React.FC<AddFoodToTableModalProps> = ({
  isOpen,
  onClose,
  table,
  products,
  onSuccess,
}) => {
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!table) return null;

  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  const handleQuantityChange = (productId: string, delta: number) => {
    setSelectedQuantities((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: next };
    });
  };

  const totalSelectedItems = Object.values(selectedQuantities).reduce((a, b) => a + b, 0);
  const totalAmount = Object.entries(selectedQuantities).reduce((sum, [pId, qty]) => {
    const prod = products.find((p) => p.id === pId);
    return sum + (prod ? prod.price * qty : 0);
  }, 0);

  const handleSubmit = async () => {
    if (totalSelectedItems === 0) return;
    try {
      setIsSubmitting(true);
      const items = Object.entries(selectedQuantities).map(([productId, quantity]) => ({
        productId,
        quantity,
      }));
      await apiService.addFoodToTable(table.id, items);
      setSelectedQuantities({});
      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.categoryId === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Thêm món trực tiếp cho ${table.name}`}
      subtitle="Chọn món trong menu để gửi đơn xuống bếp cho bàn này"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên món ăn..."
              className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
          {filteredProducts.map((product) => {
            const qty = selectedQuantities[product.id] || 0;
            const imgUrl = getProductImage(product);

            return (
              <div
                key={product.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  qty > 0
                    ? 'border-orange-300 bg-orange-50/40 shadow-sm'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={imgUrl}
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{product.name}</p>
                    <p className="text-xs font-bold text-[#E07B39] mt-0.5">{formatVND(product.price)}</p>
                  </div>
                </div>

                {/* Quantity Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {qty > 0 ? (
                    <>
                      <button
                        onClick={() => handleQuantityChange(product.id, -1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-slate-800">{qty}</span>
                      <button
                        onClick={() => handleQuantityChange(product.id, 1)}
                        className="w-7 h-7 rounded-lg bg-[#E07B39] text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleQuantityChange(product.id, 1)}
                      className="px-2.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#E07B39] text-xs font-bold transition-colors flex items-center gap-1 border border-orange-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Chọn
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Total & Submit Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Đã chọn {totalSelectedItems} món</p>
            <p className="text-lg font-black text-[#E07B39]">{formatVND(totalAmount)}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={totalSelectedItems === 0 || isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#E07B39] hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Gửi bếp cho bàn này</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
