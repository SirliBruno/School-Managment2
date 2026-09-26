"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileQuestion,
  Clock,
  FileMinus,
  Archive,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/Badge";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "لوحة التحكم", href: "/", icon: LayoutDashboard },
  { label: "المعلمات", href: "/teachers", icon: Users },
  { label: "الغياب والمساءلات", href: "/inquiries", icon: FileQuestion },
  { label: "التأخر والانصراف", href: "/delays", icon: Clock },
  { label: "قرارات الحسم", href: "/deductions", icon: FileMinus },
  { label: "الأرشيف", href: "/archive", icon: Archive },
  { label: "إعدادات النظام", href: "/settings", icon: Settings },
];

export function Sidebar({ className, onClose }: { className?: string; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      dir="rtl"
      className={cn(
        "flex h-full w-64 flex-col border-l border-slate-200 bg-white shadow-sm select-none",
        className
      )}
    >
      {/* Brand header */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-900 leading-tight">منصة الغياب</span>
          <span className="text-[10px] text-teal-700 font-bold">المساءلات الإدارية</span>
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-400">القائمة الإدارية</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all",
                isActive
                  ? "bg-teal-50 text-teal-800 font-bold shadow-xs border border-teal-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive ? "text-teal-600" : "text-slate-400"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant={isActive ? "primary" : "neutral"} size="sm">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>

      {/* System status footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>نظام التصميم</span>
          <span className="font-bold text-teal-700">Sprint 1 UX</span>
        </div>
      </div>
    </aside>
  );
}
