'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '../../../components/common/Badge';
import { Product, getProductImage } from '../../../types';

interface TopSellingDishesProps {
  products: Product[];
}

export const TopSellingDishes: React.FC<TopSellingDishesProps> = ({ products }) => {
  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800">Món nổi bật trong thực đơn</h2>
        <Link href="/products" className="text-xs font-semibold text-[#E07B39] hover:underline">
          Thực đơn
        </Link>
      </div>

      <div className="space-y-3">
        {products.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">Chưa có món ăn nào.</p>
        ) : (
          products.map((prod) => (
            <div key={prod.id} className="flex items-center gap-3">
              <img
                src={getProductImage(prod)}
                alt={prod.name}
                className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100 shadow-2xs"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{prod.name}</p>
                <p className="text-xs text-[#E07B39] font-semibold">{formatVND(prod.price)}</p>
              </div>
              <Badge status={prod.isAvailable} type="boolean" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};