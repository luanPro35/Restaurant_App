'use client';

import React, { useEffect, useState } from 'react';
import { Promotion } from '../../types';
import apiService from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { TicketPercent, Plus, Calendar } from 'lucide-react';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number | undefined>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(200000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPromotions();
      setPromotions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !title) return;
    await apiService.createPromotion({
      code: code.toUpperCase(),
      title,
      discountPercent: discountPercent ? Number(discountPercent) : undefined,
      minOrderAmount: Number(minOrderAmount),
      startDate,
      endDate,
      isActive: true,
    });
    setCode('');
    setTitle('');
    setShowModal(false);
    fetchPromotions();
  };

  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <TicketPercent className="w-7 h-7 text-[#E07B39]" />
            Mã Giảm Giá & Ưu Đãi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Thiết lập các mã voucher kích cầu thực khách và chương trình khuyến mãi theo mùa.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#E07B39] hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo voucher mới</span>
        </button>
      </div>

      {/* Promotions List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-xl bg-orange-100 text-[#E07B39] font-mono font-extrabold text-xs tracking-wider">
                  {promo.code}
                </span>
                <Badge status={promo.isActive} type="boolean" />
              </div>

              <h3 className="font-bold text-base text-slate-800">{promo.title}</h3>

              <div className="mt-4 space-y-2 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Mức giảm giá:</span>
                  <span className="font-bold text-emerald-600 text-sm">
                    {promo.discountPercent ? `Giảm ${promo.discountPercent}%` : formatVND(promo.discountAmount || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Đơn tối thiểu:</span>
                  <span className="font-semibold text-slate-700">{formatVND(promo.minOrderAmount || 0)}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Thời hạn:
                  </span>
                  <span className="font-medium text-slate-600">
                    {promo.startDate} - {promo.endDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Đã dùng: {promo.usageCount || 0} / {promo.usageLimit || 100} lượt</span>
              <button className="text-[#E07B39] font-bold hover:underline">Chỉnh sửa</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Promo */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Tạo Mã Khuyến Mãi Mới"
        subtitle="Cài đặt mã giảm giá cho thực khách"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mã Voucher (Code) *</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="VD: WELCOME50, VIP20..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-mono font-bold text-[#E07B39] focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên chương trình ưu đãi *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Giảm 20% Chào Bạn Mới..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phần trăm giảm (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={discountPercent || ''}
                onChange={(e) => setDiscountPercent(parseInt(e.target.value) || undefined)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Đơn tối thiểu (VNĐ)</label>
              <input
                type="number"
                min="0"
                step="10000"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ngày bắt đầu</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ngày kết thúc</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
              />
            </div>
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
              Tạo mã
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
