'use client';

import React from 'react';
import { DollarSign, ShoppingBag, Grid2X2, Users } from 'lucide-react';
import { StatCard } from '../../../components/common/StatCard';

interface DashboardKPIsProps {
  revenueToday: number;
  orderCountToday: number;
  occupiedTables: number;
  totalTables: number;
  productCount: number;
}

export const DashboardKPIs: React.FC<DashboardKPIsProps> = ({
  revenueToday,
  orderCountToday,
  occupiedTables,
  totalTables,
  productCount,
}) => {
  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        title="Doanh thu hôm nay"
        value={formatVND(revenueToday)}
        subtitle="Doanh thu thực tế"
        icon={DollarSign}
        trend={{ value: 'Hôm nay', isPositive: true }}
        colorTheme="orange"
      />
      <StatCard
        title="Tổng số đơn hàng"
        value={orderCountToday}
        subtitle="Đơn tại bàn & mang đi"
        icon={ShoppingBag}
        trend={{ value: 'Tất cả', isPositive: true }}
        colorTheme="blue"
      />
      <StatCard
        title="Bàn đang phục vụ"
        value={`${occupiedTables} / ${totalTables}`}
        subtitle="Công suất hiện tại"
        icon={Grid2X2}
        colorTheme="emerald"
      />
      <StatCard
        title="Món ăn trong thực đơn"
        value={`${productCount} món`}
        subtitle="Đang kinh doanh"
        icon={Users}
        colorTheme="purple"
      />
    </div>
  );
};
