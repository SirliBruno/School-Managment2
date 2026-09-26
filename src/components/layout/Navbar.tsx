"use client";

import React from "react";
import { Menu, Bell, School } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface NavbarProps {
  onToggleSidebar?: () => void;
  schoolName?: string;
  academicYear?: string;
}

export function Navbar({
  onToggleSidebar,
  schoolName = "المدرسة النموذجية الحديثة",
  academicYear = "العام الدراسي 1446-1447هـ",
}: NavbarProps) {
  return (
    <header
      dir="rtl"
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 md:px-6 backdrop-blur-md"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors md:hidden"
          aria-label="فتح القائمة الجانبية"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">{schoolName}</h2>
            <p className="text-[11px] text-slate-500">{academicYear}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Badge variant="primary" size="sm" dot>
          النظام متصل
        </Badge>

        <button
          type="button"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="التنبيهات"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-slate-200">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
            م.ع
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-800 leading-tight">إدارة المدرسة</p>
            <p className="text-[10px] text-slate-400">مسؤولة الغياب</p>
          </div>
        </div>
      </div>
    </header>
  );
}
