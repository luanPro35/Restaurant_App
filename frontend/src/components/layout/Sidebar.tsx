'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Grid2X2,
  UtensilsCrossed,
  Tags,
  MessageSquare,
  TicketPercent,
  Users,
  CreditCard,
  BarChart3,
  Settings,
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string | number;
}

const navItems: NavItem[] = [
  { name: 'Tổng quan', path: '/', icon: LayoutDashboard },
  { name: 'Đơn hàng & Gói món', path: '/orders', icon: ShoppingBag, badge: 'Live' },
  { name: 'Sơ đồ bàn & Chỗ', path: '/tables', icon: Grid2X2 },
  { name: 'Thực đơn & Món ăn', path: '/products', icon: UtensilsCrossed },
  { name: 'Danh mục món', path: '/categories', icon: Tags },
  { name: 'Chat Khách hàng', path: '/live-chat', icon: MessageSquare, badge: 2 },
  { name: 'Voucher & Khuyến mãi', path: '/promotions', icon: TicketPercent },
  { name: 'Nhân viên & Người dùng', path: '/users', icon: Users },
  { name: 'Thanh toán & VietQR', path: '/payments', icon: CreditCard },
  { name: 'Báo cáo & Thống kê', path: '/statistics', icon: BarChart3 },
  { name: 'Cài đặt hệ thống', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-orange-50/50 to-transparent">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E07B39] to-[#EA580C] flex items-center justify-center text-white shadow-md shadow-orange-500/20">
          <UtensilsCrossed className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-slate-900 text-lg leading-tight tracking-tight">
            Dolin <span className="text-[#E07B39]">Admin</span>
          </h1>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Menu Quản Trị
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-orange-50 text-[#E07B39] font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-[#E07B39]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#E07B39] text-white'
                      : 'bg-orange-100 text-[#E07B39]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

