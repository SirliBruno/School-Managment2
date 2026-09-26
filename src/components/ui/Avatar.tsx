import React from "react";
import { cn } from "@/utils/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "busy" | "away" | "offline";
}

const sizeStyles = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-14 h-14 text-lg",
};

const statusColors = {
  online: "bg-emerald-500",
  busy: "bg-rose-500",
  away: "bg-amber-500",
  offline: "bg-slate-400",
};

export function Avatar({
  name,
  src,
  size = "md",
  status,
  className,
  ...props
}: AvatarProps) {
  const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2);
    return `${parts[0][0] || ""}${parts[1][0] || ""}`;
  };

  return (
    <div className={cn("relative inline-block select-none shrink-0", className)} {...props}>
      <div
        className={cn(
          "rounded-2xl flex items-center justify-center font-bold bg-teal-600 text-white overflow-hidden shadow-xs",
          sizeStyles[size]
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white",
            statusColors[status]
          )}
          aria-label={`الحالة: ${status}`}
        />
      )}
    </div>
  );
}
