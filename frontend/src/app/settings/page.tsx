'use client';

import React, { useState } from 'react';
import { Settings, Store, Bell, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [restaurantName, setRestaurantName] = useState('Dolin Restaurant & Bar');
  const [phone, setPhone] = useState('0977 123 456');
  const [address, setAddress] = useState('123 Đường Ẩm Thực, Quận 1, TP. Hồ Chí Minh');
  const [openHours, setOpenHours] = useState('09:00 - 23:00');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-7 h-7 text-[#E07B39]" />
            Cài Đặt Hệ Thống & Nhà Hàng
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Thiết lập thông tin thương hiệu, giờ mở cửa và cấu hình thiết bị nhà bếp.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Restaurant Profile */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
            <Store className="w-5 h-5 text-[#E07B39]" />
            Thông tin nhà hàng
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên nhà hàng</label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hotline liên hệ</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ quán</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Giờ mở cửa phục vụ</label>
              <input
                type="text"
                value={openHours}
                onChange={(e) => setOpenHours(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
              />
            </div>
          </div>
        </div>

        {/* Sync Settings */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#E07B39]" />
            Cấu hình đồng bộ Mobile & Bếp
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="font-bold text-sm text-slate-800">Âm thanh chuông báo đơn mới</p>
                <p className="text-xs text-slate-500">Phát âm thanh chuông khi có khách đặt bàn hoặc gọi món mới</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-[#E07B39] rounded focus:ring-[#E07B39]" />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="font-bold text-sm text-slate-800">Tự động in phiếu bếp khi tiếp nhận đơn</p>
                <p className="text-xs text-slate-500">Gửi lệnh in nhiệt trực tiếp tới máy in tại khu vực bếp</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-[#E07B39] rounded focus:ring-[#E07B39]" />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> Đã lưu cấu hình thành công!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 bg-[#E07B39] hover:bg-orange-600 text-white rounded-xl text-sm font-bold shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Lưu thiết lập</span>
          </button>
        </div>
      </form>
    </div>
  );
}
