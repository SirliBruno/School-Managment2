"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/utils/cn";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

export interface ToastProps {
  toast: ToastItem;
  onClose: (id: string) => void;
}

const toastTypeStyles: Record<
  ToastType,
  { container: string; icon: string; title: string; defaultTitle: string }
> = {
  success: {
    container: "bg-emerald-50 border-emerald-300 text-emerald-950",
    icon: "text-emerald-600",
    title: "text-emerald-800",
    defaultTitle: "تم بنجاح",
  },
  error: {
    container: "bg-rose-50 border-rose-300 text-rose-950",
    icon: "text-rose-600",
    title: "text-rose-800",
    defaultTitle: "حدث خطأ",
  },
  warning: {
    container: "bg-amber-50 border-amber-300 text-amber-950",
    icon: "text-amber-600",
    title: "text-amber-800",
    defaultTitle: "تنبيه إداري",
  },
  info: {
    container: "bg-teal-50 border-teal-300 text-teal-950",
    icon: "text-teal-600",
    title: "text-teal-800",
    defaultTitle: "معلومة",
  },
};

export function Toast({ toast, onClose }: ToastProps) {
  const meta = toastTypeStyles[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      className={cn(
        "pointer-events-auto flex items-start gap-3 w-full max-w-sm rounded-xl border p-4 shadow-lg backdrop-blur-sm",
        meta.container
      )}
      role="alert"
      dir="rtl"
    >
      <div className="shrink-0 mt-0.5">
        {toast.type === "success" && <CheckCircle2 className={cn("w-5 h-5", meta.icon)} />}
        {toast.type === "error" && <AlertCircle className={cn("w-5 h-5", meta.icon)} />}
        {toast.type === "warning" && <AlertTriangle className={cn("w-5 h-5", meta.icon)} />}
        {toast.type === "info" && <Info className={cn("w-5 h-5", meta.icon)} />}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className={cn("text-sm font-bold leading-5", meta.title)}>
          {toast.title || meta.defaultTitle}
        </h4>
        <p className="mt-1 text-xs leading-relaxed text-slate-700">{toast.message}</p>
      </div>

      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
        aria-label="إغلاق التنبيه"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}) {
  return (
    <div
      className="fixed top-4 left-4 z-50 flex flex-col gap-2 pointer-events-none max-w-full sm:max-w-md w-full px-4 sm:px-0"
      dir="rtl"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}
