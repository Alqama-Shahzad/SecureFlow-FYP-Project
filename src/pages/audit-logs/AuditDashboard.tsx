import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Fingerprint, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  ShieldAlert, 
  SlidersHorizontal,
  LayoutDashboard,
  CheckCircle,
  AlertOctagon,
  FileText,
  Boxes
} from "lucide-react";
import { useAuditLogs, useHashVerification, useUniqueAuditFilters } from "../../hooks/use-audit-logs";
import { AuditFilters } from "../../components/audit-logs/AuditFilters";
import { AuditTable } from "../../components/audit-logs/AuditTable";
import { SeverityBadge, HashStatusBadge } from "../../components/audit-logs/Badges";
import { ErrorState } from "../../components/audit-logs/Skeletons";
import { SeverityType, HashStatus } from "../../types/audit-log";

export default function AuditDashboard() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  
  // Table sorting and filtering states
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState<SeverityType | "">("");
  const [statusFilter, setStatusFilter] = useState<HashStatus | "">("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const limit = 10;

  // React Query Fetch Data
  const { data, isLoading, isError, error, refetch, isFetching } = useAuditLogs({
    search,
    user: userFilter,
    module: moduleFilter,
    severity: severityFilter,
    status: statusFilter,
    sort: sortOrder,
    page,
    limit
  });

  const { data: uniqueData } = useUniqueAuditFilters();
  const { verifyChain, isVerifyingChain, verifyLogBlock, isVerifyingLogBlock } = useHashVerification();
  const [verifyingBlockId, setVerifyingBlockId] = useState<string | null>(null);

  // Quick verify entire chain handler
  const [chainVerifyMessage, setChainVerifyMessage] = useState<string | null>(null);
  const [chainVerifyStatus, setChainVerifyStatus] = useState<"Valid" | "Tampered" | null>(null);

  const handleVerifyChain = async () => {
    try {
      const res = await verifyChain();
      setChainVerifyStatus(res.status === "Tampered" ? "Tampered" : "Valid");
      if (res.status === "Tampered") {
        setChainVerifyMessage(`CRITICAL DISCREPANCY DETECTED: Chain mismatch discovered starting at block pointing to: ${res.brokenBlockId}.`);
      } else {
        setChainVerifyMessage(`COMPLIANCE SNAPSHOT PASS: Sequenced hash check verified 100% data fidelity.`);
      }
      setTimeout(() => {
        setChainVerifyMessage(null);
        setChainVerifyStatus(null);
      }, 5000);
    } catch (err: any) {
      alert("Chain verification sequence failed.");
    }
  };

  const handleVerifyBlock = async (id: string) => {
    setVerifyingBlockId(id);
    try {
      await verifyLogBlock(id);
    } catch (err) {
      console.error(err);
    } finally {
      setVerifyingBlockId(null);
    }
  };

  // Raw workbook download engines to simulate 100% active operational pipelines
  const handleExportLogs = (format: "csv" | "json") => {
    if (!data?.logs) return;
    
    let content = "";
    let mimeType = "text/plain";
    let extension = "txt";

    if (format === "csv") {
      mimeType = "text/csv";
      extension = "csv";
      const headers = ["Block", "ID", "Timestamp", "Operator", "Action", "Module", "Resource", "Severity", "IP Address", "Status", "CurrentHash"];
      const rows = data.logs.map(l => [
        l.blockNumber,
        l.id,
        l.timestamp,
        l.user,
        `"${l.action.replace(/"/g, '""')}"`,
        l.module,
        l.resource,
        l.severity,
        l.ipAddress,
        l.verificationStatus,
        l.currentHash
      ]);
      content = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    } else {
      mimeType = "application/json";
      extension = "json";
      content = JSON.stringify(data.logs, null, 2);
    }

    const dataStr = `data:${mimeType};charset=utf-8,` + encodeURIComponent(content);
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `secureflow_ledger_export_${Date.now()}.${extension}`);
    dlAnchor.click();
  };

  const usersList = uniqueData?.users || [];
  const modulesList = uniqueData?.modules || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Dynamic Security Verification Floating Toast */}
      {chainVerifyMessage && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-2xl border flex items-center gap-3 shadow-2xl z-50 max-w-md animate-fadeIn ${
          chainVerifyStatus === "Tampered" 
            ? "bg-rose-950 border-rose-500/30 text-rose-305 shadow-rose-900/10" 
            : "bg-[#061c16] border-emerald-550/30 text-emerald-405 shadow-emerald-950/10"
        }`}>
          {chainVerifyStatus === "Tampered" ? (
            <ShieldAlert className="w-5 h-5 shrink-0 animate-bounce text-rose-500" />
          ) : (
            <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
          )}
          <div className="font-mono text-xs font-bold leading-normal">
            {chainVerifyMessage}
          </div>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
              <Boxes size={16} />
            </span>
            <div className="text-[10px] font-extrabold uppercase tracking-widest font-mono text-indigo-400">
              immutable hash chain audit trace system
            </div>
          </div>
          
          <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-1 font-sans">
            SecOps Compliance Audit Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Inspect, trace, and cryptographically verify system records chained with high-grade SHA-256 ledger integrity seals.
          </p>
        </div>

        {/* Dashboard Quick actions */}
        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
          
          <button
            onClick={() => navigate("/audit-logs/verification")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-xs font-mono font-bold text-indigo-400 hover:text-white transition-all cursor-pointer"
            title="Open blockchain-inspired flow explorer"
          >
            <LayoutDashboard size={13} />
            VERIFICATION CENTER
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-xs font-mono text-slate-400 hover:text-white transition-all cursor-pointer font-bold ${
              showFilters ? "border-indigo-500/20 bg-indigo-500/5" : ""
            }`}
          >
            <SlidersHorizontal size={13} />
            FILTERS
          </button>

          <button
            onClick={handleVerifyChain}
            disabled={isVerifyingChain}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-black shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Fingerprint size={14} className={isVerifyingChain ? "animate-spin text-white" : ""} />
            VERIFY LEDGER CHAIN
          </button>
        </div>
      </div>

      {/* SUMMARY STATS GRID CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric Card 1: Total Events */}
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-4 flex items-center gap-3 shadow-sm select-none">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/15 font-mono">
            <Boxes size={14} />
          </div>
          <div>
            <div className="text-lg font-black text-white font-mono">{isLoading ? "..." : (data?.total !== undefined ? data.total : "...")}</div>
            <div className="text-[10px] text-slate-550 font-mono uppercase font-black">Logged Blocks</div>
          </div>
        </div>

        {/* Metric Card 2: Verified logs */}
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-4 flex items-center gap-3 shadow-sm select-none">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/15 font-mono">
            <CheckCircle size={14} />
          </div>
          <div>
            <div className="text-lg font-black text-white font-mono">{isLoading ? "..." : (data?.verifiedCount !== undefined ? data.verifiedCount : "...")}</div>
            <div className="text-[10px] text-zinc-550 font-mono uppercase font-black">Verified Seals</div>
          </div>
        </div>

        {/* Metric Card 3: Pending Verification */}
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-4 flex items-center gap-3 shadow-sm select-none">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/15 font-mono">
            <SlidersHorizontal size={14} />
          </div>
          <div>
            <div className="text-lg font-black text-white font-mono">{isLoading ? "..." : (data?.pendingCount !== undefined ? data.pendingCount : "...")}</div>
            <div className="text-[10px] text-slate-555 font-mono uppercase font-black font-extrabold">Pending Logs</div>
          </div>
        </div>

        {/* Metric Card 4: Tampered logs */}
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-4 flex items-center gap-3 shadow-sm select-none">
          <div className={`p-2.5 rounded-xl border font-mono ${
            data?.tamperedCount && data.tamperedCount > 0 
              ? "bg-rose-500/10 border-rose-550/20 text-rose-450 animate-pulse" 
              : "bg-rose-500/5 border-rose-500/10 text-slate-600"
          }`}>
            <AlertOctagon size={14} />
          </div>
          <div>
            <div className={`text-lg font-black font-mono ${
              data?.tamperedCount && data.tamperedCount > 0 ? "text-rose-450 animate-pulse" : "text-white"
            }`}>{isLoading ? "..." : (data?.tamperedCount !== undefined ? data.tamperedCount : "...")}</div>
            <div className="text-[10px] text-slate-550 font-mono uppercase font-black">Mismatches</div>
          </div>
        </div>

        {/* Metric Card 5: High Threat Levels */}
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-4 flex items-center gap-3 shadow-sm col-span-2 lg:col-span-1 select-none">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/15 font-mono">
            <SlidersHorizontal size={14} />
          </div>
          <div>
            <div className="text-lg font-black text-white font-mono">{isLoading ? "..." : (data?.criticalCount !== undefined ? data.criticalCount : "...")}</div>
            <div className="text-[10px] text-slate-550 font-mono uppercase font-black">Threat Flags</div>
          </div>
        </div>

      </div>

      {/* FILTER CONTROLS COLLAPSE DRAWER */}
      {showFilters && (
        <AuditFilters
          search={search}
          setSearch={(v) => { setSearch(v); setPage(1); }}
          userFilter={userFilter}
          setUserFilter={(v) => { setUserFilter(v); setPage(1); }}
          moduleFilter={moduleFilter}
          setModuleFilter={(v) => { setModuleFilter(v); setPage(1); }}
          severityFilter={severityFilter}
          setSeverityFilter={(v) => { setSeverityFilter(v); setPage(1); }}
          statusFilter={statusFilter}
          setStatusFilter={(v) => { setStatusFilter(v); setPage(1); }}
          sortOrder={sortOrder}
          setSortOrder={(v) => { setSortOrder(v); setPage(1); }}
          usersList={usersList}
          modulesList={modulesList}
          onRefresh={refetch}
          isRefreshing={isFetching}
          onExport={handleExportLogs}
        />
      )}

      {/* DIRECTIVE ERROR BOUNDARY STATE */}
      {isError ? (
        <ErrorState 
          message={error?.message || "Communication vector with security databases could not be established."} 
          onRetry={refetch} 
        />
      ) : (
        /* AUDIT TABLE CONTAINER */
        <AuditTable
          logs={data?.logs || []}
          isLoading={isLoading}
          total={data?.total || 0}
          page={page}
          setPage={setPage}
          limit={limit}
          onVerifyBlock={handleVerifyBlock}
          verifyingBlockId={verifyingBlockId}
        />
      )}
    </div>
  );
}
