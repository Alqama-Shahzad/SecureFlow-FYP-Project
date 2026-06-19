import React from "react";
import { AlertTriangle, ShieldX, Ghost, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  title?: string;
}

export function ErrorState({ message, onRetry, title = "System Node Pipeline Off-line" }: ErrorStateProps) {
  return (
    <div className="py-10 px-6 text-center bg-[#0d0c12]/80 border border-rose-900/30 rounded-2xl max-w-xl mx-auto space-y-4 shadow-xl">
      <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/15 shadow-[0_0_15px_rgba(244,63,94,0.15)] animate-pulse">
        <ShieldX size={32} />
      </div>
      <div>
        <h2 className="text-sm font-extrabold text-white font-mono uppercase tracking-widest">{title}</h2>
        <p className="mt-1.5 text-xs text-rose-455 font-mono max-w-md mx-auto leading-relaxed uppercase">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-950/20 border border-rose-500/15 hover:border-rose-500 hover:bg-rose-955 text-rose-300 hover:text-white text-xs font-mono font-bold cursor-pointer transition-all uppercase"
        >
          <RefreshCw size={12} />
          RETRY TRANSACTION CONNECTION
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  onReset?: () => void;
}

export function EmptyState({ title, description, onReset }: EmptyStateProps) {
  return (
    <div className="py-16 px-6 text-center border-2 border-dashed border-slate-900 rounded-3xl max-w-md mx-auto">
      <div className="inline-flex p-3.5 rounded-2xl bg-slate-950 text-slate-500 border border-slate-900 mb-4">
        <Ghost size={24} />
      </div>
      <h3 className="text-xs text-white uppercase font-black tracking-wider leading-none font-mono">
        {title}
      </h3>
      <p className="mt-1.5 text-xs text-slate-500 leading-normal max-w-xs mx-auto font-sans font-medium">
        {description}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-4 px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950 text-xs font-mono text-slate-400 hover:text-white transition-all cursor-pointer font-bold"
        >
          RESET APPLIED PARAMETERS
        </button>
      )}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center bg-slate-950/20 p-5 rounded-2xl border border-slate-900">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-slate-800 rounded"></div>
          <div className="h-6 w-56 bg-slate-800 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-slate-800 rounded-xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4 bg-slate-950/20 p-6 rounded-2xl border border-slate-900">
          <div className="h-6 w-32 bg-slate-800 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><div className="h-3 w-16 bg-slate-800 rounded"></div><div className="h-5 w-32 bg-slate-800 rounded"></div></div>
            <div className="space-y-1"><div className="h-3 w-16 bg-slate-800 rounded"></div><div className="h-5 w-32 bg-slate-800 rounded"></div></div>
            <div className="space-y-1"><div className="h-3 w-16 bg-slate-800 rounded"></div><div className="h-5 w-32 bg-slate-800 rounded"></div></div>
            <div className="space-y-1"><div className="h-3 w-16 bg-slate-800 rounded"></div><div className="h-5 w-32 bg-slate-800 rounded"></div></div>
          </div>
        </div>

        <div className="space-y-4 h-[300px] bg-slate-950/20 p-6 rounded-2xl border border-slate-900">
          <div className="h-6 w-24 bg-slate-800 rounded"></div>
          <div className="h-16 w-full bg-slate-800 rounded-xl"></div>
          <div className="h-16 w-full bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
