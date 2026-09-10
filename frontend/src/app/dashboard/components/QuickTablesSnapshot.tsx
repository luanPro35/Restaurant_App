'use client';

import React from 'react';
import Link from 'next/link';
import { Table } from '../../../types';

interface QuickTablesSnapshotProps {
  tables: Table[];
}

export const QuickTablesSnapshot: React.FC<QuickTablesSnapshotProps> = ({ tables }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800">Sơ đồ bàn nhanh</h2>
        <Link href="/tables" className="text-xs font-semibold text-[#E07B39] hover:underline">
          Quản lý bàn
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {tables.slice(0, 9).map((tbl) => (
          <Link
            key={tbl.id}
            href="/tables"
            className={`p-3 rounded-xl border text-center cursor-pointer transition-all hover:scale-105 block ${
              tbl.status === 'OCCUPIED'
                ? 'bg-orange-50 border-orange-200 text-orange-900'
                : tbl.status === 'RESERVED'
                ? 'bg-purple-50 border-purple-200 text-purple-900'
                : 'bg-emerald-50/50 border-emerald-100 text-emerald-900'
            }`}
          >
            <p className="font-bold text-xs">
              {tbl.name.replace(' (Tầng 1)', '').replace(' (Tầng 2)', '')}
            </p>
            <p className="text-[10px] opacity-75 mt-0.5">
              {tbl.status === 'OCCUPIED'
                ? 'Có khách'
                : tbl.status === 'RESERVED'
                ? 'Đã đặt'
                : 'Trống'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};
