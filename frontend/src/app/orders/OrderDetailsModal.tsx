'use client';

import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Package, PackageStatus, Product } from '../../types';
import { Clock, Phone, User, ChefHat, Check, Printer, QrCode, Plus, Trash2, ArrowRight } from 'lucide-react';
import apiService from '../../services/api';

interface OrderDetailsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  pkg?: Package | null;
  activePackage?: Package | null;
  onStatusChange: (packageId: string, nextStatus: PackageStatus) => void;
  onPackageUpdated?: () => void;
  onRefresh?: () => void;
  allProducts: Product[];
}

const statusWorkflow: PackageStatus[] = [
  'CONFIRMED',
  'COOKING',
  'DELIVERING',
  'RECEIVED',
  'COMPLETED',
];

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  pkg,
  activePackage,
  onStatusChange,
  onPackageUpdated,
  onRefresh,
  allProducts,
}) => {
  const currentPkg = pkg || activePackage;
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showQrModal, setShowQrModal] = useState(false);

  if (!currentPkg) return null;

  const refreshCallback = onRefresh || onPackageUpdated || (() => {});

  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  const getNextStatus = (current: PackageStatus): PackageStatus | null => {
    const idx = statusWorkflow.indexOf(current);
    if (idx >= 0 && idx < statusWorkflow.length - 1) {
      return statusWorkflow[idx + 1];
    }
    return null;
  };

  const nextStatus = getNextStatus(currentPkg.status);

  const handleAddFood = async () => {
    if (!selectedProductId) return;
    await apiService.addFoodToPackage(currentPkg.id, [{ productId: selectedProductId, quantity }]);
    setSelectedProductId('');
    setQuantity(1);
    setShowAddFood(false);
    refreshCallback();
  };

  return (
    <Modal
      isOpen={isOpen ?? true}
      onClose={onClose}
      title={`Chi tiết đơn hàng #${currentPkg.id.length > 12 ? currentPkg.id.slice(0, 8) + '...' : currentPkg.id}`}
      subtitle={`Bàn: ${currentPkg.tableName || 'Giao hàng / Mang đi'} • Tạo lúc ${new Date(currentPkg.createdAt).toLocaleTimeString('vi-VN')}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Status Stepper Tracker */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Tiến trình xử lý đơn</span>
            <Badge status={currentPkg.status} type="package" />
          </div>

          <div className="grid grid-cols-5 gap-2 pt-2">
            {statusWorkflow.map((st, i) => {
              const currentIdx = statusWorkflow.indexOf(currentPkg.status);
              const isPast = i <= currentIdx;
              const isCurrent = i === currentIdx;

              const statusLabels: Record<PackageStatus, string> = {
                CONFIRMED: '1. Tiếp nhận',
                COOKING: '2. Nấu món',
                DELIVERING: '3. Phục vụ',
                RECEIVED: '4. Đã lên bàn',
                COMPLETED: '5. Hoàn tất',
                PENDING: 'Chờ',
                CANCELED: 'Đã hủy',
              };

              return (
                <div key={st} className="text-center">
                  <div
                    className={`h-2 rounded-full mb-1 transition-all ${
                      isCurrent
                        ? 'bg-[#E07B39] shadow-sm shadow-orange-500/30'
                        : isPast
                        ? 'bg-emerald-500'
                        : 'bg-slate-200'
                    }`}
                  />
                  <span
                    className={`text-[11px] block truncate ${
                      isCurrent ? 'font-bold text-[#E07B39]' : isPast ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {statusLabels[st]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer & Note Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl border border-slate-100 bg-white space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Khách hàng</span>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <User className="w-4 h-4 text-[#E07B39]" />
              <span>{currentPkg.customerName || 'Khách vãng lai'}</span>
            </div>
            {currentPkg.customerPhone && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Phone className="w-3.5 h-3.5" />
                <span>{currentPkg.customerPhone}</span>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-white space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ghi chú bếp</span>
            <p className="text-xs text-slate-600 italic">
              {currentPkg.note ? `"${currentPkg.note}"` : 'Không có ghi chú đặc biệt'}
            </p>
          </div>
        </div>

        {/* Ordered Food Items List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-800">Danh sách món đã gọi ({currentPkg.items?.length || 0})</h4>
            <button
              onClick={() => setShowAddFood(!showAddFood)}
              className="text-xs font-semibold text-[#E07B39] hover:bg-orange-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 border border-orange-200"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm món vào đơn
            </button>
          </div>

          {showAddFood && (
            <div className="mb-4 p-4 rounded-xl bg-orange-50/60 border border-orange-200 space-y-3">
              <p className="text-xs font-bold text-orange-900">Chọn món muốn thêm cho khách:</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
                >
                  <option value="">-- Chọn món trong thực đơn --</option>
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatVND(p.price)})
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-center font-bold text-slate-800"
                  />
                  <button
                    onClick={handleAddFood}
                    disabled={!selectedProductId}
                    className="px-4 py-2 bg-[#E07B39] text-white rounded-xl text-xs font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors"
                  >
                    Xác nhận thêm
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-white">
            {currentPkg.items && currentPkg.items.length > 0 ? (
              currentPkg.items.map((item, idx) => (
                <div key={item.id || idx} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#E07B39] font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-sm text-slate-800 truncate">{item.name || item.product?.name || 'Món ăn'}</h5>
                      <p className="text-xs text-slate-400">
                        Đơn giá: {formatVND(item.price)} x <span className="font-bold text-slate-700">{item.quantity}</span>
                      </p>
                      {item.note && <p className="text-[11px] text-orange-600 italic">Lưu ý: {item.note}</p>}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm text-[#E07B39]">{formatVND(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">Không có thông tin chi tiết món</div>
            )}
          </div>
        </div>

        {/* Total Price Summary */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng cộng thanh toán</p>
            <p className="text-[11px] text-slate-400">Bao gồm VAT và phí dịch vụ</p>
          </div>
          <span className="text-2xl font-black text-[#E07B39] tracking-tight">{formatVND(currentPkg.totalPrice)}</span>
        </div>

        {/* QR & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-2 transition-colors"
            >
              <QrCode className="w-4 h-4 text-[#E07B39]" />
              Mã VietQR
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              In phiếu bếp
            </button>
          </div>

          <div className="flex items-center gap-2">
            {currentPkg.status !== 'CANCELED' && currentPkg.status !== 'COMPLETED' && (
              <button
                onClick={() => onStatusChange(currentPkg.id, 'CANCELED')}
                className="px-3.5 py-2.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 transition-colors"
              >
                Hủy đơn
              </button>
            )}

            {nextStatus && (
              <button
                onClick={() => onStatusChange(currentPkg.id, nextStatus)}
                className="px-5 py-2.5 rounded-xl bg-[#E07B39] hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center gap-2"
              >
                <span>Chuyển sang: {nextStatus}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* VietQR View Modal */}
        {showQrModal && (
          <div className="p-4 bg-white border-2 border-dashed border-orange-200 rounded-2xl text-center space-y-3">
            <h5 className="font-bold text-sm text-slate-800">Quét mã VietQR chuyển khoản nhanh</h5>
            <div className="flex justify-center">
              <img
                src={`https://api.vietqr.io/image/970422-0977123456-compact2.jpg?amount=${currentPkg.totalPrice}&addInfo=DH%20${currentPkg.id}&accountName=RESTAURANT%20MASTER`}
                alt="VietQR"
                className="w-56 h-56 rounded-xl border shadow-sm"
              />
            </div>
            <p className="text-xs text-slate-500">Nội dung chuyển khoản: <span className="font-mono font-bold text-slate-800">DH {currentPkg.id}</span></p>
            <button
              onClick={() => setShowQrModal(false)}
              className="px-4 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
