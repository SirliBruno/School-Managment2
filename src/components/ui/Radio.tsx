"use client";

import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, id, disabled, checked, defaultChecked, ...props }, ref) => {
    const radioId = id || (label ? label.replace(/\s+/g, "-") : undefined);

    return (
      <label
        htmlFor={radioId}
        dir="rtl"
        className={cn(
          "inline-flex items-start gap-3 cursor-pointer select-none",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={radioId}
            ref={ref}
            type="radio"
            disabled={disabled}
            checked={checked}
            defaultChecked={defaultChecked}
            className="peer sr-only"
            {...props}
          />
          <div className="w-5 h-5 rounded-full border border-slate-300 bg-white transition-all peer-checked:border-teal-600 peer-focus:ring-2 peer-focus:ring-teal-200 peer-disabled:bg-slate-100 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-600 opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>
        {(label || description) && (
          <div className="text-right">
            {label && <span className="text-sm font-semibold text-slate-800">{label}</span>}
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Radio.displayName = "Radio";
