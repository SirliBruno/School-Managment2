"use client";

import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, disabled, ...props }, ref) => {
    const inputId = id || (label ? label.replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full text-right" dir="rtl">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full h-11 px-3.5 rounded-xl border bg-white text-sm text-slate-900 transition-colors",
              "placeholder:text-slate-400",
              "focus:outline-none focus:ring-2 focus:ring-offset-1",
              error
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                : "border-slate-300 focus:border-teal-600 focus:ring-teal-100",
              disabled && "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed",
              leftIcon && "pr-10",
              rightIcon && "pl-10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
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

Input.displayName = "Input";
