'use client';

import React from 'react';
import Link from 'next/link';
import { ChefHat, ShoppingBag, Grid2X2 } from 'lucide-react';

interface DashboardBannerProps {
  activeOrders: number;
  occupiedTables: number;
}

export const DashboardBanner: React.FC<DashboardBannerProps> = ({
  activeOrders,
  occupiedTables,
}) => {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-[#E07B39] via-[#EA580C] to-[#C2410C] p-8 text-white shadow-xl relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-12 pointer-events-none">
        <ChefHat className="w-80 h-80 text-white" />
      </div>
      <div className="relative z-10 max-w-2xl">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-orange-50 mb-4 border border-white/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          Hệ thống nhà hàng đang mở cửa
        </span>
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
          Xin chào, Admin Quản Trị Viên!
        </h1>
        <p className="mt-2 text-orange-100 text-sm lg:text-base leading-relaxed">
          Hôm nay quán có <span className="font-bold text-white">{activeOrders} đơn</span> đang chế biến và{' '}
          <span className="font-bold text-white">{occupiedTables} bàn</span> đang phục vụ.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/orders"
            className="px-5 py-2.5 rounded-xl bg-white text-[#E07B39] font-bold text-sm hover:bg-orange-50 transition-all shadow-md flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Xem đơn hàng trực tiếp
          </Link>
          <Link
            href="/tables"
            className="px-5 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 backdrop-blur-md text-white font-semibold text-sm transition-all border border-white/20 flex items-center gap-2"
          >
            <Grid2X2 className="w-4 h-4" />
            Sơ đồ bàn phục vụ
          </Link>
        </div>
      </div>
    </div>
  );
};
