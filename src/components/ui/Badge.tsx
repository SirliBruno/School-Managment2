import React from "react";
import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "warning" | "danger" | "neutral" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

const variantStyles = {
  primary: "bg-teal-50 text-teal-700 border-teal-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
  outline: "bg-transparent text-slate-700 border-slate-300",
};

const dotColors = {
  primary: "bg-teal-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  neutral: "bg-slate-400",
  outline: "bg-slate-400",
};

export function Badge({
  className,
  variant = "primary",
  size = "md",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      dir="rtl"
      className={cn(
        "inline-flex items-center gap-1.5 font-bold border rounded-full select-none",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])} />}
      <span>{children}</span>
    </span>
  );
}
