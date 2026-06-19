import { Outlet } from "react-router-dom";
import { 
  Shield, 
  Activity, 
  Clock, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  ArrowUpRight 
} from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-[#060913] selection:bg-indigo-500/30 text-slate-100 font-sans overflow-x-hidden">
      
      {/* Left Form Panel: 5 cols on lg */}
      <div className="lg:col-span-5 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 lg:p-12 xl:p-16 relative min-h-screen bg-[#090d16] border-r border-slate-900 shadow-[4px_0_24px_rgba(0,0,0,0.3)]">
        {/* Atmosphere ambient glows */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-[12%] left-[10%] w-64 h-64 bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[12%] right-[10%] w-64 h-64 bg-emerald-600/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="w-full max-w-sm z-10 space-y-6">
          <Outlet />
        </div>
      </div>

      {/* Right Product Workspace Mockup Panel: 7 cols on lg */}
      <div className="hidden lg:col-span-7 lg:flex flex-col justify-between bg-[#060913] p-12 xl:p-16 relative overflow-hidden">
        {/* Modern dark micro-dot layout */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
        <div className="absolute -top-[10%] -left-[10%] w-[550px] h-[550px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 font-mono">
              Secure Delivery Hub // Compliance Engine Active
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            V2.5 // PRODUCTION STACK
          </span>
        </div>

        {/* Hero Description & Product Mock */}
        <div className="relative z-10 my-auto xl:max-w-2xl mx-auto w-full space-y-8 pt-8">
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              <Sparkles size={12} className="text-indigo-400" />
              <span>Project Delivery Governance</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight">
              Design, build, and ship with code compliance built-in.
            </h2>
            <p className="text-slate-400 text-sm xl:text-base leading-relaxed">
              SecureFlow aligns every step of your project delivery with pristine SDLC compliance guidelines. Run silent verification checks, record immutable logs, and deploy with confidence.
            </p>
          </div>

          {/* Interactive Workspace Mockup Box */}
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col backdrop-blur-md">
            {/* Window bar controls */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#0d1323]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-800" />
                <span className="w-3 h-3 rounded-full bg-slate-800" />
                <span className="w-3 h-3 rounded-full bg-slate-800" />
                <span className="text-xs text-slate-500 font-medium ml-2 font-mono">sec-app.workspace.secureflow</span>
              </div>
              <span className="text-[11px] font-mono bg-indigo-950/60 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md font-bold">
                98.4% SECURE
              </span>
            </div>

            {/* Mock Dashboard Body */}
            <div className="p-6 grid grid-cols-12 gap-5">
              {/* Compliance Ring Indicator Left (4 cols) */}
              <div className="col-span-4 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between space-y-4 bg-[#0d1323]/50">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">COMPLIANCE INDEX</span>
                  <div className="mt-2.5 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-white">98.4%</span>
                    <span className="text-xs text-emerald-400 font-semibold">+1.2%</span>
                  </div>
                </div>

                {/* Secure Progress bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full w-[98.4%]" />
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium block">
                    All compliance gates green
                  </span>
                </div>
              </div>

              {/* Release Pipeline Right (8 cols) */}
              <div className="col-span-8 border border-slate-800/80 rounded-xl p-4 space-y-3.5 bg-[#0d1323]/20">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800/50">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ACTIVE PIPELINE GATES</span>
                  <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
                    Manage Board <ArrowUpRight size={10} />
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span className="text-xs font-semibold text-slate-300">Code Scanner Integration</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      VERIFIED
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span className="text-xs font-semibold text-slate-300">Dependency Check (OWASP)</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      VERIFIED
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      </div>
                      <span className="text-xs font-semibold text-slate-300">Audit Sign-off Required</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-indigo-400 bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-500/20">
                      PENDING
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Project Statistics Table (12 cols) */}
              <div className="col-span-12 border border-slate-800/80 rounded-xl p-4 bg-[#0d1323]/40">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">PROJECT INTEGRITY RELEASES</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                    <Clock size={10} />
                    <span>Sync 4m ago</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 pt-2">
                  <div className="p-3 bg-[#0a0d17] border border-slate-800/60 rounded-lg flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-200">ledger-gateway</span>
                      <span className="text-[10px] text-slate-500 block font-mono">v1.24.0 // main</span>
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] font-bold text-emerald-400 whitespace-nowrap">
                      <ShieldCheck size={11} className="text-emerald-400" />
                      <span>SECURE</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0a0d17] border border-slate-800/60 rounded-lg flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-200">auth-reconciler</span>
                      <span className="text-[10px] text-slate-500 block font-mono">v2.1.0-beta // dev</span>
                    </div>
                    <div className="flex items-center gap-1 bg-indigo-950/40 border border-indigo-500/20 px-2 py-0.5 rounded-full text-[9px] font-bold text-indigo-400 whitespace-nowrap">
                      <Activity size={11} className="text-indigo-400 animate-pulse" />
                      <span>SCANNING</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info: simple, clean, minimalist */}
        <div className="relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-2">
            <Shield size={14} className="text-indigo-500" />
            ISO 27001 & SOC-2 Compliant
          </span>
          <span>© SecureFlow Inc. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}
