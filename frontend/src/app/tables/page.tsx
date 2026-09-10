'use client';

import React, { useEffect, useState } from 'react';
import { Table, Product, TableStatus } from '../../types';
import apiService from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { AddFoodToTableModal } from './AddFoodToTableModal';
import { Modal } from '../../components/common/Modal';
import { Grid2X2, Plus, Users, UtensilsCrossed, RefreshCw, Clock, Layers } from 'lucide-react';

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState<string>('ALL');

  // Modals state
  const [activeTableForFood, setActiveTableForFood] = useState<Table | null>(null);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState(4);
  const [newTableFloor, setNewTableFloor] = useState('Tầng 1');

  const fetchTablesData = async () => {
    try {
      setLoading(true);
      const [tbls, prods] = await Promise.all([
        apiService.getTables(),
        apiService.getProducts(),
      ]);
      setTables(tbls);
      setProducts(prods);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTablesData();
  }, []);

  const handleUpdateStatus = async (tableId: string | number, status: TableStatus) => {
    await apiService.updateTableStatus(tableId, status);
    fetchTablesData();
  };

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName) return;
    await apiService.createTable({
      name: newTableName,
      capacity: newTableCapacity,
      floor: newTableFloor,
      status: 'AVAILABLE',
    });
    setNewTableName('');
    setShowAddTableModal(false);
    fetchTablesData();
  };

  const floors = ['ALL', 'Tầng 1', 'Tầng 2', 'Vip 1', 'Vip 2', 'Sân Vườn'];

  const filteredTables = tables.filter((t) => {
    if (selectedFloor === 'ALL') return true;
    return t.floor === selectedFloor || t.location === selectedFloor;
  });

  const countAvailable = tables.filter((t) => t.status === 'AVAILABLE').length;
  const countOccupied = tables.filter((t) => t.status === 'OCCUPIED').length;
  const countReserved = tables.filter((t) => t.status === 'RESERVED').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Grid2X2 className="w-7 h-7 text-[#E07B39]" />
            Sơ Đồ Bàn & Chỗ Ngồi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Đồng bộ thời gian thực từ cơ sở dữ liệu ({tables.length} bàn).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddTableModal(true)}
            className="px-4 py-2 bg-[#E07B39] hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm bàn mới</span>
          </button>
          <button
            onClick={fetchTablesData}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#E07B39]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overview Status Pills */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
            {countAvailable}
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-900">Bàn đang trống</p>
            <p className="text-[11px] text-emerald-700">Sẵn sàng nhận khách</p>
          </div>
        </div>

        <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E07B39] text-white flex items-center justify-center font-bold">
            {countOccupied}
          </div>
          <div>
            <p className="text-xs font-bold text-orange-900">Đang có khách</p>
            <p className="text-[11px] text-orange-700">Đang ăn & phục vụ</p>
          </div>
        </div>

        <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold">
            {countReserved}
          </div>
          <div>
            <p className="text-xs font-bold text-purple-900">Đã đặt trước</p>
            <p className="text-[11px] text-purple-700">Khách hẹn giờ tới</p>
          </div>
        </div>
      </div>

      {/* Floor Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <Layers className="w-4 h-4 text-slate-400 mr-1" />
        {floors.map((floor) => (
          <button
            key={floor}
            onClick={() => setSelectedFloor(floor)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFloor === floor
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {floor === 'ALL' ? 'Tất cả khu vực' : floor}
          </button>
        ))}
      </div>

      {/* Tables Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTables.map((table) => {
          const isOccupied = table.status === 'OCCUPIED';
          const isReserved = table.status === 'RESERVED';

          return (
            <div
              key={table.id}
              className={`rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between relative bg-white shadow-sm hover:shadow-md ${
                isOccupied
                  ? 'border-orange-300 ring-2 ring-orange-100'
                  : isReserved
                  ? 'border-purple-300 ring-2 ring-purple-100'
                  : 'border-slate-100 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Table Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {table.location || table.floor || 'Tầng 1'}
                  </span>
                  <Badge status={table.status} type="table" />
                </div>

                {/* Table Name & Capacity */}
                <h3 className="font-extrabold text-base text-slate-800">{table.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sức chứa: {table.capacity} người</span>
                </div>

                {/* Active Package info if occupied */}
                {isOccupied && (
                  <div className="mt-3 p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 font-medium">
                    <p className="font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#E07B39]" />
                      Đang có đơn hoạt động
                    </p>
                    <p className="text-[11px] text-orange-700 mt-0.5">
                      Mã đơn: {table.currentPackageId || `PKG-${table.id}`}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => setActiveTableForFood(table)}
                  className="w-full py-2 px-3 rounded-xl bg-[#E07B39] hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Thêm món cho bàn</span>
                </button>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        table.id,
                        table.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE'
                      )
                    }
                    className="py-1.5 px-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors"
                  >
                    {table.status === 'AVAILABLE' ? 'Nhận khách' : 'Báo trả bàn'}
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        table.id,
                        table.status === 'RESERVED' ? 'AVAILABLE' : 'RESERVED'
                      )
                    }
                    className="py-1.5 px-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors"
                  >
                    {table.status === 'RESERVED' ? 'Hủy đặt' : 'Đặt trước'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Food Modal */}
      <AddFoodToTableModal
        isOpen={!!activeTableForFood}
        onClose={() => setActiveTableForFood(null)}
        table={activeTableForFood}
        products={products}
        onSuccess={fetchTablesData}
      />

      {/* Create Table Modal */}
      <Modal
        isOpen={showAddTableModal}
        onClose={() => setShowAddTableModal(false)}
        title="Thêm Bàn Mới"
        subtitle="Tạo thêm bàn trong sơ đồ nhà hàng"
      >
        <form onSubmit={handleCreateTable} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên bàn *</label>
            <input
              type="text"
              required
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder="VD: Bàn 5, Bàn VIP 03..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sức chứa (Người)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={newTableCapacity}
                onChange={(e) => setNewTableCapacity(parseInt(e.target.value) || 4)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Khu vực / Tầng</label>
              <select
                value={newTableFloor}
                onChange={(e) => setNewTableFloor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
              >
                <option value="Tầng 1">Tầng 1</option>
                <option value="Tầng 2">Tầng 2</option>
                <option value="Vip 1">Vip 1</option>
                <option value="Vip 2">Vip 2</option>
                <option value="Sân Vườn">Sân Vườn</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddTableModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#E07B39] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20"
            >
              Tạo bàn
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
