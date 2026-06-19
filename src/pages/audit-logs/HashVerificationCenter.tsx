import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Boxes, 
  ArrowLeft, 
  Fingerprint, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  Activity, 
  TrendingUp, 
  Lock, 
  Trash2, 
  Zap, 
  ListOrdered,
  PlusCircle, 
  RefreshCw 
} from "lucide-react";
import { 
  useAuditLogs, 
  useHashVerification, 
  useVerificationHistory 
} from "../../hooks/use-audit-logs";
import { ChainVisualization } from "../../components/audit-logs/Visualization";
import { ErrorState } from "../../components/audit-logs/Skeletons";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";

export default function HashVerificationCenter() {
  const navigate = useNavigate();
  const [activeCycleTab, setActiveCycleTab] = useState<"history" | "tamper">("history");

  // Fetch chronological blocks (oldest first for chain timeline flow!)
  const { 
    data: logsData, 
    isLoading: logsLoading, 
    isError: logsError, 
    error: logsErr, 
    refetch: refetchLogs 
  } = useAuditLogs({ sort: "oldest" });

  const { 
    data: historyData, 
    isLoading: historyLoading, 
    refetch: refetchHistory 
  } = useVerificationHistory();

  const { 
    verifyChain, 
    isVerifyingChain, 
    tamperLog, 
    isTamperingLog, 
    restoreChain, 
    isRestoringChain 
  } = useHashVerification();

  // Audit state triggers
  const [auditTriggerMessage, setAuditTriggerMessage] = useState<string | null>(null);
  const [brokenBlockPointer, setBrokenBlockPointer] = useState<any>(null);

  // Compute stats based on logs array
  const blocks = logsData?.logs || [];
  const brokenBlock = useMemo(() => {
    return blocks.find(b => b.verificationStatus === "Tampered");
  }, [blocks]);

  const verifyStatusName = brokenBlock ? "Tampered" : "Valid";

  // Check running verifications
  const handleRunAudit = async () => {
    setAuditTriggerMessage(null);
    try {
      const res = await verifyChain();
      setBrokenBlockPointer(res.brokenBlockId ? res.mismatchDetails : null);
      if (res.status === "Tampered") {
        setAuditTriggerMessage(`Ledger chain integrity check complete. Cryptographic seal chain contains broken segments.`);
      } else {
        setAuditTriggerMessage(`Ledger chain check complete. 100% blocks verified against HSM registry.`);
      }
      refetchLogs();
      refetchHistory();
    } catch (err: any) {
      alert("Verification matrix failed.");
    }
  };

  const handleTamperBlockInSandbox = async (id: string, field: string, value: string) => {
    try {
      await tamperLog({ id, field, newValue: value });
      refetchLogs();
      setAuditTriggerMessage(`Sandbox threat injected. Block ${id} properties have been altered locally.`);
    } catch (err: any) {
      alert("Exploit simulator failure.");
    }
  };

  const handleRestorePristineLedger = async () => {
    try {
      await restoreChain();
      setBrokenBlockPointer(null);
      setAuditTriggerMessage("Ledger chain reconstructed. Original cryptographic seals compiled successfully.");
      refetchLogs();
      refetchHistory();
    } catch (err) {
      alert("Reconstruction failed.");
    }
  };

  // Recharts Dynamic Mock Analytics Datasets adapting on state!
  const analyticsData = useMemo(() => {
    // If there is currently a broken block, lower the score on Friday June 19!
    const activeIntegrityScore = brokenBlock ? 90.9 : 100;
    
    return {
      integrityScoreHistory: [
        { date: "06-13", score: 100 },
        { date: "06-14", score: 100 },
        { date: "06-15", score: 100 },
        { date: "06-16", score: 100 },
        { date: "06-17", score: 100 },
        { date: "06-18", score: 100 },
        { date: "06-19 (Today)", score: activeIntegrityScore }
      ],
      verificationTrend: [
        { hour: "08:00", durMs: 82 },
        { hour: "10:00", durMs: 75 },
        { hour: "12:00", durMs: 95 },
        { hour: "14:00", durMs: 88 },
        { hour: "16:00", durMs: 90 },
        { hour: "18:00", durMs: 110 },
        { hour: "20:00", durMs: 80 }
      ],
      tamperEvents: [
        { day: "Mon", attempts: 1, blocked: 1 },
        { day: "Tue", attempts: 0, blocked: 0 },
        { day: "Wed", attempts: 0, blocked: 0 },
        { day: "Thu", attempts: 4, blocked: 4 },
        { day: "Fri", attempts: brokenBlock ? 3 : 2, blocked: 2 }
      ]
    };
  }, [brokenBlock]);

  if (logsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
        <span className="font-mono text-xs text-slate-500 font-extrabold uppercase">CALIBRATING INTEGRITY CHRONO-RAD DIAGNOSTICS...</span>
      </div>
    );
  }

  if (logsError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorState message={logsErr?.message || "Verify Center initialization timeout."} onRetry={refetchLogs} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Floating Audit Status Toast */}
      {auditTriggerMessage && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-2xl border flex items-center gap-3 shadow-2xl z-50 max-w-md animate-fadeIn ${
          brokenBlock 
            ? "bg-rose-950 border-rose-500/30 text-rose-300 shadow-rose-900/10" 
            : "bg-[#061c16] border-emerald-555/35 text-emerald-400 shadow-emerald-950/10"
        }`}>
          {brokenBlock ? (
            <ShieldAlert className="w-5 h-5 shrink-0 animate-bounce text-rose-500" />
          ) : (
            <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
          )}
          <div className="font-mono text-xs font-black uppercase tracking-wide leading-normal">
            {auditTriggerMessage}
          </div>
        </div>
      )}

      {/* Header and Back Link */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/audit-logs")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-900 bg-slate-950/40 hover:bg-slate-950 hover:text-white transition-all text-slate-450 text-[10px] font-mono font-bold cursor-pointer mb-2 uppercase"
          >
            <ArrowLeft size={11} />
            BACK TO DASHBOARD
          </button>
          
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
              <Boxes size={16} />
            </span>
            <div className="text-[10px] font-extrabold uppercase tracking-widest font-mono text-indigo-400">
              LEDGER VERIFICATION COMMAND CENTER
            </div>
          </div>
          
          <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-1 font-sans">
            Hash Chain Verification Center
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Monitor the absolute continuous chronological compliance health of tamper-proof security auditing logs.
          </p>
        </div>
      </div>

      {/* LEDGER FLOW TIMELINE COMPONENT */}
      <ChainVisualization
        blocks={blocks}
        onTamper={handleTamperBlockInSandbox}
        onVerify={handleRunAudit}
        isVerifying={isVerifyingChain}
        brokenBlockId={brokenBlock?.id}
        onReset={handleRestorePristineLedger}
        isResetting={isRestoringChain}
      />

      {/* MID PANEL SECTION: RECENT VERIFICATIONS, ALERTS, & RAW TAMPER LOG PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Verification history actions & dynamic tamper notifications */}
        <div className="lg:col-span-2 bg-[#090e1a]/85 border border-[#141b2e] rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-950/60 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveCycleTab("history")}
                  className={`text-xs font-mono font-black tracking-widest uppercase transition-all py-1 cursor-pointer border-b-2 ${
                    activeCycleTab === "history" 
                      ? "border-indigo-500 text-white" 
                      : "border-transparent text-slate-505 hover:text-slate-350"
                  }`}
                >
                  RECONCILIATION RUNS
                </button>
                <span className="text-slate-700">|</span>
                <button
                  onClick={() => setActiveCycleTab("tamper")}
                  className={`text-xs font-mono font-black tracking-widest uppercase transition-all py-1 cursor-pointer border-b-2 ${
                    activeCycleTab === "tamper" 
                      ? "border-indigo-500 text-white" 
                      : "border-transparent text-slate-505 hover:text-slate-350"
                  }`}
                >
                  TAMPER DIAGNOSTIC (STAMP)
                </button>
              </div>

              <span className="text-[9px] text-indigo-400 font-mono font-bold tracking-widest uppercase">
                STATUS MONITOR
              </span>
            </div>

            {activeCycleTab === "history" ? (
              /* RECENT AUDIT CYCLES COMPONENT */
              <div className="divide-y divide-slate-950/40 divide-dashed pt-2 max-h-[280px] overflow-y-auto">
                {historyLoading ? (
                  <div className="h-20 flex items-center justify-center text-xs text-slate-650 font-mono animate-pulse uppercase">Syncing histories...</div>
                ) : (historyData || []).map((run) => (
                  <div key={run.id} className="py-2.5 flex items-start justify-between gap-4 font-mono text-[11px]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-white text-[11.5px] font-mono">{run.id}</span>
                        <span className="text-[10px] text-slate-500 font-medium">Verified by: {run.verifiedBy.split("@")[0]}</span>
                        <span className="text-[10px] text-slate-550">{new Date(run.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-500 leading-normal font-sans text-xs max-w-lg">{run.notes}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className={`px-2 py-0.5 rounded-full font-black text-[9px] border tracking-wider block uppercase ${
                        run.status === "Tampered" 
                          ? "bg-rose-500/10 border-rose-500/15 text-rose-455" 
                          : "bg-emerald-500/10 border-emerald-550/15 text-emerald-400"
                      }`}>
                        {run.status === "Tampered" ? "FAILED" : "VERIFIED"}
                      </span>
                      <span className="text-[9.5px] text-indigo-350 font-bold block mt-1 tracking-tight">{run.durationMs}ms duration</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* TAMPER ALERTS SYSTEM PANEL */
              <div className="pt-3 font-mono text-[11.5px] space-y-4">
                {brokenBlock ? (
                  <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl space-y-3 animate-pulse">
                    <div className="flex items-center gap-2 text-rose-450 font-extrabold uppercase text-[10px]">
                      <ShieldAlert className="w-4 h-4 shrink-0 animate-bounce" />
                      CRITICAL INTEGRITY BREAKPOINT REGISTERED
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <div>
                        <span className="text-slate-550 text-[9px] font-extrabold block">AFFECTED LEDGER Block</span>
                        <span className="text-white font-extrabold block">Block #{brokenBlock.blockNumber} ({brokenBlock.id})</span>
                      </div>
                      <div>
                        <span className="text-slate-550 text-[9px] font-extrabold block">DETECTION PERIOD</span>
                        <span className="text-slate-350 font-bold block">{new Date().toLocaleTimeString()}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-rose-500/10 text-slate-400 leading-relaxed font-sans text-xs">
                      Mismatch Reason: <span className="text-rose-355 font-bold font-mono text-[11.5px] leading-tight block mt-1">
                        Content of B#{brokenBlock.blockNumber} has been updated in bypass of standard ledger validators. Hash seal mismatch.
                      </span>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-[9px] text-slate-500 font-extrabold uppercase block font-mono">MITIGATION VECTOR STATUS:</span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-455 text-[9px] font-bold uppercase animate-pulse">
                        Ledger Lockdown / Security Audit Required
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 border border-dashed border-slate-900 rounded-2xl text-center text-slate-500 font-mono text-xs select-none">
                    <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    Ledger Secure. Threat scanners reports 0.0% anomalous tampering incidents.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Sandbox Threat Injector Explanation */}
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-550/15 flex items-start gap-3 select-none">
            <Zap className="text-indigo-400 w-4.5 h-4.5 shrink-0 mt-0.5 animate-pulse" />
            <div className="text-xs">
              <span className="text-white font-black block uppercase tracking-wide font-sans text-[11.5px]">SANDBOX TESTING EXPLAINER</span>
              <p className="text-[11.5px] leading-normal font-sans text-slate-400 mt-1 font-medium">
                To simulate a security breach, click on any block point above to select it, then toggle one of the red threat injectors (e.g., Mutate User Action). This causes the block data to deviate from its hash seal! Then, click "Run Integrity Audit" to watch the SIEM system locate the tampered block and flag a blockchain breach alert.
              </p>
            </div>
          </div>

        </div>

        {/* CHRONOLOGY COMPLIANCE STATS CARDS */}
        <div className="bg-[#090e1a]/85 border border-[#141b2e] rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-950/60 pb-3">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase font-mono tracking-widest block">INTEGRITY ANALYSIS MAPS</span>
            </div>

            <div className="space-y-4 pt-3 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-slate-950/20">
                <span className="text-slate-500 uppercase font-bold text-[9.5px]">TOTAL LEDGER HEIGHT</span>
                <span className="text-white font-extrabold text-[12.5px]">{blocks.length} Blocks</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-950/20">
                <span className="text-slate-500 uppercase font-bold text-[9.5px]">VERIFIED INTEGRITY RATIO</span>
                <span className="text-emerald-400 font-extrabold text-[12.5px]">
                  {brokenBlock ? Math.round(((blocks.length - 1) / blocks.length) * 100) : 100}% PASS
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-950/20">
                <span className="text-slate-500 uppercase font-bold text-[9.5px]">ALIGNED SEGMENTS</span>
                <span className="text-slate-300 font-extrabold text-[12.5px]">
                  {brokenBlock ? blocks.length - 1 : blocks.length} / {blocks.length}
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-slate-500 uppercase font-bold text-[9.5px]">BROKEN CHAIN LINKS</span>
                <span className={`font-extrabold text-[12.5px] ${brokenBlock ? "text-rose-455 animate-bounce" : "text-slate-500"}`}>
                  {brokenBlock ? 1 : 0} Segments
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/50 p-3.5 border border-slate-900 rounded-xl space-y-1 select-none">
            <span className="text-[9.5px] text-slate-550 font-extrabold block uppercase tracking-widest font-mono">LAST AUDIT ATTRIBUTE</span>
            <span className="text-white font-black block text-[12.5px] tracking-wide font-mono">
              {historyData && historyData.length > 0 
                ? new Date(historyData[0].timestamp).toLocaleTimeString() + " UTC" 
                : "INITIAL CORE SEC-CYCLE"}
            </span>
            <p className="text-[10.5px] font-sans text-slate-500 font-medium">Automatic hourly CRON integrity validation sequence active.</p>
          </div>
        </div>

      </div>

      {/* THREE ENTERPRISE ANALYTICS CHARTS USING RECHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Chart 1: Integrity score history over time */}
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1 px-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 font-mono text-[9px] font-bold">HISTORIC</span>
            <h3 className="text-xs text-white uppercase font-black tracking-wider leading-none">Ledger Integrity Trend</h3>
          </div>
          <p className="text-[10px] font-mono text-slate-500 font-bold mt-1 uppercase">7-Day Continuous Posture Attestation Scale</p>
          
          <div className="h-[180px] w-full pt-1.5 font-mono text-[9px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.integrityScoreHistory} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <defs>
                  <linearGradient id="integrityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={brokenBlock ? "#ef4444" : "#10b981"} stopOpacity={0.15}/>
                    <stop offset="95%" stopColor={brokenBlock ? "#ef4444" : "#10b981"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" opacity={0.15} strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis domain={[90, 100]} stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#090e1a", borderColor: "#1e293b", fontSize: "10px", fontFamily: "monospace" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke={brokenBlock ? "#f43f5e" : "#10b981"} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#integrityGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Verification processing speed trend */}
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1 px-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 font-mono text-[9px] font-bold">SPEED</span>
            <h3 className="text-xs text-white uppercase font-black tracking-wider leading-none">Processor hand-off duration</h3>
          </div>
          <p className="text-[10px] font-mono text-slate-500 font-bold mt-1 uppercase">Attestation processing speeds (MS)</p>
          
          <div className="h-[180px] w-full pt-1.5 font-mono text-[9px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.verificationTrend} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid stroke="#1e293b" opacity={0.15} strokeDasharray="3 3" />
                <XAxis dataKey="hour" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#090e1a", borderColor: "#1e293b", fontSize: "10px", fontFamily: "monospace" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="durMs" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Incident trigger metrics */}
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1 px-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 font-mono text-[9px] font-bold">THREAT-SCAN</span>
            <h3 className="text-xs text-white uppercase font-black tracking-wider leading-none">Security incident telemetry</h3>
          </div>
          <p className="text-[10px] font-mono text-slate-500 font-bold mt-1 uppercase">Atypical network payload traces</p>
          
          <div className="h-[180px] w-full pt-1.5 font-mono text-[9px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.tamperEvents} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid stroke="#1e293b" opacity={0.15} strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#090e1a", borderColor: "#1e293b", fontSize: "10px", fontFamily: "monospace" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend iconType="circle" iconSize={6} stroke="#fff" wrapperStyle={{ fontSize: "9px" }} />
                <Bar dataKey="attempts" label="Attacked" fill="#da6079" radius={[4, 4, 0, 0]} />
                <Bar dataKey="blocked" label="Scrubbed" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
