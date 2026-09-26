"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, PlusCircle, Clock, Menu } from "lucide-react";
import { cn } from "@/utils/cn";

export interface BottomNavProps {
  onOpenMobileMenu?: () => void;
  onQuickAction?: () => void;
}

export function BottomNav({ onOpenMobileMenu, onQuickAction }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "الرئيسية", href: "/", icon: LayoutDashboard },
    { label: "المعلمات", href: "/teachers", icon: Users },
    { label: "التأخر", href: "/delays", icon: Clock },
  ];

  return (
    <nav
      dir="rtl"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 shadow-lg select-none"
      aria-label="شريط التنقل السفلي للجوال"
    >
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* First item */}
        <Link
          href={navItems[0].href}
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors",
            pathname === navItems[0].href
              ? "text-teal-600 font-bold"
              : "text-slate-400 hover:text-slate-700"
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">{navItems[0].label}</span>
        </Link>

        {/* Second item */}
        <Link
          href={navItems[1].href}
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors",
            pathname === navItems[1].href
              ? "text-teal-600 font-bold"
              : "text-slate-400 hover:text-slate-700"
          )}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">{navItems[1].label}</span>
        </Link>

        {/* Center Floating Quick Action Button */}
        <button
          type="button"
          onClick={onQuickAction}
          className="-mt-5 w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg hover:bg-teal-700 active:scale-95 transition-all ring-4 ring-white focus:outline-none focus:ring-teal-200"
          aria-label="رصد سريع"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        {/* Third item */}
        <Link
          href={navItems[2].href}
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors",
            pathname === navItems[2].href
              ? "text-teal-600 font-bold"
              : "text-slate-400 hover:text-slate-700"
          )}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px]">{navItems[2].label}</span>
        </Link>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="فتح القائمة الكاملة"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px]">القائمة</span>
        </button>
      </div>
    </nav>
  );
}
