"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "تأكيد الإجراء",
  cancelText = "إلغاء",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const iconVariants = {
    danger: "bg-rose-50 text-rose-600",
    warning: "bg-amber-50 text-amber-600",
    primary: "bg-teal-50 text-teal-600",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center p-2" dir="rtl">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${iconVariants[variant]}`}>
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed max-w-xs">{message}</p>

        <div className="flex items-center gap-3 w-full">
          <Button
            variant={variant}
            className="flex-1"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            disabled={isLoading}
            onClick={onClose}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
