'use client';

import React from 'react';
import { BarChart3, RefreshCw, Printer } from 'lucide-react';

export type TimeFilter = '7days' | '30days' | 'today' | 'all';

interface StatisticsHeaderProps {
  timeFilter: TimeFilter;
  setTimeFilter: (f: TimeFilter) => void;
  onRefresh: () => void;
  onPrint: () => void;
  loading: boolean;
  totalPaymentsCount: number;
}

export const StatisticsHeader: React.FC<StatisticsHeaderProps> = ({
  timeFilter,
  setTimeFilter,
  onRefresh,
  onPrint,
  loading,
  totalPaymentsCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-[#E07B39]" />
          Báo Cáo Doanh Thu & Thống Kê
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Hiệu suất kinh doanh, cơ cấu dòng tiền VietQR & xu hướng bán hàng thời gian thực từ Database.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Time range buttons */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 text-xs">
          <button
            onClick={() => setTimeFilter('today')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              timeFilter === 'today'
                ? 'bg-white text-[#E07B39] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hôm nay
          </button>
          <button
            onClick={() => setTimeFilter('7days')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              timeFilter === '7days'
                ? 'bg-white text-[#E07B39] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7 ngày qua
          </button>
          <button
            onClick={() => setTimeFilter('30days')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              timeFilter === '30days'
                ? 'bg-white text-[#E07B39] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            30 ngày qua
          </button>
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              timeFilter === 'all'
                ? 'bg-white text-[#E07B39] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Toàn bộ ({totalPaymentsCount} GD)
          </button>
        </div>

        <button
          onClick={onRefresh}
          title="Làm mới dữ liệu"
          className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#E07B39]' : ''}`} />
        </button>

        <button
          onClick={onPrint}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>In Báo Cáo</span>
        </button>
      </div>
    </div>
  );
};
