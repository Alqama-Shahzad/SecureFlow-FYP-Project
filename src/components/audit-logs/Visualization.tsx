import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Lock, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Fingerprint, 
  ArrowRight, 
  RefreshCw, 
  Play, 
  Skull, 
  CornerDownRight,
  Sparkles,
  SearchCode,
  Coins
} from "lucide-react";
import { AuditLog, SystemIntegrityStatusType } from "../../types/audit-log";
import { HashStatusBadge } from "./Badges";

interface ChainVisualizationProps {
  blocks: AuditLog[];
  onTamper: (id: string, field: string, value: string) => void;
  onVerify: () => void;
  isVerifying: boolean;
  brokenBlockId?: string;
  onReset: () => void;
  isResetting: boolean;
}

export function ChainVisualization({
  blocks,
  onTamper,
  onVerify,
  isVerifying,
  brokenBlockId,
  onReset,
  isResetting
}: ChainVisualizationProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  // Compute status colors
  const isChainBroken = !!brokenBlockId;
  const statusName = isChainBroken ? "Tampered" : "Valid";

  const getIntegrityBadgeIcon = (status: SystemIntegrityStatusType) => {
    switch (status) {
      case "Tampered":
        return <Skull className="w-10 h-10 text-rose-500 animate-spin" />;
      case "Warning":
        return <AlertTriangle className="w-10 h-10 text-amber-500" />;
      case "Valid":
      default:
        return <CheckCircle2 className="w-10 h-10 text-emerald-400" />;
    }
  };

  const getStatusTextClasses = (status: SystemIntegrityStatusType) => {
    switch (status) {
      case "Tampered":
        return "text-rose-500 shadow-rose-950/20";
      case "Warning":
        return "text-amber-500";
      case "Valid":
      default:
        return "text-emerald-400";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Status Indicator & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* State Banner */}
        <div className="md:col-span-2 bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <span className={`p-2.5 rounded-xl bg-slate-950 border border-dashed flex items-center justify-center ${
              isChainBroken ? "border-rose-500/20 bg-rose-500/5" : "border-emerald-500/20 bg-emerald-500/5"
            }`}>
              {getIntegrityBadgeIcon(statusName as any)}
            </span>
            <div>
              <div className="text-[9px] font-extrabold uppercase tracking-widest font-mono text-slate-500">LEDGER INTEGRITY STATUS</div>
              <h2 className={`text-2xl font-black font-mono tracking-wider mt-0.5 ${getStatusTextClasses(statusName as any)}`}>
                {isChainBroken ? "CHAIN TAMPERED" : "CHAIN SECURE"}
              </h2>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                {isChainBroken 
                  ? "CRITICAL ALERT: Back-linked hashes do not match under-ledger registers." 
                  : "Continuous automated attestation successfully verified 100% of blocks."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
            <button
              onClick={onVerify}
              disabled={isVerifying}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-black transition-all cursor-pointer shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 disabled:opacity-50"
            >
              <RefreshCw size={13} className={isVerifying ? "animate-spin" : ""} />
              RUN INTEGRITY AUDIT
            </button>

            {isChainBroken && (
              <button
                onClick={onReset}
                disabled={isResetting}
                className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-rose-950 bg-rose-950/20 hover:bg-rose-900/30 text-rose-450 hover:text-white text-xs font-mono font-bold cursor-pointer transition-all"
              >
                RESTORE LEDGER
              </button>
            )}
          </div>
        </div>

        {/* Diagnostic Scorecard */}
        <div className="bg-[#090e1a]/80 border border-[#141b2e] rounded-2xl p-5 shadow-sm backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <span className="text-[9px] text-slate-500 font-extrabold uppercase font-mono tracking-widest block">COMPLIANCE HEALTH</span>
            <div className="flex items-baseline gap-1 mt-3">
              <span className={`text-4xl font-black font-mono ${isChainBroken ? "text-rose-450" : "text-emerald-400"}`}>
                {isChainBroken ? Math.max(0, Math.round(((blocks.length - 1) / blocks.length) * 100)) : 100}%
              </span>
              <span className="text-xs text-slate-500 font-mono">HEALTH SCORE</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase font-bold">
              {isChainBroken ? "Broken chaining segments identified" : "Pristine SHA-256 cascade sequence"}
            </p>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full mt-4 overflow-hidden border border-slate-900">
            <div 
              className={`h-full transition-all duration-500 ${isChainBroken ? "bg-rose-500" : "bg-emerald-500"}`}
              style={{ width: `${isChainBroken ? Math.max(10, Math.round(((blocks.length - 1) / blocks.length) * 100)) : 100}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* HORIZONTAL BLOCKCHAIN TIMELINE EXPLORER */}
      <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 shadow-inner relative">
        <div className="text-[10px] font-extrabold uppercase tracking-widest font-mono text-slate-500 mb-4 flex items-center justify-between">
          <span>ACTIVE LEDGER SECURE CHAIN TIMELINE MAP</span>
          <span className="text-indigo-400 animate-pulse">● LIVE CHAIN DIAGNOSTICS</span>
        </div>

        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <div className="flex items-center gap-4 min-w-[1200px] py-2 relative">
            
            {/* Chain Map Block Nodes */}
            {blocks.map((block, index) => {
              const isBroken = brokenBlockId === block.id;
              const hasBrokenIncidentBefore = isChainBroken && block.blockNumber > blocks.find(b => b.id === brokenBlockId)!.blockNumber;
              const isSelected = selectedBlockId === block.id;

              let nodeBorderColor = "border-slate-900 hover:border-slate-800 bg-[#090e1a]/80";
              let shadowClass = "";
              let numBg = "text-slate-400 bg-slate-950";

              if (isBroken) {
                nodeBorderColor = "border-rose-500/70 bg-rose-950/20";
                shadowClass = "shadow-[0_0_15px_rgba(239,68,68,0.15)] bg-slate-950";
                numBg = "text-rose-450 bg-rose-500/10 border-rose-500/25 border";
              } else if (hasBrokenIncidentBefore) {
                nodeBorderColor = "border-amber-500/30 bg-amber-950/10";
                numBg = "text-amber-400 bg-amber-500/10 border-amber-500/20 border";
              } else if (isSelected) {
                nodeBorderColor = "border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)] bg-slate-950";
              } else {
                nodeBorderColor = "border-emerald-500/20 hover:border-emerald-500 bg-[#061219]/90 hover:bg-[#091822]";
                numBg = "text-emerald-405 bg-emerald-500/10 border border-emerald-550/15";
              }

              return (
                <React.Fragment key={block.id}>
                  
                  {/* Single Block Block Node Box */}
                  <div 
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`w-[180px] shrink-0 p-3.5 rounded-2xl border text-left cursor-pointer transition-all hover:-translate-y-1 relative select-none ${nodeBorderColor} ${shadowClass}`}
                  >
                    
                    {/* Circle sequence indicator */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-black tracking-wider uppercase ${numBg}`}>
                        BLK #{block.blockNumber.toString().padStart(3, "0")}
                      </span>
                      <HashStatusBadge status={isBroken ? "Tampered" : hasBrokenIncidentBefore ? "Pending" : "Verified"} className="scale-75" />
                    </div>

                    <div className="space-y-1 mt-2.5">
                      <div className="text-[10px] font-sans font-extrabold text-white truncate">{block.action}</div>
                      <div className="text-[8px] text-slate-500 font-mono truncate">{block.user.split("@")[0]}</div>
                    </div>

                    {/* Hashes preview */}
                    <div className="mt-3.5 pt-2 border-t border-slate-950/25 space-y-1 text-[8.5px] font-mono text-slate-500">
                      <div>
                        PREV: <span className="text-slate-400">{block.previousHash.slice(0, 10)}...</span>
                      </div>
                      <div>
                        CURR: <span className={`font-medium ${isBroken ? "text-rose-400" : "text-emerald-400"}`}>
                          {block.currentHash.slice(0, 10)}...
                        </span>
                      </div>
                    </div>

                    {/* Visual broken line overlay */}
                    {isBroken && (
                      <div className="absolute inset-0 border-2 border-rose-600 rounded-2xl animate-ping opacity-15 pointer-events-none"></div>
                    )}

                  </div>

                  {/* Connect arrow vector between blocks */}
                  {index < blocks.length - 1 && (
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <ArrowRight 
                        size={14} 
                        className={`transition-colors shrink-0 ${
                          isBroken || hasBrokenIncidentBefore 
                            ? "text-rose-500 animate-pulse" 
                            : "text-emerald-500/40"
                        }`} 
                      />
                    </div>
                  )}

                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* BLOCK INTERACTIVE ANALYSIS DRAWER */}
      {selectedBlock ? (
        <div className="bg-[#090e1a]/80 border border-[#141b2e] rounded-2xl p-5 shadow-lg relative overflow-hidden animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-950/60">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 font-mono text-[10px] font-bold">
                DIAGNOSTICS PANEL
              </span>
              <h3 className="text-sm font-black font-sans uppercase text-white tracking-wider">
                Block #{selectedBlock.blockNumber.toString().padStart(3, "0")} Analysis
              </h3>
            </div>
            
            <Link 
              to={`/audit-logs/${selectedBlock.id}`}
              className="text-[10px] font-mono font-extrabold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 tracking-widest uppercase cursor-pointer self-start sm:self-auto"
            >
              GOTO FORENSICS RECORD <ArrowRight size={11} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            
            {/* Meta values */}
            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-3 py-1 border-b border-slate-950/20">
                <span className="text-slate-500 uppercase font-bold text-[10px]">EVENT ID</span>
                <span className="col-span-2 text-white font-bold">{selectedBlock.id}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-950/20">
                <span className="text-slate-500 uppercase font-bold text-[10px]">SUB-SYSTEM</span>
                <span className="col-span-2 text-indigo-400 font-bold">{selectedBlock.module}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-950/20">
                <span className="text-slate-500 uppercase font-bold text-[10px]">OPERATOR ACCOUNT</span>
                <span className="col-span-2 text-white font-medium">{selectedBlock.user}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-950/20">
                <span className="text-slate-500 uppercase font-bold text-[10px]">TIMESTAMP</span>
                <span className="col-span-2 text-slate-300 font-medium">{new Date(selectedBlock.timestamp).toISOString()}</span>
              </div>
              <div className="grid grid-cols-3 py-1">
                <span className="text-slate-500 uppercase font-bold text-[10px]">DESCRIPTION</span>
                <span className="col-span-2 text-slate-400 text-[11px] leading-relaxed select-text font-sans mt-0.5">{selectedBlock.description}</span>
              </div>
            </div>

            {/* Cryptographic block integrity checks & SANDBOX ADV-EXPLOIT TOOL */}
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl space-y-2">
                <span className="text-[10px] font-extrabold text-[#da6079] font-mono tracking-wider block uppercase">
                  ⚡ SECURITY INCIDENT SIMULATION DECI-RIG (SANDBOX WEAPON)
                </span>
                <p className="text-[11.5px] font-sans text-slate-400 leading-relaxed font-medium">
                  Perform a covert transaction modification. Since this is an immutable blockchain-secured ledger, altering any property instantly disrupts the cryptographic cascade of SHA-256 hashes!
                </p>
                
                <div className="flex items-center gap-1.5 pt-2 flex-wrap">
                  
                  {/* Tamper trigger buttons */}
                  <button
                    onClick={() => onTamper(selectedBlock.id, "action", "ILLEGAL_UNAUTHORIZED_MUTATION_CRITICAL")}
                    disabled={selectedBlock.verificationStatus === "Tampered"}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 border border-rose-500/15 hover:border-rose-500 text-rose-450 hover:text-white text-[10px] font-mono font-extrabold cursor-pointer transition-all disabled:opacity-30 disabled:hover:bg-rose-500/10 disabled:hover:text-rose-450 disabled:cursor-not-allowed"
                  >
                    MUTATE USER ACTION ACTION
                  </button>

                  <button
                    onClick={() => onTamper(selectedBlock.id, "user", "adversary@darknode.onion")}
                    disabled={selectedBlock.verificationStatus === "Tampered"}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 border border-rose-500/15 hover:border-rose-500 text-rose-450 hover:text-white text-[10px] font-mono font-extrabold cursor-pointer transition-all disabled:opacity-30 disabled:hover:bg-rose-500/10 disabled:hover:text-rose-450 disabled:cursor-not-allowed"
                  >
                    SPOOF SENDER SENDER
                  </button>

                  {selectedBlock.verificationStatus === "Tampered" && (
                    <div className="text-[10px] text-rose-405 font-mono font-bold flex items-center gap-1 mt-1.5 uppercase">
                      ⚠️ SEAL DESTROYED. UNDER-LEDGER DATA ALTERED.
                    </div>
                  )}

                </div>
              </div>

              {/* Cryptography parameters */}
              <div className="space-y-1.5 text-[9.5px] font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>INPUT CHAIN POINTER:</span>
                  <span className="text-slate-400 font-bold">{selectedBlock.previousHash.slice(0, 32)}...</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>CALCULATED OUTPUT SEAL:</span>
                  <span className={`${selectedBlock.verificationStatus === "Tampered" ? "text-rose-400 font-extrabold" : "text-emerald-400"}`}>
                    {selectedBlock.currentHash.slice(0, 32)}...
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      ) : (
        <div className="bg-[#090e1a]/40 border border-dashed border-slate-900 rounded-2xl py-8 text-center text-slate-500 font-mono text-xs">
          <CornerDownRight size={14} className="mx-auto mb-1 animate-bounce text-slate-600" />
          CLICK ON ANY CHAIN BLOCK pointer NODE TO INITIALIZE METADATA DIAGNOSTICS & THREAT INJECTORS
        </div>
      )}

    </div>
  );
}

interface IntegrityScoreCardProps {
  logs: AuditLog[];
}

export function IntegrityScoreCard({ logs }: IntegrityScoreCardProps) {
  // Simple card displaying aggregate chain metrics
  const total = logs.length;
  const verified = logs.filter(l => l.verificationStatus === "Verified").length;
  const tampered = logs.filter(l => l.verificationStatus === "Tampered").length;

  return (
    <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 shadow-sm space-y-4">
      <span className="text-[9px] text-indigo-400 font-extrabold uppercase font-mono tracking-widest block">CHAIN SANITY SCOPES</span>
      
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 border border-slate-950 bg-slate-950/40 rounded-xl space-y-0.5">
          <span className="text-white font-extrabold text-sm">{total}</span>
          <span className="text-[8px] text-slate-505 block tracking-wide uppercase font-mono uppercase">Blocks</span>
        </div>
        <div className="p-2 border border-slate-950 bg-slate-[#0b1b16]/10 border-emerald-900/10 rounded-xl space-y-0.5">
          <span className="text-emerald-400 font-extrabold text-sm">{verified}</span>
          <span className="text-[8px] text-emerald-505 block tracking-wide uppercase font-mono uppercase">Verified</span>
        </div>
        <div className="p-2 border border-slate-950 bg-slate-[#1c0e14]/10 border-rose-900/10 rounded-xl space-y-0.5">
          <span className={`font-extrabold text-sm ${tampered > 0 ? "text-rose-400 animate-pulse" : "text-slate-500"}`}>{tampered}</span>
          <span className="text-[8px] text-slate-505 block tracking-wide uppercase font-mono uppercase">Tampered</span>
        </div>
      </div>
    </div>
  );
}
