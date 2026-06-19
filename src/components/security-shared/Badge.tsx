import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  className?: string;
}

export function SeverityBadge({ label, className }: BadgeProps) {
  const normalized = label.toLowerCase();
  
  let styles = "bg-slate-900 border-slate-800 text-slate-400";
  if (normalized === "low") {
    styles = "bg-blue-950/40 border-blue-500/20 text-blue-400";
  } else if (normalized === "medium") {
    styles = "bg-amber-950/40 border-amber-500/20 text-amber-400";
  } else if (normalized === "high") {
    styles = "bg-orange-950/40 border-orange-500/20 text-orange-400";
  } else if (normalized === "critical") {
    styles = "bg-red-950/50 border-red-500/30 text-red-400 animate-pulse-subtle";
  }

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-md border",
      styles,
      className
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", 
        normalized === "low" ? "bg-blue-400" :
        normalized === "medium" ? "bg-amber-400" :
        normalized === "high" ? "bg-orange-400" : "bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
      )} />
      {label}
    </span>
  );
}

export function StatusBadge({ label, className }: BadgeProps) {
  const normalized = label.toLowerCase();
  
  let styles = "bg-slate-900 border-slate-800 text-slate-400";
  if (normalized === "new") {
    styles = "bg-sky-950/40 border-sky-500/20 text-sky-400";
  } else if (normalized === "investigating") {
    styles = "bg-indigo-950/40 border-indigo-500/25 text-indigo-400";
  } else if (normalized === "resolved") {
    styles = "bg-emerald-950/40 border-emerald-500/20 text-emerald-400";
  } else if (normalized === "ignored") {
    styles = "bg-slate-950/50 border-slate-800 text-slate-500";
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 text-xs font-mono font-medium rounded-full border",
      styles,
      className
    )}>
      {label}
    </span>
  );
}

export function CategoryBadge({ label, className }: BadgeProps) {
  const normalized = label.toLowerCase();

  let styles = "bg-slate-950 border-slate-900 text-slate-400";
  if (normalized === "security") {
    styles = "bg-red-950/25 border-red-900/30 text-red-300";
  } else if (normalized === "project") {
    styles = "bg-blue-950/25 border-blue-900/30 text-blue-300";
  } else if (normalized === "task") {
    styles = "bg-purple-950/25 border-purple-900/30 text-purple-300";
  } else if (normalized === "system") {
    styles = "bg-amber-950/25 border-amber-900/30 text-amber-300";
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 text-xs font-mono rounded-md border",
      styles,
      className
    )}>
      {label}
    </span>
  );
}
