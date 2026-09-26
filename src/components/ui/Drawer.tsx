"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  side?: "right" | "left";
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  side = "right",
  className,
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const slideInitial = side === "right" ? { x: "100%" } : { x: "-100%" };
  const slideExit = side === "right" ? { x: "100%" } : { x: "-100%" };

  return (
    <AnimatePresence>
      {isOpen && (
        <div dir="rtl" className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <div
            className={cn(
              "fixed inset-y-0 flex max-w-full pointer-events-none",
              side === "right" ? "right-0" : "left-0"
            )}
          >
            <motion.div
              initial={slideInitial}
              animate={{ x: 0 }}
              exit={slideExit}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn(
                "pointer-events-auto w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col",
                className
              )}
            >
              {(title || description) && (
                <div className="flex items-start justify-between p-5 border-b border-slate-100">
                  <div>
                    {title && <h3 className="text-base font-bold text-slate-900">{title}</h3>}
                    {description && (
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    aria-label="إغلاق"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <div className="flex-1 overflow-y-auto p-5">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
