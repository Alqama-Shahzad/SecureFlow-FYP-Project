import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowLeft, Home, HelpCircle, Activity, ShieldAlert, FolderKey } from "lucide-react";

export default function NotFoundPage() {
  const currentPath = window.location.pathname;

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-slate-350 font-sans relative overflow-hidden">
      
      {/* Structural background lines to simulate a coordinate radar sweep */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.02)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-dashed border-indigo-950/20 rounded-full animate-spin [animation-duration:30s] pointer-events-none" />

      <div className="max-w-xl w-full text-center space-y-8 animate-fade-in relative z-10">
        
        {/* Radar Icon framing */}
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-indigo-505 rounded-full blur opacity-15 animate-ping [animation-duration:3s]" />
          <div className="relative h-20 w-20 rounded-full bg-indigo-950/40 border border-indigo-505/20 flex items-center justify-center mx-auto text-indigo-400 z-10">
            <Compass className="h-9 w-9 text-indigo-400 animate-pulse-subtle" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-650 border border-indigo-500 flex items-center justify-center text-[10px] text-slate-100 font-bold z-20">
            404
          </span>
        </div>

        {/* Header descriptions */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
            Resource Mapping Offline / 404
          </h1>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-md mx-auto">
            The requested routing route <span className="font-mono text-indigo-455 font-semibold px-2 py-0.5 rounded bg-indigo-950/30">{currentPath}</span> is not mapped inside the platform registry databases.
          </p>
        </div>

        {/* Suggested resource index */}
        <div className="border border-slate-910 bg-[#060a11]/40 rounded-2xl p-5 text-left max-w-md mx-auto space-y-3.5">
          <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest block pb-1 border-b border-indigo-950/40">Suggested Hub Entries</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
            <Link 
              to="/dashboard"
              className="p-3 bg-slate-950/45 hover:bg-slate-950 border border-slate-910 rounded-xl transition text-slate-205 hover:text-slate-100 flex items-center gap-2"
            >
              <Home className="h-4 w-4 text-emerald-400" />
              <span>Main Dashboard</span>
            </Link>

            <Link 
              to="/audit-logs"
              className="p-3 bg-slate-950/45 hover:bg-slate-950 border border-slate-910 rounded-xl transition text-slate-205 hover:text-slate-100 flex items-center gap-2"
            >
              <Activity className="h-4 w-4 text-indigo-400" />
              <span>Audit logs Ledger</span>
            </Link>

            <Link 
              to="/security/ids"
              className="p-3 bg-slate-950/45 hover:bg-slate-950 border border-slate-910 rounded-xl transition text-slate-205 hover:text-slate-100 flex items-center gap-2"
            >
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              <span>SOC IDS Monitor</span>
            </Link>

            <Link 
              to="/projects"
              className="p-3 bg-slate-950/45 hover:bg-slate-950 border border-slate-910 rounded-xl transition text-slate-205 hover:text-slate-100 flex items-center gap-2"
            >
              <FolderKey className="h-4 w-4 text-amber-400" />
              <span>Authorized Projects</span>
            </Link>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center items-center text-xs">
          <button
            onClick={() => window.history.back()}
            className="px-5 py-2.5 border border-slate-900 hover:border-slate-805 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-lg font-semibold transition flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Retreat One Hop
          </button>
        </div>

      </div>

    </div>
  );
}
