"use client";

import React, { forwardRef } from "react";
import { Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showQuickPresets?: boolean;
  onPresetSelect?: (dateStr: string) => void;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      showQuickPresets = false,
      onPresetSelect,
      id,
      disabled,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.replace(/\s+/g, "-") : undefined);

    const setToday = () => {
      const today = new Date().toISOString().split("T")[0];
      if (onPresetSelect) onPresetSelect(today);
    };

    const setYesterday = () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const yesterday = d.toISOString().split("T")[0];
      if (onPresetSelect) onPresetSelect(yesterday);
    };

    return (
      <div className="w-full text-right" dir="rtl">
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700">
              {label}
            </label>
          )}
          {showQuickPresets && !disabled && (
            <div className="flex items-center gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={setToday}
                className="text-teal-600 hover:text-teal-800 font-semibold px-1.5 py-0.5 rounded hover:bg-teal-50 transition-colors"
              >
                اليوم
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={setYesterday}
                className="text-slate-500 hover:text-slate-700 font-medium px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors"
              >
                أمس
              </button>
            </div>
          )}
        </div>

        <div className="relative flex items-center">
          <input
            id={inputId}
            ref={ref}
            type="date"
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={cn(
              "w-full h-11 pr-10 pl-3.5 rounded-xl border bg-white text-sm text-slate-900 transition-colors font-cairo",
              "focus:outline-none focus:ring-2 focus:ring-offset-1",
              error
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                : "border-slate-300 focus:border-teal-600 focus:ring-teal-100",
              disabled && "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed",
              className
            )}
            {...props}
          />
          <div className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center">
            <Calendar className="w-4 h-4" />
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

DatePicker.displayName = "DatePicker";
