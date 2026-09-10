import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorTheme?: 'orange' | 'emerald' | 'blue' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorTheme = 'orange',
}) => {
  const colorMap = {
    orange: {
      bgIcon: 'bg-orange-50 text-[#E07B39]',
      borderHover: 'hover:border-orange-300',
    },
    emerald: {
      bgIcon: 'bg-emerald-50 text-emerald-600',
      borderHover: 'hover:border-emerald-300',
    },
    blue: {
      bgIcon: 'bg-blue-50 text-blue-600',
      borderHover: 'hover:border-blue-300',
    },
    purple: {
      bgIcon: 'bg-purple-50 text-purple-600',
      borderHover: 'hover:border-purple-300',
    },
  };

  const theme = colorMap[colorTheme] || colorMap.orange;

  return (
    <div className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 ${theme.borderHover}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 mt-2 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.bgIcon}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 flex items-center gap-2 text-xs font-medium pt-3 border-t border-slate-50">
          {trend && (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded ${
                trend.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}
            </span>
          )}
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
