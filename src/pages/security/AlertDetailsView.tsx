import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  ShieldAlert, 
  Terminal, 
  Clock, 
  MapPin, 
  Globe, 
  Fingerprint, 
  Save, 
  ChevronRight,
  User,
  Cpu,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  BadgeAlert,
  ClipboardCopy,
  Check,
  RefreshCw
} from "lucide-react";
import { useAlert } from "../../hooks/useSecurity";
import { useAuthStore } from "../../store/useAuthStore";
import { SeverityBadge, StatusBadge } from "../../components/security-shared/Badge";
import { DetailsSkeleton } from "../../components/security-shared/SecuritySkeletons";

export default function AlertDetailsView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const currentOperator = user?.email || "soc-auditor@secureflow.app";

  const { data: alert, isLoading, error, updateStatus, isUpdating } = useAlert(id || "");
  
  // Local state for status mitigation updates
  const [targetStatus, setTargetStatus] = useState<"New" | "Investigating" | "Resolved" | "Ignored">("Investigating");
  const [operatorNotes, setOperatorNotes] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);

  const handleCopyPayload = () => {
    if (alert?.evidence?.rawLog) {
      navigator.clipboard.writeText(alert.evidence.rawLog);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorNotes.trim()) return;

    try {
      await updateStatus({
        status: targetStatus,
        operator: currentOperator,
        notes: operatorNotes
      });
      setValidationSuccess(`Incident resolution status migrated to ${targetStatus} successfully.`);
      setOperatorNotes("");
      setTimeout(() => setValidationSuccess(null), 4000);
    } catch (err) {
      console.error("Failed to commit status upgrade", err);
    }
  };

  if (isLoading) {
    return <div className="p-6 md:p-8"><DetailsSkeleton /></div>;
  }

  if (error || !alert) {
    return (
      <div className="p-8 max-w-xl mx-auto mt-12 border border-slate-900 bg-[#090d16] text-center rounded-2xl space-y-4">
        <AlertTriangle className="h-10 w-10 text-red-400 mx-auto animate-bounce" />
        <h3 className="text-base font-bold text-slate-200">Incident Forensics Missing</h3>
        <p className="text-xs text-slate-400">
          The requested security token <code className="text-indigo-400 font-mono font-bold bg-slate-950 px-1 py-0.5 rounded">{id}</code> could not be located in the current database clusters.
        </p>
        <Link 
          to="/security/alerts"
          className="px-4 py-2 bg-indigo-950 border border-indigo-500/20 text-indigo-300 text-xs rounded-lg hover:bg-indigo-900/40 font-medium inline-flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="h-3 w-3" /> Return to Incidents Registers
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      {/* 1. Forensics Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-900/60">
        <div className="space-y-1">
          <button 
            onClick={() => navigate("/security/alerts")}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-semibold mb-2 group transition"
          >
            <ArrowLeft className="h-3 w-3 transform group-hover:-translate-x-0.5 transition" /> Back to incident lists
          </button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 font-mono">
              {alert.id}
            </h1>
            <SeverityBadge label={alert.severity} className="text-xs px-3 py-1" />
            <StatusBadge label={alert.status} className="text-xs px-3 py-1" />
          </div>
          <p className="text-slate-400 text-sm font-medium mt-1">
            MITRE Intrusion Target: <span className="text-slate-200 italic font-mono font-bold">{alert.targetEndpoint}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">Incident risk coefficient:</span>
          <span className={`text-xl font-mono font-extrabold px-3 py-1.5 rounded-lg border ${
            alert.riskScore > 85 ? "text-red-400 bg-red-950/20 border-red-500/30" : "text-amber-400 bg-amber-950/25 border-amber-500/20"
          }`}>
            {alert.riskScore}%
          </span>
        </div>
      </div>

      {/* 2. Interactive Workspace Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Workstation details (Col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Forensic Data Panel */}
          <div className="border border-slate-905 bg-[#090d16]/30 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-slate-200 text-base border-b border-slate-900/60 pb-3 flex items-center gap-2">
              <Terminal className="h-4.5 w-4.5 text-indigo-400" /> Perimeter Packet Specimen
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wider block">Intrusion Core Vector</span>
                <span className="text-slate-200 font-bold text-sm block">{alert.attackType}</span>
              </div>
              
              <div className="space-y-1">
                <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wider block">Origin Node (IP Address)</span>
                <span className="text-slate-200 font-bold font-mono text-sm block md:flex md:items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {alert.sourceIP} 
                  {alert.country && <span className="text-xs font-normal text-slate-400">({alert.country})</span>}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wider block">First Capture Stamp</span>
                <span className="text-slate-200 font-medium font-mono text-xs block">
                  {new Date(alert.detectedAt).toLocaleString()}
                </span>
              </div>

              <div className="space-y-1 sm:col-span-2 border-t border-slate-900/50 pt-4">
                <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wider block mb-1">User-Agent Connection Signature</span>
                <p className="bg-[#04070c] border border-slate-900 rounded-lg p-2.5 font-mono text-[11px] text-slate-450 leading-relaxed">
                  {alert.userAgent}
                </p>
              </div>
            </div>
          </div>

          {/* Raw Payload Packet Component */}
          {alert.evidence && (
            <div className="border border-slate-900 bg-[#070a13] rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 bg-[#0a0f1c]/80 border-b border-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide">
                    Raw Packet Snippet ({alert.evidence.type})
                  </span>
                </div>
                <button 
                  onClick={handleCopyPayload}
                  className="px-2.5 py-1.5 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-850 rounded border border-slate-800 text-[10px] font-mono flex items-center gap-1 transition"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="h-3 w-3" /> Copy Payload
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 bg-[#04060b] overflow-x-auto max-h-[300px]">
                <pre className="font-mono text-[11px] text-slate-400 leading-relaxed">
                  <code>{alert.evidence.rawLog}</code>
                </pre>
              </div>
              {alert.evidence.mitigationHash && (
                <div className="p-3 bg-[#0a0f1c]/50 border-t border-slate-900/60 flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <Fingerprint className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <span className="font-bold shrink-0">SHA-256 MITIGATION BLOCK:</span>
                  <span className="text-indigo-305 truncate">{alert.evidence.mitigationHash}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resolution Control Desk (Col-span-1) */}
        <div className="space-y-6">
          
          {/* Audit Triage State Controller */}
          <div className="border border-slate-905 bg-[#080d16]/35 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-slate-200 text-sm border-b border-slate-900 pb-3 flex items-center gap-2">
              <BadgeAlert className="h-4 w-4 text-indigo-300" /> Change Resolution Stage
            </h3>

            {validationSuccess && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/25 rounded-xl text-emerald-400 text-xs font-sans tracking-wide animate-fade-in flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{validationSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider block">Target Stage</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Investigating", "Resolved", "Ignored"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setTargetStatus(st as any)}
                      className={`px-3 py-2 text-xs font-mono rounded-lg border transition text-center ${
                        targetStatus === st 
                          ? "bg-indigo-950/40 border-indigo-500/40 text-indigo-300 font-bold" 
                          : "bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-350 hover:border-slate-850"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider block">Resolution/Audit Justification</label>
                <textarea 
                  value={operatorNotes}
                  onChange={(e) => setOperatorNotes(e.target.value)}
                  placeholder="e.g., Block verified on external firewall node. Cleared payload parameters..."
                  rows={4}
                  required
                  className="w-full bg-[#05080e] border border-slate-900 border-b-slate-850 rounded-lg p-2.5 text-xs text-slate-300 placeholder-slate-600 outline-none focus:ring-1 focus:ring-indigo-550 transition"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating || !operatorNotes.trim()}
                className="w-full py-2 bg-indigo-650 hover:bg-indigo-600 transition text-slate-100 disabled:opacity-40 rounded-lg font-semibold text-xs text-center flex items-center justify-center gap-1.5"
              >
                {isUpdating ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Commit Audit Decisive
              </button>
            </form>
          </div>

          {/* Incident Chronological Timeline Tracker */}
          <div className="border border-slate-900 bg-[#090d16]/25 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-slate-200 text-sm border-b border-slate-900 pb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-400/90" /> Decisive Audit Trail
            </h3>

            <div className="relative border-l border-slate-900 pl-4 space-y-5 py-2 font-sans text-xs">
              {alert.timeline.map((item, index) => (
                <div key={index} className="relative group">
                  {/* Glowing core indicator */}
                  <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-indigo-550 border-2 border-slate-950 group-hover:scale-125 transition" />
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-slate-400">
                      <span className="font-bold font-mono text-[11px] text-slate-200">{item.stage}</span>
                      <span className="font-mono text-[10px] opacity-70">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="text-[11px] opacity-80 text-slate-300">{item.notes}</div>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                      <User className="h-3 w-3" />
                      <span>{item.operator}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
