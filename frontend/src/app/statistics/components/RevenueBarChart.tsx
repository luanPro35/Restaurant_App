'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

interface DailyDataItem {
  label: string;
  revenue: number;
  count: number;
  rawDate: string;
}

interface RevenueBarChartProps {
  dailyData: DailyDataItem[];
  selectedMetric: 'revenue' | 'orders';
  setSelectedMetric: (m: 'revenue' | 'orders') => void;
}

export const RevenueBarChart: React.FC<RevenueBarChartProps> = ({
  dailyData,
  selectedMetric,
  setSelectedMetric,
}) => {
  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  const maxDailyRevenue = Math.max(...dailyData.map((d) => d.revenue), 1);
  const maxDailyCount = Math.max(...dailyData.map((d) => d.count), 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#E07B39]" />
            Biểu đồ doanh thu theo ngày thực tế ({dailyData.length} ngày phát sinh)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Thống kê doanh số và số lượng giao dịch chính xác từ database
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setSelectedMetric('revenue')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedMetric === 'revenue'
                  ? 'bg-[#E07B39] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Doanh thu (VNĐ)
            </button>
            <button
              onClick={() => setSelectedMetric('orders')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedMetric === 'orders'
                  ? 'bg-[#E07B39] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Số giao dịch
            </button>
          </div>
        </div>
      </div>

      {dailyData.length > 0 ? (
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2">
          {dailyData.map((item, index) => {
            const heightPercent =
              selectedMetric === 'revenue'
                ? Math.max(12, Math.round((item.revenue / maxDailyRevenue) * 100))
                : Math.max(12, Math.round((item.count / maxDailyCount) * 100));

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
              >
                {/* Tooltip Hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold text-[#E07B39] bg-orange-50 px-2.5 py-1 rounded-xl border border-orange-200 whitespace-nowrap shadow-md mb-1 pointer-events-none">
                  {selectedMetric === 'revenue'
                    ? `${formatVND(item.revenue)} (${item.count} GD)`
                    : `${item.count} GD (${formatVND(item.revenue)})`}
                </div>

                {/* Bar */}
                <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden flex items-end h-44 p-1">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-[#E07B39] via-orange-500 to-amber-400 rounded-t-lg group-hover:from-orange-600 group-hover:to-orange-400 transition-all duration-300 shadow-sm"
                  />
                </div>

                {/* Day Label */}
                <span className="text-[10px] sm:text-xs font-bold text-slate-600 group-hover:text-[#E07B39] text-center">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 text-xs font-semibold">
          Chưa có giao dịch phát sinh trong khoảng thời gian đã chọn.
        </div>
      )}
    </div>
  );
};
