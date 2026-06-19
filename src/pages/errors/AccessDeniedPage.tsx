import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Mail, Lock, ShieldQuestion, HelpCircle } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

export default function AccessDeniedPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const diagnosticLogs = {
    timestamp: new Date().toISOString(),
    routePath: window.location.pathname,
    exceptionGuid: "SEC-ERR-" + Math.floor(1000 + Math.random() * 9000),
    activeRole: user?.role || "Anonymous",
    requiredRole: "Admin",
    subnetIp: "10.10.45.19"
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-slate-350 font-sans">
      
      <div className="max-w-xl w-full text-center space-y-8 animate-fade-in">
        
        {/* Animated Visual Shield Lock */}
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-rose-500 rounded-full blur opacity-15 animate-pulse-subtle" />
          <div className="relative h-20 w-20 rounded-full bg-rose-950/40 border border-rose-500/35 flex items-center justify-center mx-auto text-rose-450 z-10">
            <Lock className="h-9 w-9 text-rose-500" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-650 border border-red-500 flex items-center justify-center text-[10px] text-slate-100 font-bold z-20">
            403
          </span>
        </div>

        {/* Text descriptions */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
            Access Denied / Vault Insufficient Clearance
          </h1>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-md mx-auto">
            Your authenticated access level <span className="font-mono text-rose-400 font-bold px-1.5 py-0.5 rounded bg-rose-950/20">{user?.role || "GUEST"}</span> is restricted from querying this segment. Contact a secure group administrator to authorize profile elevation.
          </p>
        </div>

        {/* 1. DIAGNOSTICS LOG DATA (Anti-lumping style but with realistic diagnostic details) */}
        <div className="border border-slate-910 bg-[#060a11]/60 rounded-2xl p-4.5 text-left space-y-3 max-w-md mx-auto font-mono text-[10.5px]">
          <div className="flex justify-between items-center text-slate-500 border-b border-slate-900 pb-2 mb-2">
            <span>DIAGNOSTIC TELEMETRY REPORT</span>
            <span className="text-rose-400 font-bold">MUT_RESTRICT_FAIL</span>
          </div>

          <div className="grid grid-cols-3 gap-y-1.5 text-slate-450">
            <span className="text-slate-500 uppercase">Timestamp:</span>
            <span className="col-span-2 text-slate-300 font-semibold">{diagnosticLogs.timestamp}</span>

            <span className="text-slate-500 uppercase">Target Node:</span>
            <span className="col-span-2 text-slate-200">{diagnosticLogs.routePath}</span>

            <span className="text-slate-500 uppercase">Fault ID:</span>
            <span className="col-span-2 text-rose-300 font-semibold">{diagnosticLogs.exceptionGuid}</span>

            <span className="text-slate-500 uppercase">Clearance Check:</span>
            <span className="col-span-2 text-slate-400">ROLE_REQUIRED: {diagnosticLogs.requiredRole}</span>
          </div>
        </div>

        {/* 2. SPECIFIC DISPATCH CHANNELS ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto text-xs pt-2">
          
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 p-3.5 border border-slate-905 bg-slate-950/30 hover:bg-slate-950 hover:border-slate-805 rounded-xl transition text-slate-300 font-semibold cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back One Hop
          </button>

          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 p-3.5 border border-slate-905 bg-slate-950/30 hover:bg-[#03070d]/60 hover:border-indigo-900 rounded-xl transition text-indigo-400 font-semibold"
          >
            Return to Dashboard
          </Link>

          <a
            href="mailto:secops@secureflow.app?subject=Access%20Elevation%20Request%20%5B403%5D"
            className="flex items-center justify-center gap-2 p-3.5 border border-slate-905 bg-slate-950/30 hover:bg-slate-950 rounded-xl transition text-slate-400 hover:text-slate-250 sm:col-span-2"
          >
            <Mail className="h-4 w-4 text-slate-500" /> Ping Security Response Center (SOC)
          </a>

        </div>

      </div>

    </div>
  );
}
