'use client';

import React, { useEffect, useState } from 'react';
import { PaymentTransaction } from '../../types';
import apiService from '../../services/api';
import { CreditCard, QrCode, CheckCircle2, DollarSign, Wallet } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic QR Modal
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrAmount, setQrAmount] = useState(250000);
  const [qrNote, setQrNote] = useState('Thanh toan Dolin');

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPayments();
      setPayments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-[#E07B39]" />
            Thanh Toán & Cấu Hình VietQR
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tra cứu lịch sử thanh toán hóa đơn và tạo mã VietQR động cho khách chuyển khoản.
          </p>
        </div>

        <button
          onClick={() => setShowQrModal(true)}
          className="px-4 py-2 bg-[#E07B39] hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all"
        >
          <QrCode className="w-4 h-4" />
          <span>Tạo mã QR thu tiền</span>
        </button>
      </div>

      {/* Gateway Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Cổng thanh toán</span>
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">VietQR / Chuyển khoản</h3>
            <p className="text-xs opacity-90 mt-0.5">Tự động nhận diện thanh toán qua Ngân Hàng</p>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse"></span>
            Đang hoạt động (Online)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Ví điện tử</span>
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">Ví MoMo & ZaloPay</h3>
            <p className="text-xs opacity-90 mt-0.5">Thanh toán 1 chạm trên app</p>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-200 animate-pulse"></span>
            Đang hoạt động (Online)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Tiền mặt tại quầy</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">POS & Tiền mặt</h3>
            <p className="text-xs opacity-90 mt-0.5">In hóa đơn trực tiếp tại quầy thu ngân</p>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Sẵn sàng phục vụ
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-800">Lịch sử giao dịch gần đây</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Mã GD</th>
                <th className="px-5 py-3.5">Khách hàng & Bàn</th>
                <th className="px-5 py-3.5">Phương thức</th>
                <th className="px-5 py-3.5">Số tiền</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-slate-800">{p.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-800">{p.customerName || 'Khách vãng lai'}</p>
                    <p className="text-xs text-slate-400">{p.tableName || 'Quầy thu ngân'}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs">
                      {p.method}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-black text-[#E07B39]">{formatVND(p.amount)}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Thành công
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">{p.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Generator Modal */}
      <Modal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        title="Tạo Mã VietQR Thu Tiền Trực Tiếp"
        subtitle="Mã thanh toán tự động điền số tiền và nội dung chuyển khoản"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Số tiền cần thu (VNĐ)</label>
            <input
              type="number"
              step="1000"
              value={qrAmount}
              onChange={(e) => setQrAmount(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-bold text-[#E07B39] focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung chuyển khoản</label>
            <input
              type="text"
              value={qrNote}
              onChange={(e) => setQrNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
            <img
              src={`https://api.vietqr.io/image/970422-0977123456-compact2.jpg?amount=${qrAmount}&addInfo=${encodeURIComponent(
                qrNote
              )}&accountName=RESTAURANT%20MASTER`}
              alt="VietQR"
              className="w-56 h-56 mx-auto rounded-xl border shadow-md bg-white"
            />
            <p className="text-xs text-slate-500">Khách quét mã trên app ngân hàng để thanh toán tự động</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
