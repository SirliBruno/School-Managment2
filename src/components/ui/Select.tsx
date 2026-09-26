"use client";

import React, { forwardRef } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, id, disabled, children, ...props }, ref) => {
    const selectId = id || (label ? label.replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full text-right" dir="rtl">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full h-11 pr-3.5 pl-10 rounded-xl border bg-white text-sm text-slate-900 appearance-none transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-offset-1",
              error
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                : "border-slate-300 focus:border-teal-600 focus:ring-teal-100",
              disabled && "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed",
              className
            )}
            {...props}
          >
            {children ||
              options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
