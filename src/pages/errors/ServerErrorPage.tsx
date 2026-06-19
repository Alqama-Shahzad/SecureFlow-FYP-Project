import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ServerCrash, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertTriangle, 
  ShieldAlert,
  Database,
  Terminal
} from "lucide-react";

export default function ServerErrorPage() {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [copied, setCopied] = useState(false);

  const errorPayload = {
    timestamp: new Date().toISOString(),
    serverLocation: "AWS-US-EAST-2A-HSM-CLUSTER-3",
    requestId: "REQ-D500-" + Math.floor(100000 + Math.random() * 900000),
    statusCode: 500,
    exceptionMessage: "Database connection pool exhausted. System capacity limit reached on replica-node-4.",
    stackTrace: `Fatality: ConnectionClosedError - Pool limits exceeded (150 max)
  at Pool.acquireConnection (src/db/pool.ts:442:19)
  at async DatabaseService.query (src/db/database.ts:108:35)
  at async UserService.getProfile (src/services/user.service.ts:58:12)
  at async expressApp.get (/api/profile - server.ts:140:19)
  at process.processTicksAndRejections (node:internal/process/task_queues:95:5)`,
    clientAgent: navigator.userAgent
  };

  const handleCopyDiagnostics = () => {
    navigator.clipboard.writeText(JSON.stringify(errorPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHardReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-slate-350 font-sans">
      
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
        
        {/* Animated Crash Icon */}
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-amber-505 rounded-full blur opacity-15 animate-pulse-subtle" />
          <div className="relative h-20 w-20 rounded-full bg-amber-950/40 border border-amber-505/30 flex items-center justify-center mx-auto text-amber-500 z-10">
            <ServerCrash className="h-9 w-9 text-amber-505" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-600 border border-amber-500 flex items-center justify-center text-[10px] text-slate-100 font-bold z-20">
            500
          </span>
        </div>

        {/* Text descriptions */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
            Internal Connection Fault / 500
          </h1>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-md mx-auto">
            SecureFlow cluster gateways failed to sync database replicas because of pool limits. Operational stability safeguards are active.
          </p>
        </div>

        {/* Diagnostic Accordion Control */}
        <div className="border border-slate-910 bg-[#060a11]/40 rounded-2xl max-w-xl mx-auto overflow-hidden">
          
          <button
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#090e1a]/40 transition text-xs font-semibold"
          >
            <span className="flex items-center gap-2 text-slate-400">
              <Terminal className="h-4 w-4 text-amber-550" />
              <span>Diagnostic Information Dump</span>
            </span>
            <span className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
              {showDiagnostics ? (
                <>Collapse <ChevronUp className="h-4 w-4" /></>
              ) : (
                <>Click to Expand <ChevronDown className="h-4 w-4" /></>
              )}
            </span>
          </button>

          {showDiagnostics && (
            <div className="p-4 border-t border-slate-910 text-left space-y-4 font-mono text-[10.5px] bg-[#02050b]/80 animate-slide-up">
              
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-900">
                <span className="text-slate-500 font-semibold flex items-center gap-1.5 uppercase">
                  <Database className="h-3.5 w-3.5 text-slate-500" /> API Cluster Context
                </span>
                <button
                  type="button"
                  onClick={handleCopyDiagnostics}
                  className="p-1 px-2 border border-slate-900 bg-slate-950 hover:bg-[#070b13] hover:border-slate-805 rounded transition flex items-center gap-1.5 text-slate-400 hover:text-slate-200"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy Log
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-4 gap-y-2 text-slate-450 leading-relaxed">
                <span className="text-slate-500 uppercase">Timestamp:</span>
                <span className="col-span-3 text-slate-300 font-semibold">{errorPayload.timestamp}</span>

                <span className="text-slate-500 uppercase">Server Node:</span>
                <span className="col-span-3 text-slate-305">{errorPayload.serverLocation}</span>

                <span className="text-slate-500 uppercase">Request ID:</span>
                <span className="col-span-3 text-indigo-400 font-semibold">{errorPayload.requestId}</span>

                <span className="text-slate-500 uppercase">Diagnostic Alert:</span>
                <span className="col-span-3 text-amber-400">{errorPayload.exceptionMessage}</span>
              </div>

              {/* Code-style Stack trace box */}
              <div className="space-y-1.5 pt-2">
                <span className="text-slate-500 uppercase block">REPLICA CRASH TRACE:</span>
                <pre className="p-3 bg-[#010307] border border-slate-905 rounded-lg overflow-x-auto text-[10px] text-slate-450 font-mono select-all leading-normal max-h-40">
                  {errorPayload.stackTrace}
                </pre>
              </div>

            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto text-xs pt-2">
          
          <button
            onClick={handleHardReload}
            className="w-full sm:w-auto px-5 py-3 bg-indigo-650 hover:bg-indigo-600 text-slate-100 font-semibold rounded-lg shadow-lg shadow-indigo-950/40 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 animate-spin-slow" /> Retry Gateway Sync
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-5 py-3 border border-slate-900 bg-slate-950 hover:bg-slate-900 text-slate-300 rounded-lg hover:border-slate-805 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Retreat One Hop
          </button>

          <a
            href="mailto:sre-paging@secureflow.app?subject=SRE%20Alert%20Gateways%20Pool%20Exhausted%20%5B500%5D"
            className="w-full sm:col-span-2 p-3 border border-slate-905 bg-slate-950/30 hover:bg-slate-950 rounded-xl transition text-slate-450 hover:text-slate-205 flex items-center justify-center gap-2 text-center"
          >
            <ShieldAlert className="h-4 w-4 text-rose-500" /> Dispatch PagerDuty Alarm to SRE On-Call
          </a>

        </div>

      </div>

    </div>
  );
}
