import React from "react";
import { AlertTriangle, ShieldCheck, HelpCircle, ShieldAlert, Zap } from "lucide-react";
import { SeverityType, HashStatus } from "../../types/audit-log";

interface SeverityBadgeProps {
  severity: SeverityType;
  showIcon?: boolean;
}

export function SeverityBadge({ severity, showIcon = true }: SeverityBadgeProps) {
  let styles = "";
  let Icon = HelpCircle;

  switch (severity) {
    case "Critical":
      styles = "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse";
      Icon = Zap;
      break;
    case "High":
      styles = "bg-amber-500/10 text-amber-400 border-amber-500/20";
      Icon = ShieldAlert;
      break;
    case "Medium":
      styles = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      Icon = AlertTriangle;
      break;
    case "Low":
    default:
      styles = "bg-slate-500/10 text-slate-400 border-slate-500/20";
      Icon = ShieldCheck;
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold tracking-wider uppercase ${styles}`}>
      {showIcon && <Icon size={11} className="shrink-0" />}
      {severity}
    </span>
  );
}

interface HashStatusBadgeProps {
  status: HashStatus;
  className?: string;
}

export function HashStatusBadge({ status, className = "" }: HashStatusBadgeProps) {
  let styles = "";
  let iconText = "";

  switch (status) {
    case "Verified":
      styles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/15 shadow-[0_0_12px_rgba(16,185,129,0.08)]";
      iconText = "● SECURED & VERIFIED";
      break;
    case "Tampered":
      styles = "bg-rose-500/10 text-rose-450 border-rose-500/15 font-black text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)] animate-bounce";
      iconText = "▲ BLOCK MISMATCH - TAMPERED";
      break;
    case "Pending":
    default:
      styles = "bg-amber-500/10 text-amber-400 border-amber-500/15";
      iconText = "○ UNVERIFIED / PENDING";
      break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] font-mono font-extrabold tracking-widest ${styles} ${className}`}>
      {iconText}
    </span>
  );
}
