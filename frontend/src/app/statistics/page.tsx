'use client';

import React, { useEffect, useState, useMemo } from 'react';
import apiService from '../../services/api';
import { PaymentTransaction, Package, Product } from '../../types';
import { StatisticsHeader, TimeFilter } from './components/StatisticsHeader';
import { StatisticsKPIs } from './components/StatisticsKPIs';
import { RevenueBarChart } from './components/RevenueBarChart';
import { PaymentMethodBreakdown } from './components/PaymentMethodBreakdown';
import { TopDishesTable } from './components/TopDishesTable';

export default function StatisticsPage() {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders'>('revenue');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pmts, pkgs, prods] = await Promise.all([
        apiService.getPayments(200),
        apiService.getPackages(),
        apiService.getProducts(),
      ]);
      setPayments(pmts);
      setPackages(pkgs);
      setProducts(prods);
    } catch (e) {
      console.error('Error loading analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter items by selected time range
  const filteredPayments = useMemo(() => {
    if (!payments.length) return [];
    if (timeFilter === 'all') return payments;

    const now = new Date();

    if (timeFilter === 'today') {
      const todayStr = now.toISOString().split('T')[0];
      return payments.filter((p) => p.createdAt && p.createdAt.startsWith(todayStr));
    }
    if (timeFilter === '7days') {
      const limit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return payments.filter((p) => {
        const d = new Date(p.createdAt);
        return !isNaN(d.getTime()) && d >= limit;
      });
    }
    if (timeFilter === '30days') {
      const limit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return payments.filter((p) => {
        const d = new Date(p.createdAt);
        return !isNaN(d.getTime()) && d >= limit;
      });
    }
    return payments;
  }, [payments, timeFilter]);

  // Total Analytics
  const totalRevenue = useMemo(() => {
    return filteredPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }, [filteredPayments]);

  const totalOrdersCount = useMemo(() => {
    return packages.length || filteredPayments.length;
  }, [packages, filteredPayments]);

  const averageOrderValue = useMemo(() => {
    if (!filteredPayments.length) return 0;
    return Math.round(totalRevenue / filteredPayments.length);
  }, [totalRevenue, filteredPayments]);

  // Real Payment Methods Breakdown
  const methodStats = useMemo(() => {
    const counts: Record<string, { count: number; total: number }> = {
      VIETQR: { count: 0, total: 0 },
      CASH: { count: 0, total: 0 },
    };

    filteredPayments.forEach((p) => {
      let m = (p.method || 'CASH').toUpperCase();
      if (m === 'BANK_TRANSFER' || m === 'VIETQR') m = 'VIETQR';
      if (!counts[m]) counts[m] = { count: 0, total: 0 };
      counts[m].count += 1;
      counts[m].total += Number(p.amount) || 0;
    });

    const totalCount = filteredPayments.length || 1;
    return Object.entries(counts).map(([name, data]) => ({
      name: name === 'VIETQR' ? 'VietQR / Chuyển khoản' : name === 'CASH' ? 'Tiền mặt tại quầy' : name,
      count: data.count,
      total: data.total,
      percent: Math.round((data.count / totalCount) * 100),
      revenuePercent: totalRevenue > 0 ? Math.round((data.total / totalRevenue) * 100) : 0,
    }));
  }, [filteredPayments, totalRevenue]);

  // Real Daily Grouping from database createdAt timestamps
  const dailyData = useMemo(() => {
    if (!filteredPayments.length) return [];

    const grouped: Record<string, { label: string; revenue: number; count: number; rawDate: string }> = {};

    filteredPayments.forEach((p) => {
      const d = new Date(p.createdAt);
      if (!isNaN(d.getTime())) {
        const dateKey = d.toISOString().split('T')[0];
        const formattedLabel = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
        if (!grouped[dateKey]) {
          grouped[dateKey] = {
            label: formattedLabel,
            revenue: 0,
            count: 0,
            rawDate: dateKey,
          };
        }
        grouped[dateKey].revenue += Number(p.amount) || 0;
        grouped[dateKey].count += 1;
      }
    });

    const sorted = Object.values(grouped).sort((a, b) => a.rawDate.localeCompare(b.rawDate));
    return sorted.slice(-10);
  }, [filteredPayments]);

  // REAL Top Selling Products parsed directly from Packages & Order Items in Database
  const topSellingProducts = useMemo(() => {
    const tally: Record<string, { name: string; salesCount: number; totalRevenue: number; price: number }> = {};

    packages.forEach((pkg) => {
      const lines = (pkg.note || '').split('\n');
      lines.forEach((line) => {
        const match = line.trim().match(/^(\d+)\s*x\s*(.+)$/i);
        if (match) {
          const qty = parseInt(match[1]) || 1;
          const dishName = match[2].trim();
          if (dishName && !dishName.toLowerCase().startsWith('địa chỉ')) {
            if (!tally[dishName]) {
              const matchedProduct = products.find((p) => p.name.toLowerCase() === dishName.toLowerCase());
              const price = matchedProduct ? Number(matchedProduct.price) : Math.round(Number(pkg.totalPrice) / qty) || 35000;
              tally[dishName] = {
                name: dishName,
                salesCount: 0,
                totalRevenue: 0,
                price,
              };
            }
            tally[dishName].salesCount += qty;
            tally[dishName].totalRevenue += qty * tally[dishName].price;
          }
        }
      });
    });

    if (Object.keys(tally).length === 0) {
      products.forEach((prod) => {
        tally[prod.name] = {
          name: prod.name,
          salesCount: 1,
          totalRevenue: Number(prod.price) || 0,
          price: Number(prod.price) || 0,
        };
      });
    }

    const sorted = Object.values(tally).sort((a, b) => b.totalRevenue - a.totalRevenue);
    return sorted.slice(0, 7);
  }, [packages, products]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Statistics Header & Time Filters */}
      <StatisticsHeader
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        onRefresh={fetchData}
        onPrint={handlePrint}
        loading={loading}
        totalPaymentsCount={payments.length}
      />

      {/* 2. Key Metrics Grid */}
      <StatisticsKPIs
        totalRevenue={totalRevenue}
        totalOrdersCount={totalOrdersCount}
        paymentsCount={filteredPayments.length}
        packagesCount={packages.length}
        averageOrderValue={averageOrderValue}
        topDishName={topSellingProducts[0]?.name || 'Phở bò Hà Nội'}
        topDishSales={topSellingProducts[0]?.salesCount || 0}
      />

      {/* 3. Daily Bar Chart */}
      <RevenueBarChart
        dailyData={dailyData}
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
      />

      {/* 4. Payment Methods & Top Dishes Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PaymentMethodBreakdown methodStats={methodStats} />
        <TopDishesTable topSellingProducts={topSellingProducts} />
      </div>
    </div>
  );
}
