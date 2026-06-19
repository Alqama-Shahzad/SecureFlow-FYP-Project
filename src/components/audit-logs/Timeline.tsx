import React from "react";
import { Clock, ShieldCheck, Terminal, AlertTriangle, User, GitCommit } from "lucide-react";
import { AuditEvent } from "../../types/audit-log";

interface EventTimelineProps {
  timeline: AuditEvent[];
}

export function EventTimeline({ timeline }: EventTimelineProps) {
  
  const getTimelineIcon = (type: "system" | "security" | "user" | "verification", status: string) => {
    switch (type) {
      case "security":
        return <ShieldCheck size={14} className={status === "failure" ? "text-rose-450 animate-pulse" : "text-emerald-400"} />;
      case "verification":
        return <Terminal size={14} className={status === "failure" ? "text-rose-450 animate-pulse animate-bounce" : "text-indigo-400"} />;
      case "user":
        return <User size={14} className="text-amber-400" />;
      case "system":
      default:
        return <Clock size={14} className="text-slate-400" />;
    }
  };

  const getTimelineBadgeStyle = (status: "success" | "warning" | "failure") => {
    switch (status) {
      case "failure":
        return "bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]";
      case "warning":
        return "bg-amber-500/10 border-amber-500/20 text-amber-405";
      case "success":
      default:
        return "bg-[#0c1825] border-slate-850 text-indigo-400";
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[14px] before:w-0.5 before:bg-slate-900 before:border-r before:border-dashed before:border-slate-850">
      {timeline.map((event, idx) => {
        const isLast = idx === timeline.length - 1;
        const formattedDate = new Date(event.timestamp).toLocaleString();
        
        return (
          <div key={event.id} className="relative group/timeline">
            
            {/* Circle Node Indicator */}
            <div className={`absolute -left-[28px] top-1.5 p-1.5 rounded-xl border z-10 transition-transform group-hover/timeline:scale-110 flex items-center justify-center ${getTimelineBadgeStyle(event.status)}`}>
              {getTimelineIcon(event.type, event.status)}
            </div>

            {/* Event Block Card */}
            <div className="bg-[#090e1a]/60 border border-slate-900 rounded-2xl p-4 transition-all hover:border-slate-850 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <span className="font-sans font-black text-xs text-white uppercase tracking-wider">
                  {event.name}
                </span>
                <span className="font-mono text-[10px] text-slate-500 font-bold block shrink-0">
                  {formattedDate}
                </span>
              </div>

              <p className="mt-1.5 text-[11px] font-mono leading-relaxed text-slate-400">
                {event.description}
              </p>

              <div className="mt-2.5 flex items-center gap-1 text-[9px] font-mono font-extrabold uppercase tracking-wider text-slate-500">
                <GitCommit size={11} className="text-slate-600 shrink-0" />
                DETERMINISTIC AGENT: <span className="text-slate-300 font-black">{event.operator}</span>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
