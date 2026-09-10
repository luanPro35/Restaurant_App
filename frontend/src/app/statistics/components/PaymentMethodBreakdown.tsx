'use client';

import React from 'react';
import { PieChart as PieChartIcon, CreditCard } from 'lucide-react';

interface MethodStatItem {
  name: string;
  count: number;
  total: number;
  percent: number;
  revenuePercent: number;
}

interface PaymentMethodBreakdownProps {
  methodStats: MethodStatItem[];
}

export const PaymentMethodBreakdown: React.FC<PaymentMethodBreakdownProps> = ({ methodStats }) => {
  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-[#E07B39]" />
            Cơ cấu phương thức thanh toán
          </h3>
          <p className="text-xs text-slate-400">Tỷ trọng giao dịch theo cổng thực tế</p>
        </div>
      </div>

      <div className="space-y-4">
        {methodStats.map((m, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">{m.name}</span>
              <span className="font-black text-slate-900">
                {formatVND(m.total)} ({m.percent}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.max(5, m.percent)}%` }}
                className={`h-full rounded-full transition-all duration-500 ${
                  idx === 0
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                    : 'bg-gradient-to-r from-[#E07B39] to-amber-500'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-emerald-900">VietQR Tự Động Chiếm Đa Số</p>
          <p className="text-[11px] text-emerald-700">
            Toàn bộ dữ liệu doanh thu được đồng bộ trực tiếp từ bảng payments trong cơ sở dữ liệu.
          </p>
        </div>
      </div>
    </div>
  );
};
