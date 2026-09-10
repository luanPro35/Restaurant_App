'use client';

import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Award } from 'lucide-react';
import { StatCard } from '../../../components/common/StatCard';

interface StatisticsKPIsProps {
  totalRevenue: number;
  totalOrdersCount: number;
  paymentsCount: number;
  packagesCount: number;
  averageOrderValue: number;
  topDishName: string;
  topDishSales: number;
}

export const StatisticsKPIs: React.FC<StatisticsKPIsProps> = ({
  totalRevenue,
  totalOrdersCount,
  paymentsCount,
  packagesCount,
  averageOrderValue,
  topDishName,
  topDishSales,
}) => {
  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        title="Tổng doanh thu"
        value={formatVND(totalRevenue)}
        subtitle="Tổng tiền thanh toán thực"
        icon={DollarSign}
        trend={{ value: `${paymentsCount} giao dịch`, isPositive: true }}
        colorTheme="orange"
      />
      <StatCard
        title="Tổng số đơn phục vụ"
        value={`${totalOrdersCount} đơn`}
        subtitle="Tại bàn & Gói mang đi"
        icon={ShoppingBag}
        trend={{ value: `${packagesCount} gói món`, isPositive: true }}
        colorTheme="blue"
      />
      <StatCard
        title="Giá trị trung bình / đơn"
        value={formatVND(averageOrderValue)}
        subtitle="Mức chi tiêu trung bình"
        icon={TrendingUp}
        colorTheme="emerald"
      />
      <StatCard
        title="Món bán chạy nhất"
        value={topDishName || 'Phở bò Hà Nội'}
        subtitle={`Đã xuất ${topDishSales} suất`}
        icon={Award}
        colorTheme="purple"
      />
    </div>
  );
};
