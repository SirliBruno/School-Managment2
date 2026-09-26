import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/utils/cn";
import { Card, CardContent } from "./Card";

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  variant?: "default" | "primary" | "warning" | "danger" | "success";
  className?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
  className,
}: StatsCardProps) {
  const iconBgStyles = {
    default: "bg-slate-100 text-slate-700",
    primary: "bg-teal-50 text-teal-700 border border-teal-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-5" dir="rtl">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-500 truncate">{title}</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
          </div>

          {icon && (
            <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center shrink-0", iconBgStyles[variant])}>
              {icon}
            </div>
          )}
        </div>

        {(trend || subtitle) && (
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            {trend && (
              <div className="flex items-center gap-1 font-bold">
                {trend.direction === "up" && (
                  <span className="flex items-center text-rose-600 gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {trend.value}
                  </span>
                )}
                {trend.direction === "down" && (
                  <span className="flex items-center text-emerald-600 gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" />
                    {trend.value}
                  </span>
                )}
                {trend.direction === "neutral" && (
                  <span className="flex items-center text-slate-500 gap-0.5">
                    <Minus className="w-3.5 h-3.5" />
                    {trend.value}
                  </span>
                )}
                {trend.label && <span className="text-[11px] text-slate-400 font-normal">{trend.label}</span>}
              </div>
            )}
            {subtitle && (
              <span className="text-[11px] text-slate-400 font-normal mr-auto truncate">{subtitle}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
