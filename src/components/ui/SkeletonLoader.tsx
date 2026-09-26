import React from "react";
import { cn } from "@/utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangular" | "circular" | "text";
}

export function SkeletonLoader({
  className,
  variant = "rectangular",
  ...props
}: SkeletonProps) {
  const variantStyles = {
    rectangular: "rounded-xl",
    circular: "rounded-full",
    text: "h-4 rounded-md",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200/80",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-3 p-4 bg-white rounded-2xl border border-slate-200">
      <SkeletonLoader className="h-10 w-full rounded-xl bg-slate-100" />
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex gap-4">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <SkeletonLoader key={cIdx} className="h-8 flex-1 rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
}
