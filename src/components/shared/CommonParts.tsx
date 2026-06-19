import React from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Folder, 
  Play, 
  XOctagon, 
  HelpCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Status Badge Component
export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let bg = "bg-slate-900 border-slate-800 text-slate-400";
  let dot = "bg-slate-500";
  let icon = <Clock size={11} className="shrink-0" />;

  const norm = status.toLowerCase().replace(/_/g, " ").trim();

  if (norm === "planning" || norm === "todo" || norm === "backlog") {
    bg = "bg-indigo-950/40 border-indigo-500/15 text-indigo-400";
    dot = "bg-indigo-400 shadow-[0_0_8px_#818cf8]";
    icon = <Clock size={11} className="shrink-0" />;
  } else if (norm === "active" || norm === "in progress") {
    bg = "bg-blue-950/40 border-blue-500/20 text-blue-400";
    dot = "bg-blue-400 shadow-[0_0_8px_#60a5fa]";
    icon = <Play size={11} className="shrink-0" />;
  } else if (norm === "on hold" || norm === "review" || norm === "in review") {
    bg = "bg-amber-950/40 border-amber-500/20 text-amber-400";
    dot = "bg-amber-400 shadow-[0_0_8px_#fbbf24]";
    icon = <AlertTriangle size={11} className="shrink-0" />;
  } else if (norm === "completed" || norm === "done" || norm === "completed projects") {
    bg = "bg-emerald-950/40 border-emerald-500/20 text-emerald-400";
    dot = "bg-emerald-400 shadow-[0_0_8px_#34d399]";
    icon = <CheckCircle2 size={11} className="shrink-0" />;
  } else if (norm === "cancelled" || norm === "delayed" || norm === "critical projects") {
    bg = "bg-rose-950/40 border-rose-500/20 text-rose-400";
    dot = "bg-rose-400 shadow-[0_0_8px_#f43f5e]";
    icon = <XOctagon size={11} className="shrink-0" />;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono leading-none tracking-wider uppercase font-extrabold select-none shrink-0",
        bg,
        className
      )}
    >
      <span className={cn("w-1 h-1 rounded-full", dot)} />
      {icon}
      <span>{status.replace(/_/g, " ")}</span>
    </span>
  );
}

// Priority Badge Component
export interface PriorityBadgeProps {
  priority: "Low" | "Medium" | "High" | "Critical" | string;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  let text = "text-slate-400 bg-slate-900 border-slate-800";
  let level = "LOW";

  const norm = priority.toLowerCase().trim();

  if (norm === "medium") {
    text = "text-blue-400 bg-blue-950/20 border-blue-500/10";
    level = "MEDIUM";
  } else if (norm === "high") {
    text = "text-amber-400 bg-amber-950/25 border-amber-500/15";
    level = "HIGH";
  } else if (norm === "critical") {
    text = "text-rose-400 bg-rose-950/30 border-rose-500/20 shadow-sm shadow-rose-950/20";
    level = "CRITICAL";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest uppercase border leading-none shrink-0",
        text,
        className
      )}
    >
      ⚠️ {level}
    </span>
  );
}

// Progress Bar Component
export interface ProgressBarProps {
  value: number;
  className?: string;
  showText?: boolean;
}

export function ProgressBar({ value, className, showText = false }: ProgressBarProps) {
  const percentage = Math.min(Math.max(Math.round(value), 0), 100);

  // Gradient selection by progress range
  let barColor = "bg-indigo-500";
  if (percentage >= 100) {
    barColor = "bg-gradient-to-r from-emerald-500 to-teal-400";
  } else if (percentage >= 70) {
    barColor = "bg-gradient-to-r from-indigo-500 to-blue-400";
  } else if (percentage >= 35) {
    barColor = "bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500";
  } else {
    barColor = "bg-gradient-to-r from-indigo-600 to-rose-500";
  }

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-450">
        {showText && <span className="font-bold">COMPLIANCE COMPLETION</span>}
        {showText && <span className="font-extrabold text-slate-200">{percentage}%</span>}
      </div>
      <div className="w-full bg-[#03060c] border border-slate-900 rounded-full h-2.5 overflow-hidden p-[1px]">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Empty State Component
export interface EmptyStateProps {
  title: string;
  description: string;
  onClear?: () => void;
  clearLabel?: string;
}

export function EmptyState({ title, description, onClear, clearLabel = "Reset Filters" }: EmptyStateProps) {
  return (
    <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-12 text-center shadow-xl backdrop-blur-md">
      <Folder className="w-12 h-12 text-slate-700 mx-auto mb-4" />
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
        {title}
      </h3>
      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 font-sans leading-relaxed">
        {description}
      </p>
      {onClear && (
        <button
          onClick={onClear}
          className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-mono font-extrabold shadow-md hover:shadow-lg transition-all"
        >
          {clearLabel}
        </button>
      )}
    </div>
  );
}

// Loading Skeleton Component
export function LoadingSkeleton({ cardsCount = 3 }: { cardsCount?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: cardsCount }).map((_, i) => (
        <div
          key={i}
          className="h-60 bg-[#090e1a]/50 border border-slate-850 rounded-2xl animate-pulse p-6 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="h-5 bg-slate-800 rounded w-16" />
              <div className="h-4 bg-slate-800 rounded w-28" />
            </div>
            <div className="h-7 bg-slate-800 rounded w-full" />
            <div className="h-10 bg-slate-800 rounded w-4/5" />
          </div>
          <div className="flex gap-2.5 pt-4">
            <div className="h-8 bg-slate-800 rounded w-1/2" />
            <div className="h-8 bg-slate-800 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
