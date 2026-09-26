"use client";

import React, { useState } from "react";
import { Menu, Bell, School, Settings, User, LogOut, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";

export interface NavbarProps {
  onToggleSidebar?: () => void;
  schoolName?: string;
  academicYear?: string;
  userName?: string;
  userRole?: string;
}

export function Navbar({
  onToggleSidebar,
  schoolName = "المدرسة النموذجية الحديثة",
  academicYear = "العام الدراسي 1446-1447هـ",
  userName = "أ. سارة المنصور",
  userRole = "وكيلة الشؤون التعليمية والمتابعة",
}: NavbarProps) {
  const [unreadCount, setUnreadCount] = useState(3);

  const notifications = [
    { id: "1", title: "تأخر غير مبرر", time: "منذ 15 دقيقة", desc: "تم رصد تأخر 35 دقيقة لمعلمة" },
    { id: "2", title: "رد على مساءلة", time: "منذ ساعة", desc: "تم استلام تقرير طبي عبر النظام" },
    { id: "3", title: "اعتماد حسم", time: "أمس", desc: "تم اعتماد مسودة قرار الحسم رقم 104" },
  ];

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 md:px-6 backdrop-blur-md"
    >
      {/* Right Side: Sidebar Toggle (Mobile) + School Info */}
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

      {/* Left Side: System Status, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Badge variant="primary" size="sm" dot className="hidden sm:inline-flex">
          نظام المتابعة نشط
        </Badge>

        {/* Notifications Popover Dropdown */}
        <Dropdown
          align="left"
          trigger={
            <button
              type="button"
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="التنبيهات الإدارية"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>
          }
          items={[
            {
              id: "mark-all",
              label: "تعيين الكل كمقروء",
              icon: <Check className="w-3.5 h-3.5" />,
              onClick: () => setUnreadCount(0),
            },
            ...notifications.map((n) => ({
              id: n.id,
              label: `${n.title} — ${n.desc}`,
              onClick: () => {},
            })),
          ]}
        />

        {/* User Account Settings Dropdown */}
        <Dropdown
          align="left"
          trigger={
            <div className="flex items-center gap-2.5 pr-2 border-r border-slate-200 cursor-pointer select-none">
              <Avatar name={userName} size="sm" status="online" />
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">{userName}</p>
                <p className="text-[10px] text-slate-400">{userRole}</p>
              </div>
            </div>
          }
          items={[
            {
              id: "profile",
              label: "الملف التعريفي",
              icon: <User className="w-4 h-4" />,
              onClick: () => {},
            },
            {
              id: "settings",
              label: "إعدادات الحساب",
              icon: <Settings className="w-4 h-4" />,
              onClick: () => {},
            },
            {
              id: "logout",
              label: "تسجيل الخروج",
              danger: true,
              icon: <LogOut className="w-4 h-4" />,
              onClick: () => {},
            },
          ]}
        />
      </div>
    </header>
  );
}
