'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowUpRight, Clock, ShoppingBag } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';
import { Package } from '../../../types';

interface RecentOrdersListProps {
  packages: Package[];
}

export const RecentOrdersList: React.FC<RecentOrdersListProps> = ({ packages }) => {
  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  // Helper to extract a clean 2-character badge label
  const getBadgeLabel = (pkg: Package) => {
    const raw = (pkg.tableName || pkg.customerName || 'ĐH').trim();
    if (raw.toLowerCase().startsWith('bàn')) {
      return raw.replace(/^bàn\s*/i, 'B');
    }
    if (raw.length <= 3) return raw.toUpperCase();
    const words = raw.split(/\s+/);
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return raw.slice(0, 2).toUpperCase();
  };

  // Helper to get formatted dish summary
  const getItemsSummary = (pkg: Package) => {
    if (pkg.note && pkg.note.trim() && !pkg.note.toLowerCase().startsWith('địa chỉ')) {
      return pkg.note.replace(/\n/g, ', ');
    }
    if (Array.isArray(pkg.items) && pkg.items.length > 0) {
      return pkg.items.map((it: any) => `${it.name || it.product?.name || 'Món'} x${it.quantity || 1}`).join(', ');
    }
    return 'Đơn gọi món tổng hợp';
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Đơn hàng mới nhất</h2>
          <p className="text-xs text-slate-400">Tiến trình chế biến và phục vụ tại bàn</p>
        </div>
        <Link
          href="/orders"
          className="text-xs font-semibold text-[#E07B39] hover:text-orange-700 flex items-center gap-1 transition-colors"
        >
          Xem tất cả <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3.5">
        {packages.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-medium">
            Chưa có đơn hàng nào được ghi nhận.
          </div>
        ) : (
          packages.map((pkg) => {
            const shortId = pkg.id.length > 12 ? `${pkg.id.slice(0, 8)}...` : pkg.id;
            const displayName = pkg.tableName || pkg.customerName || 'Mang về';

            return (
              <Link
                key={pkg.id}
                href="/orders"
                className="group p-4 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/20 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Clean 2-letter Avatar without text overflow */}
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#E07B39] font-black text-xs flex items-center justify-center shrink-0 shadow-sm overflow-hidden px-1 text-center">
                    <span className="truncate max-w-full">{getBadgeLabel(pkg)}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className="font-mono font-bold text-xs sm:text-sm text-slate-900 truncate max-w-[140px] sm:max-w-[200px]"
                        title={pkg.id}
                      >
                        {pkg.id}
                      </h3>
                      <span className="text-xs text-slate-400 font-normal truncate max-w-[120px]">
                        ({displayName})
                      </span>
                      <Badge status={pkg.status} type="package" />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 truncate">
                      {getItemsSummary(pkg)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-13 sm:pl-0">
                  <div className="text-right">
                    <p className="font-bold text-sm text-[#E07B39]">{formatVND(pkg.totalPrice)}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="w-3 h-3" />
                      {new Date(pkg.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};
