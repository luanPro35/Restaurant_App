'use client';

import React, { useEffect, useState } from 'react';
import { Package, PackageStatus, Product } from '../../types';
import apiService from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { OrderDetailsModal } from './OrderDetailsModal';
import { Search, ShoppingBag, Eye, RefreshCw } from 'lucide-react';

export default function OrdersPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePackage, setActivePackage] = useState<Package | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [pkgs, prods] = await Promise.all([
        apiService.getPackages(),
        apiService.getProducts(),
      ]);
      setPackages(pkgs);
      setAllProducts(prods);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (packageId: string, nextStatus: PackageStatus) => {
    await apiService.updatePackageStatus(packageId, nextStatus);
    fetchOrders();
    if (activePackage && activePackage.id === packageId) {
      setActivePackage((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
  };

  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  // Helper for badge 2-letter label
  const getBadgeLabel = (pkg: Package) => {
    const tbl = (pkg.tableName || '').trim().toLowerCase();
    if (tbl.includes('bàn')) {
      const num = tbl.replace(/\D/g, '');
      return `B${num || '1'}`;
    }
    if (tbl.includes('giao hàng') || tbl.includes('mang')) {
      return 'GH';
    }
    const cust = (pkg.customerName || 'KH').trim();
    if (cust.length <= 2) return cust.toUpperCase();
    const words = cust.split(/\s+/);
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return cust.slice(0, 2).toUpperCase();
  };

  const filterTabs = [
    { label: 'Tất cả', value: 'ALL', count: packages.length },
    { label: 'Tiếp nhận', value: 'CONFIRMED', count: packages.filter((p) => p.status === 'CONFIRMED').length },
    { label: 'Đang nấu', value: 'COOKING', count: packages.filter((p) => p.status === 'COOKING').length },
    { label: 'Đang phục vụ', value: 'DELIVERING', count: packages.filter((p) => p.status === 'DELIVERING').length },
    { label: 'Đã lên bàn', value: 'RECEIVED', count: packages.filter((p) => p.status === 'RECEIVED').length },
    { label: 'Hoàn thành', value: 'COMPLETED', count: packages.filter((p) => p.status === 'COMPLETED').length },
    { label: 'Đã hủy', value: 'CANCELED', count: packages.filter((p) => p.status === 'CANCELED').length },
  ];

  const filteredPackages = packages.filter((pkg) => {
    const matchesStatus = selectedStatus === 'ALL' || pkg.status === selectedStatus;
    const matchesQuery =
      pkg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pkg.tableName && pkg.tableName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pkg.customerName && pkg.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-[#E07B39]" />
            Quản Lý Đơn Hàng & Gói Món
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Xử lý tiếp nhận món, điều phối nhà bếp và phục vụ bàn thời gian thực.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#E07B39]' : ''}`} />
          <span>Cập nhật danh sách</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedStatus === tab.value
                ? 'bg-[#E07B39] text-white shadow-md shadow-orange-500/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                selectedStatus === tab.value ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã đơn, tên bàn hoặc tên khách hàng..."
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20"
          />
        </div>
      </div>

      {/* Orders Table Grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Mã đơn & Bàn</th>
                <th className="px-5 py-3.5">Khách hàng</th>
                <th className="px-5 py-3.5">Danh sách món</th>
                <th className="px-5 py-3.5">Tổng tiền</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5">Thời gian</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPackages.map((pkg) => {
                const totalItemsCount =
                  pkg.items?.reduce((s, it) => s + (Number(it.quantity) || 1), 0) || 1;

                return (
                  <tr
                    key={pkg.id}
                    onClick={() => setActivePackage(pkg)}
                    className="hover:bg-orange-50/20 cursor-pointer transition-colors"
                  >
                    {/* 1. Mã đơn & Bàn (Fixed overflow & clean 2-char badge) */}
                    <td className="px-5 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#E07B39] font-black text-xs flex items-center justify-center shrink-0 border border-orange-200/60 overflow-hidden px-1 text-center">
                          <span className="truncate">{getBadgeLabel(pkg)}</span>
                        </div>
                        <div className="min-w-0">
                          <p
                            className="font-mono font-bold text-xs sm:text-sm text-slate-900 truncate max-w-[140px] sm:max-w-[180px]"
                            title={pkg.id}
                          >
                            {pkg.id}
                          </p>
                          <p className="text-xs text-slate-400 font-medium truncate max-w-[140px]">
                            {pkg.tableName || 'Giao hàng / Mang đi'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 2. Khách hàng */}
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">{pkg.customerName || 'Khách vãng lai'}</p>
                      <p className="text-xs text-slate-400 font-normal">
                        {pkg.customerPhone || 'Không có sđt'}
                      </p>
                    </td>

                    {/* 3. Danh sách món thực tế */}
                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-xs text-slate-700 font-medium line-clamp-1 truncate">
                        {pkg.items && pkg.items.length > 0
                          ? pkg.items.map((it) => `${it.name || 'Món'} (x${it.quantity || 1})`).join(', ')
                          : pkg.note || 'Đơn gọi món'}
                      </p>
                      <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                        Tổng cộng {totalItemsCount} phần món
                      </p>
                    </td>

                    {/* 4. Tổng tiền */}
                    <td className="px-5 py-4 font-black text-[#E07B39]">
                      {formatVND(pkg.totalPrice)}
                    </td>

                    {/* 5. Trạng thái */}
                    <td className="px-5 py-4">
                      <Badge status={pkg.status} type="package" />
                    </td>

                    {/* 6. Thời gian */}
                    <td className="px-5 py-4 text-xs text-slate-500 font-medium">
                      {new Date(pkg.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* 7. Thao tác */}
                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActivePackage(pkg)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#E07B39] hover:text-white text-slate-700 font-bold text-xs transition-all inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredPackages.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-medium">
                    Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal chi tiết đơn */}
      <OrderDetailsModal
        activePackage={activePackage}
        allProducts={allProducts}
        onClose={() => setActivePackage(null)}
        onStatusChange={handleStatusChange}
        onRefresh={fetchOrders}
      />
    </div>
  );
}
