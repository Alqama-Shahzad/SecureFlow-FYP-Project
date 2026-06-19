import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Terminal, 
  Fingerprint, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Sliders, 
  Copy, 
  Check, 
  RefreshCw, 
  ChevronRight, 
  Workflow, 
  HelpCircle,
  Hash,
  ArrowRight,
  Monitor,
  Activity,
  Award
} from "lucide-react";
import { useAuditLog, useHashVerification } from "../../hooks/use-audit-logs";
import { SeverityBadge, HashStatusBadge } from "../../components/audit-logs/Badges";
import { HashViewer } from "../../components/audit-logs/HashViewer";
import { EventTimeline } from "../../components/audit-logs/Timeline";
import { DetailSkeleton, ErrorState } from "../../components/audit-logs/Skeletons";

type ActiveTabType = "details" | "hash" | "verification" | "timeline";

export default function AuditDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTabType>("details");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Custom single recalculate or verify states
  const [isVerifyingSingle, setIsVerifyingSingle] = useState(false);
  const [verificationOutcome, setVerificationOutcome] = useState<any>(null);

  const { data: log, isLoading, isError, error, refetch } = useAuditLog(id || "");
  const { verifyLogBlock, recalculateHash, isRecalculatingHash } = useHashVerification();

  const handleCopyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleVerifyEvent = async () => {
    if (!id) return;
    setIsVerifyingSingle(true);
    setVerificationOutcome(null);
    try {
      const result = await verifyLogBlock(id);
      setVerificationOutcome(result);
      refetch(); // Invalidate page data state
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifyingSingle(false);
    }
  };

  const handleRecalculate = async () => {
    if (!id) return;
    setVerificationOutcome(null);
    try {
      const res = await recalculateHash(id);
      alert(`Mathematical SHA-256 seal recalculated directly from data:\n\n${res.recalculatedHash}`);
    } catch (err: any) {
      alert(`Error during recalculation: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (isError || !log) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ErrorState 
          title="Log Block Missing" 
          message={error?.message || "Ensure specified block ptr exists on the cryptographic state."} 
          onRetry={refetch} 
        />
      </div>
    );
  }

  // Format Dates
  const formattedDate = new Date(log.timestamp).toLocaleString();
  const formatUTC = (iso: string) => {
    const d = new Date(iso);
    return d.toISOString().replace("T", " ").substring(0, 19) + " UTC";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Back to listings bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/audit-logs")}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-900 bg-slate-950/40 hover:bg-slate-950 hover:text-white transition-all text-slate-450 text-xs font-mono font-bold cursor-pointer"
        >
          <ArrowLeft size={13} />
          RETURN TO LEDGER LIST
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">LEDGER STATUS POINTER</span>
          <HashStatusBadge status={log.verificationStatus} />
        </div>
      </div>

      {/* Forensic Diagnostic Header */}
      <div className="bg-[#090e1a]/80 border border-[#141b2e] rounded-3xl p-6 shadow-sm backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 font-mono text-[9px] font-black tracking-widest uppercase">
                FORENSICS AUDIT WORKSPACE
              </span>
              <span className="font-mono text-xs text-slate-500 font-black">
                POSITION POINTER Block {log.blockNumber}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight font-sans">
              Inspection: {log.action}
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed font-mono max-w-2xl font-medium">
              Event Guid: <span className="text-indigo-400 font-bold select-all">{log.id}</span> | Dispatched: {formattedDate}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <SeverityBadge severity={log.severity} />
          </div>
        </div>
      </div>

      {/* TABS CONTROLLER BAR */}
      <div className="flex items-center gap-1.5 border-b border-slate-950/85 pb-px overflow-x-auto select-none font-mono">
        {(["details", "hash", "verification", "timeline"] as ActiveTabType[]).map((tab) => {
          let label = "EVENT DETAILS";
          if (tab === "hash") label = "CRYPTOGRAPHIC HASH DATA";
          if (tab === "verification") label = "INTEGRITY ATTESTATION";
          if (tab === "timeline") label = "CHRONOLOGY TIMELINE";

          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setVerificationOutcome(null);
              }}
              className={`px-4 py-3 border-b-2 text-xs font-mono font-black tracking-wider uppercase whitespace-nowrap cursor-pointer transition-all ${
                isActive 
                  ? "border-indigo-500 text-white bg-indigo-500/5" 
                  : "border-transparent text-slate-505 hover:text-slate-300 hover:bg-slate-950/20"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* TABS CONTAINER BODY */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* TAB 1: EVENT DETAILS */}
        {activeTab === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            
            {/* Structural Fields List */}
            <div className="lg:col-span-2 bg-[#090e1a]/85 border border-[#141b2e] rounded-3xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-xs text-white uppercase tracking-wider font-extrabold font-sans">
                  Under-Ledger Transaction Parameters
                </h3>
                <p className="text-[11px] text-slate-405 font-mono mt-0.5">
                  Static properties of target compliance ledger record set.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 font-mono text-xs border-t border-slate-950/30 pt-4">
                
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase block tracking-wider font-mono">SYS RESOURCE EVENT GUID</span>
                  <div className="flex items-center gap-2 justify-between p-2.5 rounded-xl border border-slate-950 bg-slate-950/30">
                    <span className="text-white select-all font-bold">{log.id}</span>
                    <button 
                      onClick={() => handleCopyText(log.id, "id")}
                      className="text-slate-550 hover:text-white transition-all cursor-pointer"
                    >
                      {copiedField === "id" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase block tracking-wider font-mono">TRIGGERING SECURITY USER</span>
                  <div className="flex items-center gap-2 justify-between p-2.5 rounded-xl border border-slate-950 bg-slate-950/30">
                    <span className="text-white select-all font-bold">{log.user}</span>
                    <button 
                      onClick={() => handleCopyText(log.user, "user")}
                      className="text-slate-550 hover:text-white transition-all cursor-pointer"
                    >
                      {copiedField === "user" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase block tracking-wider font-mono">CLEARANCE LEVEL ROLE</span>
                  <div className="p-2.5 rounded-xl border border-slate-950 bg-slate-950/30 text-white font-bold flex items-center gap-1.5">
                    <Award size={12} className="text-indigo-400" />
                    {log.role}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase block tracking-wider font-mono">REGISTER UNDER-MODULE</span>
                  <div className="p-2.5 rounded-xl border border-slate-950 bg-slate-950/30 text-indigo-300 font-black tracking-wide uppercase">
                    {log.module}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase block tracking-wider font-mono">AUDITED RESOURCE LINK</span>
                  <div className="p-2.5 rounded-xl border border-slate-950 bg-slate-950/30 text-white font-bold truncate select-all" title={log.resource}>
                    {log.resource}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase block tracking-wider font-mono">TIMESTAMP SEAL (UTC)</span>
                  <div className="p-2.5 rounded-xl border border-slate-950 bg-slate-950/30 text-white font-bold">
                    {formatUTC(log.timestamp)}
                  </div>
                </div>

              </div>

              {/* Event Description */}
              <div className="border-t border-slate-950/30 pt-4 space-y-1.5 font-sans">
                <span className="text-[9px] text-slate-550 font-extrabold uppercase block tracking-wider font-mono">DESCRIPTION METADATA DUMP</span>
                <div className="p-4 rounded-2xl border border-slate-950 bg-slate-950/40 text-slate-300 text-xs leading-relaxed select-text font-sans font-medium whitespace-pre-wrap">
                  {log.description}
                </div>
              </div>
            </div>

            {/* Forensic posturing and device parameters */}
            <div className="bg-[#090e1a]/85 border border-[#141b2e] rounded-3xl p-6 shadow-sm space-y-4 select-none">
              <div>
                <h3 className="text-xs text-white uppercase tracking-wider font-extrabold font-sans">
                  Active Connection Attestation
                </h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Device network metadata posture compiled at transaction launch.
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-950/30 text-xs font-mono">
                
                <div className="flex justify-between items-center py-2 border-b border-slate-950/20">
                  <span className="text-slate-500 uppercase font-black text-[9px] block">IPV4 ROUTE IP</span>
                  <span className="text-white hover:text-indigo-400 font-bold select-all">{log.ipAddress}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-950/20">
                  <span className="text-slate-500 uppercase font-black text-[9px] block">SECURITY SESSION KEY</span>
                  <span className="text-slate-350 font-bold max-w-[150px] truncate select-all">{log.sessionId || "N/A"}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-950/20">
                  <span className="text-slate-500 uppercase font-black text-[9px] block">COMPILING AGENT</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    <Monitor size={12} className="text-slate-400 shrink-0" />
                    {log.device || "Unknown Node"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500 uppercase font-black text-[9px] block">CHRONO-CLIENT v1</span>
                  <span className="text-slate-350 font-bold max-w-[150px] truncate select-all" title={log.browser}>
                    {log.browser || "System-Daemon RPC"}
                  </span>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: HASH DATA */}
        {activeTab === "hash" && (
          <div className="bg-[#090e1a]/85 border border-[#141b2e] rounded-3xl p-6 shadow-sm space-y-5 animate-fadeIn">
            <div>
              <h3 className="text-xs text-white uppercase tracking-wider font-extrabold font-sans">
                Cryptographic Signature Manifest
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Block SHA-256 seal references chaining current transaction state to Genesis block pointer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-950/30">
              
              <HashViewer 
                hash={log.previousHash} 
                label={`INPUT CHAIN POINTER (PREV_HASH ${log.blockNumber > 1 ? `BLK #${log.blockNumber - 1}` : "GENESIS BASIS"})`} 
              />

              <HashViewer 
                hash={log.currentHash} 
                label={`OUTPUT BLOCK SEAL (CURRENT_HASH BLK #${log.blockNumber})`} 
              />

            </div>

            {/* Specifications parameters */}
            <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-[10px] select-none text-slate-500 font-bold uppercase">
              <div className="space-y-0.5">
                <span>HASH ALGORITHM:</span>
                <span className="text-white block font-black text-xs">SHA-256 / IMMUTABLE</span>
              </div>
              <div className="space-y-0.5">
                <span>CHAIN BLOCK DEPTH INDEX:</span>
                <span className="text-indigo-405 block font-black text-xs">BLOCK NUMBER {log.blockNumber}</span>
              </div>
              <div className="space-y-0.5">
                <span>CHAIN CHRONOLOGY POSITION:</span>
                <span className="text-slate-300 block font-black text-xs">LEDGER INDEX {log.chainPosition}</span>
              </div>
              <div className="space-y-0.5">
                <span>HEX STRING COMPLIANCE LEN:</span>
                <span className="text-emerald-450 block font-black text-xs">64 CHR RESOLUTION</span>
              </div>
            </div>

            {/* VISUAL MINI CHAIN DIAGRAM */}
            <div className="border-t border-slate-950/35 pt-4 space-y-3">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase block tracking-wider font-mono">LEDGER BACK-REFS GRAPH WIRE</span>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center py-4 px-6 bg-slate-950/20 border border-slate-900 rounded-2xl select-none font-mono">
                
                {/* Previous Node Block */}
                {log.blockNumber > 1 ? (
                  <Link 
                    to={`/audit-logs/SF-LOG-${(log.blockNumber - 2).toString().padStart(3, "0")}`}
                    className="w-full sm:w-[220px] p-3 rounded-xl border border-slate-900 hover:border-slate-800 bg-[#090e1a]/80 text-left cursor-pointer hover:bg-slate-950"
                  >
                    <div className="text-[8.5px] text-slate-500 font-black uppercase">PREVIOUS BLK #{log.blockNumber - 1}</div>
                    <div className="text-xs text-slate-300 truncate mt-1">ID: SF-LOG-{(log.blockNumber - 2).toString().padStart(3, "0")}</div>
                    <span className="text-[9px] text-indigo-400 block font-bold hover:underline mt-1">GO TO BLOCK →</span>
                  </Link>
                ) : (
                  <div className="w-full sm:w-[220px] p-3 rounded-xl border border-[#2d1b0c]/35 bg-[#170e06]/10 text-left">
                    <div className="text-[8.5px] text-amber-500 font-black uppercase">GENESIS ROOT NODE</div>
                    <div className="text-xs text-slate-500 truncate mt-1">BASIS PREV HASH: 00000000...</div>
                    <span className="text-[9px] text-slate-600 block font-bold mt-1">LEDGER ANCHOR BLOCK</span>
                  </div>
                )}

                <ChevronRight size={16} className="text-slate-700 hidden sm:block shrink-0" />

                {/* Current Node Block */}
                <div className="w-full sm:w-[250px] p-4 rounded-xl border border-indigo-500 bg-[#0c1325]/85 text-left shadow-[0_0_15px_rgba(99,102,241,0.15)] relative">
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 px-1 rounded font-bold uppercase">CURRENT</span>
                  </div>
                  
                  <div className="text-[8.5px] text-indigo-400 font-black uppercase">BLK #{log.blockNumber} (INSPECTION NODE)</div>
                  <div className="text-xs text-white font-extrabold truncate mt-1">{log.id}</div>
                  <div className="text-[9.5px] text-slate-400 truncate mt-1.5 leading-none">SEAL: {log.currentHash.slice(0, 16)}...</div>
                </div>

                <ChevronRight size={16} className="text-slate-700 hidden sm:block shrink-0" />

                {/* Simulated Next Node Link */}
                {log.blockNumber < 12 ? (
                  <Link 
                    to={`/audit-logs/SF-LOG-${log.blockNumber.toString().padStart(3, "0")}`}
                    className="w-full sm:w-[220px] p-3 rounded-xl border border-slate-900 hover:border-slate-800 bg-[#090e1a]/80 text-left cursor-pointer hover:bg-slate-950"
                  >
                    <div className="text-[8.5px] text-slate-500 font-black uppercase">NEXT BLK #{log.blockNumber + 1}</div>
                    <div className="text-xs text-zinc-300 truncate mt-1">ID: SF-LOG-{log.blockNumber.toString().padStart(3, "0")}</div>
                    <span className="text-[9px] text-indigo-400 block font-bold hover:underline mt-1">GO TO BLOCK →</span>
                  </Link>
                ) : (
                  <div className="w-full sm:w-[220px] p-3 rounded-xl border border-dashed border-slate-900 text-left">
                    <div className="text-[8.5px] text-slate-600 font-black uppercase">NEXT POINTER BLOCK</div>
                    <div className="text-xs text-slate-650 truncate mt-1">WAITING NEW WRITE</div>
                    <span className="text-[9px] text-slate-650 block font-bold mt-1">CHAIN TIP EXTENSION</span>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* TAB 3: VERIFICATION */}
        {activeTab === "verification" && (
          <div className="bg-[#090e1a]/85 border border-[#141b2e] rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xs text-white uppercase tracking-wider font-extrabold font-sans">
                Signature Integrity Attestation Portal
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Execute a raw content validation check on this block or recalculate standard SHA-256 seal hashes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-950/30">
              
              {/* Controls and verifying details */}
              <div className="space-y-4">
                <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-900 space-y-3">
                  <div className="text-[10px] font-extrabold text-indigo-400 font-mono tracking-widest block uppercase">
                    OPERATIONAL SYSTEM INTEGRITY TRIGGER
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
                    To audit this block, the server fetches the underlying fields, parameters, and previous hashes, re-executes the SHA-256 calculation math sequence, and asserts whether it matches the stored currentHash.
                  </p>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleVerifyEvent}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-black"
                      disabled={isVerifyingSingle}
                    >
                      <RefreshCw size={13} className={isVerifyingSingle ? "animate-spin" : ""} />
                      VERIFY BLOCK INTEGRITY
                    </button>

                    <button
                      onClick={handleRecalculate}
                      className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-slate-900 bg-slate-950/60 hover:bg-slate-950 text-slate-400 hover:text-white text-xs font-mono font-bold cursor-pointer transition-all"
                    >
                      RECALCULATE RAW BLOCKS
                    </button>
                  </div>
                </div>

                {/* Explanatory notes indicators */}
                <div className="space-y-1.5 text-[9.5px] font-mono text-slate-500">
                  <div className="flex justify-between">
                    <span>CHAIN LINK STATUS:</span>
                    <span className="text-emerald-400 font-bold uppercase">Linked Successfully</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TAMPER INDICATION ALERT LEVEL:</span>
                    <span className={log.verificationStatus === "Tampered" ? "text-rose-450 font-black uppercase animate-pulse" : "text-emerald-400 font-bold uppercase"}>
                      {log.verificationStatus === "Tampered" ? "CRITICAL THREAT" : "0.0% FRAUD BIAS"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Attestation verification result card */}
              <div className="bg-[#0e1627]/40 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase font-mono tracking-widest block">ATTESTATION SNAPSHOT REPORT</span>
                  
                  {verificationOutcome ? (
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center gap-2">
                        {verificationOutcome.isValid ? (
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 font-mono text-[9px] font-black uppercase tracking-widest">
                            ● VALID AND UNALTERED
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-405 border border-rose-500/15 font-mono text-[9px] font-black uppercase tracking-widest animate-pulse">
                            ▲ TAMPER DISCREPANCY ID'D
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono font-bold">{formatUTC(verificationOutcome.recalculatedAt)}</span>
                      </div>

                      <div className="space-y-1.5 font-mono text-[10.5px]">
                        <div>
                          EXPECTED DECD: <span className="text-slate-400 break-all block text-[10px] bg-slate-950 p-2 rounded-lg border border-slate-900 mt-1 select-all">{verificationOutcome.expectedHash}</span>
                        </div>
                        <div className="pt-1.5">
                          REGISTERED SEAL: <span className={`${verificationOutcome.isValid ? "text-emerald-400" : "text-rose-450 font-bold"} break-all block text-[10px] bg-slate-950 p-2 rounded-lg border border-slate-900 mt-1 select-all`}>{verificationOutcome.actualHash}</span>
                        </div>
                      </div>

                      {!verificationOutcome.isValid && (
                        <p className="text-[11px] leading-relaxed text-rose-450 font-medium font-sans">
                          {verificationOutcome.mismatchReason}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-8 text-center text-slate-650 font-mono text-xs whitespace-pre-line py-4">
                      Waiting for active trigger connection...{"\n"}Click "Verify Block Integrity" above to test.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: TIMELINE */}
        {activeTab === "timeline" && (
          <div className="bg-[#090e1a]/85 border border-[#141b2e] rounded-3xl p-6 shadow-sm space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-xs text-white uppercase tracking-wider font-extrabold font-sans">
                Forensics Chronology Timeline
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Sequence timeline traces log record creation events, attestation periods, and diagnostic checks.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-950/30">
              <EventTimeline timeline={log.timeline} />
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
