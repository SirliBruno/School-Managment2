"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronsUpDown, Search, X, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface ComboboxProps {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options: ComboboxOption[];
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
  className?: string;
}

export function Combobox({
  label,
  error,
  helperText,
  placeholder = "ابحث أو اختر...",
  options,
  value,
  onChange,
  disabled = false,
  className,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const comboboxId = useId();

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opt.description && opt.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelect = (val: string) => {
    onChange?.(val);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
    setSearchQuery("");
  };

  return (
    <div ref={containerRef} className={cn("w-full text-right relative", className)} dir="rtl">
      {label && (
        <label htmlFor={comboboxId} className="block text-xs font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <div
        id={comboboxId}
        role="combobox"
        aria-controls={`${comboboxId}-listbox`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled) setIsOpen((prev) => !prev);
          }
        }}
        className={cn(
          "w-full h-11 px-3.5 rounded-xl border bg-white text-sm text-slate-900 flex items-center justify-between cursor-pointer transition-colors select-none",
          "focus:outline-none focus:ring-2 focus:ring-offset-1",
          error
            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
            : "border-slate-300 focus:border-teal-600 focus:ring-teal-100",
          disabled && "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-slate-400")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="flex items-center gap-1 text-slate-400">
          {selectedOption && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:text-slate-600 rounded-md"
              aria-label="مسح الاختيار"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronsUpDown className="w-4 h-4 shrink-0" />
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1.5 w-full rounded-2xl bg-white border border-slate-200 p-2 shadow-xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                placeholder="اكتب للبحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pr-9 pl-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-teal-600 transition-colors"
              />
            </div>

            {/* Listbox */}
            <ul id={`${comboboxId}-listbox`} className="max-h-56 overflow-y-auto space-y-0.5 text-xs" role="listbox">
              {filteredOptions.length === 0 ? (
                <li className="py-4 text-center text-slate-400 text-xs">
                  لا توجد نتائج مطابقة
                </li>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(opt.value)}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors",
                        isSelected
                          ? "bg-teal-50 text-teal-800 font-bold"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <div className="flex flex-col">
                        <span>{opt.label}</span>
                        {opt.description && (
                          <span className="text-[11px] text-slate-400 font-normal">{opt.description}</span>
                        )}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

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
