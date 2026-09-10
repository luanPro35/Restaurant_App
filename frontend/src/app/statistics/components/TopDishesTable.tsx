'use client';

import React from 'react';
import { Utensils } from 'lucide-react';

interface TopSellingProductItem {
  name: string;
  salesCount: number;
  totalRevenue: number;
  price: number;
}

interface TopDishesTableProps {
  topSellingProducts: TopSellingProductItem[];
}

export const TopDishesTable: React.FC<TopDishesTableProps> = ({ topSellingProducts }) => {
  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#E07B39]" />
            Top món ăn bán chạy nhất từ Database
          </h3>
          <p className="text-xs text-slate-400">Trích xuất trực tiếp từ các đơn hàng và gói món thật</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-3">Thứ hạng & Tên món</th>
              <th className="px-4 py-3">Đơn giá</th>
              <th className="px-4 py-3">Số suất đã bán</th>
              <th className="px-4 py-3 text-right">Tổng tiền thu về</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topSellingProducts.map((p, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-700 border border-amber-300'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-700'
                          : idx === 2
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">{p.name}</p>
                      <p className="text-[11px] text-slate-400">Món ăn thực tế</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-semibold text-slate-700">
                  {formatVND(p.price)}
                </td>
                <td className="px-4 py-3.5">
                  <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-[#E07B39] font-bold text-xs border border-orange-200">
                    {p.salesCount} suất
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right font-black text-[#E07B39]">
                  {formatVND(p.totalRevenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
