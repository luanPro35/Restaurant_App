'use client';

import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import { Package, Product, Table } from '../types';
import { DashboardBanner } from './dashboard/components/DashboardBanner';
import { DashboardKPIs } from './dashboard/components/DashboardKPIs';
import { RecentOrdersList } from './dashboard/components/RecentOrdersList';
import { QuickTablesSnapshot } from './dashboard/components/QuickTablesSnapshot';
import { TopSellingDishes } from './dashboard/components/TopSellingDishes';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentPackages, setRecentPackages] = useState<Package[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [dashData, pkgs, prods, tbls] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getPackages(),
        apiService.getProducts(),
        apiService.getTables(),
      ]);
      setStats(dashData);
      setRecentPackages(pkgs.slice(0, 5));
      setTopProducts(prods.slice(0, 4));
      setTables(tbls);
    } catch (e) {
      console.error('Error fetching dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* 1. Welcome Banner */}
      <DashboardBanner
        activeOrders={stats?.activeOrders ?? 0}
        occupiedTables={stats?.occupiedTables ?? 0}
      />

      {/* 2. KPI Cards Grid */}
      <DashboardKPIs
        revenueToday={stats?.revenueToday ?? 0}
        orderCountToday={stats?.orderCountToday ?? 0}
        occupiedTables={stats?.occupiedTables ?? 0}
        totalTables={stats?.totalTables ?? 0}
        productCount={stats?.topProducts?.length ?? topProducts.length}
      />

      {/* 3. Main Grid: Live Orders & Quick Tables / Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentOrdersList packages={recentPackages} />

        <div className="space-y-6">
          <QuickTablesSnapshot tables={tables} />
          <TopSellingDishes products={topProducts} />
        </div>
      </div>
    </div>
  );
}
