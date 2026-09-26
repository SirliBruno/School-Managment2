"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "success" | "warning" | "danger";
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: React.ReactNode;
}

const variantStyles = {
  primary: {
    container: "bg-teal-50 border-teal-200 text-teal-950",
    icon: "text-teal-600",
    title: "text-teal-900",
  },
  success: {
    container: "bg-emerald-50 border-emerald-200 text-emerald-950",
    icon: "text-emerald-600",
    title: "text-emerald-900",
  },
  warning: {
    container: "bg-amber-50 border-amber-200 text-amber-950",
    icon: "text-amber-600",
    title: "text-amber-900",
  },
  danger: {
    container: "bg-rose-50 border-rose-200 text-rose-950",
    icon: "text-rose-600",
    title: "text-rose-900",
  },
};

export function Alert({
  variant = "primary",
  title,
  description,
  icon,
  dismissible = false,
  onDismiss,
  actions,
  children,
  className,
  ...props
}: AlertProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const styles = variantStyles[variant];

  if (isDismissed) return null;

  const defaultIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle2 className={cn("w-5 h-5", styles.icon)} />;
      case "warning":
        return <AlertTriangle className={cn("w-5 h-5", styles.icon)} />;
      case "danger":
        return <AlertCircle className={cn("w-5 h-5", styles.icon)} />;
      case "primary":
      default:
        return <Info className={cn("w-5 h-5", styles.icon)} />;
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      dir="rtl"
      role="alert"
      className={cn(
        "flex items-start gap-3 p-4 rounded-2xl border transition-all",
        styles.container,
        className
      )}
      {...props}
    >
      <div className="shrink-0 mt-0.5">{icon || defaultIcon()}</div>

      <div className="flex-1 min-w-0 text-right">
        {title && <h5 className={cn("text-xs md:text-sm font-bold leading-5", styles.title)}>{title}</h5>}
        {description && <p className="text-xs leading-relaxed text-slate-700 mt-0.5">{description}</p>}
        {children && <div className="mt-1 text-xs">{children}</div>}
        {actions && <div className="mt-3 flex items-center gap-2">{actions}</div>}
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors"
          aria-label="إغلاق التنبيه"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
