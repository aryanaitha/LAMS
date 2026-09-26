import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  variant?: "default" | "warning" | "success" | "danger" | "info";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className = "",
}: StatCardProps) {
  const variantStyles = {
    default: "bg-white border-slate-200 text-slate-900",
    warning: "bg-amber-50/50 border-amber-200 text-amber-950",
    success: "bg-emerald-50/50 border-emerald-200 text-emerald-950",
    danger: "bg-rose-50/50 border-rose-200 text-rose-950",
    info: "bg-sky-50/50 border-sky-200 text-sky-950",
  };

  const iconStyles = {
    default: "bg-slate-100 text-slate-700",
    warning: "bg-amber-100 text-amber-700",
    success: "bg-emerald-100 text-emerald-700",
    danger: "bg-rose-100 text-rose-700",
    info: "bg-sky-100 text-sky-700",
  };

  return (
    <div
      className={`p-4 rounded-xl border shadow-xs transition hover:shadow-md ${variantStyles[variant]} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${iconStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100/80 pt-2">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold ${
                trend.isPositive ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
