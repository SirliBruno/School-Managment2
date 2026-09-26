"use client";

import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, disabled, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full text-right" dir="rtl">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={cn(
            "w-full p-3 rounded-xl border bg-white text-sm text-slate-900 transition-colors resize-y",
            "placeholder:text-slate-400",
            "focus:outline-none focus:ring-2 focus:ring-offset-1",
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
              : "border-slate-300 focus:border-teal-600 focus:ring-teal-100",
            disabled && "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed",
            className
          )}
          {...props}
        />
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

Textarea.displayName = "Textarea";
