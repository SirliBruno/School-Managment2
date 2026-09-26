"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { Drawer } from "@/components/ui/Drawer";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { CalendarX, Clock } from "lucide-react";

export interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar (>= 768px) */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar (< 768px) */}
      <Drawer
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        side="right"
        className="w-72 p-0"
      >
        <Sidebar onClose={() => setMobileSidebarOpen(false)} className="w-full border-none shadow-none" />
      </Drawer>

      {/* Main Content Area (with bottom padding for Mobile BottomNav) */}
      <div className="flex-1 flex flex-col md:pr-64 min-w-0">
        <Navbar onToggleSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (< 768px) */}
      <BottomNav
        onOpenMobileMenu={() => setMobileSidebarOpen(true)}
        onQuickAction={() => setQuickActionOpen(true)}
      />

      {/* Mobile Quick Action Bottom Sheet */}
      <BottomSheet
        isOpen={quickActionOpen}
        onClose={() => setQuickActionOpen(false)}
        title="إجراء سريع — المتابعة الميدانية"
        description="تسجيل فوري مباشر لمعاملات اليوم"
      >
        <div className="space-y-3 pt-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12 text-sm font-bold border-teal-200 hover:bg-teal-50"
            leftIcon={<CalendarX className="w-5 h-5 text-teal-600" />}
            onClick={() => setQuickActionOpen(false)}
          >
            رصد غياب معلمة اليوم
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12 text-sm font-bold border-amber-200 hover:bg-amber-50"
            leftIcon={<Clock className="w-5 h-5 text-amber-600" />}
            onClick={() => setQuickActionOpen(false)}
          >
            تسجيل إشعار تأخر صباحي
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
