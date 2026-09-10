import React from 'react';
import { PackageStatus, TableStatus, Role } from '../../types';

interface BadgeProps {
  status?: PackageStatus | TableStatus | Role | boolean | string;
  type?: 'package' | 'table' | 'role' | 'boolean' | 'custom';
  className?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ status, type = 'package', className = '', children }) => {
  let colorStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  let label: React.ReactNode = children || String(status ?? '');

  if (type === 'package') {
    switch (status) {
      case 'PENDING':
        colorStyle = 'bg-amber-50 text-amber-700 border-amber-200';
        label = 'Chờ xử lý';
        break;
      case 'CONFIRMED':
        colorStyle = 'bg-blue-50 text-blue-700 border-blue-200';
        label = 'Đã tiếp nhận';
        break;
      case 'COOKING':
        colorStyle = 'bg-orange-50 text-orange-700 border-orange-200 font-semibold';
        label = 'Đang chế biến';
        break;
      case 'DELIVERING':
        colorStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200';
        label = 'Đang phục vụ món';
        break;
      case 'RECEIVED':
        colorStyle = 'bg-cyan-50 text-cyan-700 border-cyan-200';
        label = 'Khách đã nhận';
        break;
      case 'COMPLETED':
        colorStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        label = 'Hoàn tất';
        break;
      case 'CANCELED':
        colorStyle = 'bg-rose-50 text-rose-700 border-rose-200';
        label = 'Đã hủy';
        break;
    }
  } else if (type === 'table') {
    switch (status) {
      case 'AVAILABLE':
        colorStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        label = 'Bàn trống';
        break;
      case 'OCCUPIED':
        colorStyle = 'bg-orange-50 text-orange-700 border-orange-200 font-semibold';
        label = 'Đang có khách';
        break;
      case 'RESERVED':
        colorStyle = 'bg-purple-50 text-purple-700 border-purple-200';
        label = 'Đã đặt trước';
        break;
      case 'MAINTENANCE':
        colorStyle = 'bg-slate-100 text-slate-600 border-slate-200';
        label = 'Tạm khóa';
        break;
    }
  } else if (type === 'role') {
    switch (status) {
      case 'ADMIN':
        colorStyle = 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
        label = 'Quản trị viên (ADMIN)';
        break;
      case 'STAFF':
        colorStyle = 'bg-blue-50 text-blue-700 border-blue-200 font-semibold';
        label = 'Nhân viên (STAFF)';
        break;
      case 'USER':
        colorStyle = 'bg-slate-100 text-slate-700 border-slate-200';
        label = 'Khách hàng (USER)';
        break;
    }
  } else if (type === 'boolean') {
    if (Boolean(status) === true) {
      colorStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      label = 'Đang hoạt động';
    } else {
      colorStyle = 'bg-slate-100 text-slate-500 border-slate-200';
      label = 'Tạm tắt';
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border transition-colors ${colorStyle} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {children || label}
    </span>
  );
};
