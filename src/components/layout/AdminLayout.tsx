"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Drawer } from "@/components/ui/Drawer";

export interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pr-64 min-w-0">
        <Navbar onToggleSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
