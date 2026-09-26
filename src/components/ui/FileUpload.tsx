"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, File, FileText, Image as ImageIcon, X, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

export interface FileUploadProps {
  label?: string;
  error?: string;
  helperText?: string;
  accept?: string;
  maxSizeMb?: number;
  value?: File | null;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  label,
  error,
  helperText,
  accept = "image/*,application/pdf",
  maxSizeMb = 10,
  value,
  onChange,
  disabled = false,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndSetFile = (file: File) => {
    setInternalError(null);
    if (file.size > maxSizeMb * 1024 * 1024) {
      setInternalError(`حجم الملف يتجاوز الحد الأقصى المسموح (${maxSizeMb} ميجابايت)`);
      return;
    }
    onChange?.(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} بايت`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ك.ب`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} م.ب`;
  };

  const displayError = error || internalError;

  return (
    <div className={cn("w-full text-right", className)} dir="rtl">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      {!value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={cn(
            "w-full p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all select-none",
            isDragging
              ? "border-teal-500 bg-teal-50/50"
              : "border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400",
            displayError && "border-rose-300 bg-rose-50/30",
            disabled && "opacity-60 cursor-not-allowed bg-slate-100"
          )}
        >
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-teal-600 mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-800">
            اسحبي وأفلتي المستند أو الصورة هنا، أو <span className="text-teal-600 underline">تصفحي الجهاز</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            الصيغ المدعومة: PDF, PNG, JPG حتى {maxSizeMb} ميجابايت
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              {value.type.includes("pdf") ? (
                <FileText className="w-5 h-5" />
              ) : value.type.includes("image") ? (
                <ImageIcon className="w-5 h-5" />
              ) : (
                <File className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0 text-right">
              <p className="text-xs font-bold text-slate-900 truncate">{value.name}</p>
              <p className="text-[10px] text-slate-400">{formatFileSize(value.size)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            aria-label="حذف الملف"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {displayError && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{displayError}</span>
        </p>
      )}
      {!displayError && helperText && (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
}
