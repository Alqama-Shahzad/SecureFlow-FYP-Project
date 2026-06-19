import React, { useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  RefreshCw, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight,
  SlidersHorizontal,
  X,
  Eye,
  Settings,
  HelpCircle
} from "lucide-react";
import { useAlerts } from "../../hooks/useSecurity";
import { SeverityBadge, StatusBadge } from "../../components/security-shared/Badge";
import { TableSkeleton } from "../../components/security-shared/SecuritySkeletons";

export default function AlertsCenter() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Active filters State
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [attackType, setAttackType] = useState("");

  const limit = 8; // Items per page

  // Fetch paginated alerts with TanStack query matching actual filters state
  const { data, isLoading, refetch, isRefetching, error } = useAlerts({
    search,
    severity,
    status,
    attackType,
    page,
    limit
  });

  const handleResetFilters = () => {
    setSearch("");
    setSeverity("");
    setStatus("");
    setAttackType("");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      setPage(newPage);
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            <ShieldAlert className="h-7 w-7 text-red-400" />
            Security Incident Registry
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Complete high-audit incident repository, WAF interventions, and active mitigation workflows
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()}
            disabled={isRefetching}
            className="px-4 py-2 bg-slate-950 border border-slate-900 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-900 transition flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3 w-3 ${isRefetching ? "animate-spin" : ""}`} />
            Sync Logs
          </button>
        </div>
      </div>

      {/* 2. Advanced Multi-Filter Query Controller Panel */}
      <div className="bg-[#090d16]/40 border border-slate-905 p-5 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-slate-400 font-mono text-xs font-semibold">
          <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-400" />
          <span>Post-Filtering Queries</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Custom search keyword */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-500" />
            <input 
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search IP, CID, path..."
              className="w-full bg-[#05080e] border border-slate-900 text-slate-250 placeholder-slate-550 rounded-lg pl-9 pr-4 py-2 text-xs font-sans outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

          {/* Severity state selection */}
          <div>
            <select
              value={severity}
              onChange={(e) => {
                setSeverity(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#05080e] border border-slate-900 text-slate-300 rounded-lg p-2 text-xs font-sans outline-none"
            >
              <option value="">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status state selection */}
          <div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#05080e] border border-slate-900 text-slate-300 rounded-lg p-2 text-xs font-sans outline-none"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Investigating">Investigating</option>
              <option value="Resolved">Resolved</option>
              <option value="Ignored">Ignored</option>
            </select>
          </div>

          {/* Attack type selection */}
          <div>
            <select
              value={attackType}
              onChange={(e) => {
                setAttackType(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#05080e] border border-slate-900 text-slate-300 rounded-lg p-2 text-xs font-sans outline-none"
            >
              <option value="">All Attack Vectors</option>
              <option value="SQL Injection">SQL Injection</option>
              <option value="Brute Force">Brute Force</option>
              <option value="Rate Limit Violation">Rate Limit Violation</option>
              <option value="Privilege Escalation">Privilege Escalation</option>
              <option value="Anomalous Access">Anomalous Access</option>
            </select>
          </div>

          {/* Reset Action */}
          <div>
            <button
              onClick={handleResetFilters}
              className="w-full px-4 py-2 border border-slate-900 hover:border-slate-850 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-semibold font-sans transition flex items-center justify-center gap-1.5"
            >
              <X className="h-3 w-3" /> Clear filters
            </button>
          </div>
        </div>
      </div>

      {/* 3. Incidents Ledger table */}
      {isLoading ? (
        <TableSkeleton rows={limit} cols={6} />
      ) : error || !data ? (
        <div className="border border-red-500/20 bg-red-950/5 rounded-2xl p-8 text-center space-y-4">
          <AlertTriangle className="h-10 w-10 text-red-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">Incident Query Halted</h3>
          <p className="text-xs text-slate-400">Database server was unable to retrieve audit stream. Check error trace: {(error as Error)?.message}</p>
        </div>
      ) : data.alerts.length === 0 ? (
        <div className="border border-slate-900 bg-[#080b13]/25 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
          <HelpCircle className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">No Incidents Found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Your criteria did not match any historical trace in the active system ledger. Try clearing filters.
          </p>
          <button 
            onClick={handleResetFilters}
            className="px-4 py-2 bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-xs rounded-lg hover:bg-indigo-900/60 font-medium transition"
          >
            View All Traces
          </button>
        </div>
      ) : (
        <div className="border border-slate-900 bg-[#070a12]/35 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-[#090e18]/30 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Incident CID</th>
                  <th className="py-4 px-6">Detected At</th>
                  <th className="py-4 px-6">Source Node (IP)</th>
                  <th className="py-4 px-6 font-sans normales font-bold text-slate-300">Intrusion Vector</th>
                  <th className="py-4 px-6">Target Path</th>
                  <th className="py-4 px-6">Severity</th>
                  <th className="py-4 px-6">Resolution Stage</th>
                  <th className="py-4 px-6 text-right">MITRE Triage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50 font-sans text-xs">
                {data.alerts.map((alert) => (
                  <tr 
                    key={alert.id}
                    className="hover:bg-[#090d16]/40 transition duration-150 cursor-pointer group"
                    onClick={() => navigate(`/security/alerts/${alert.id}`)}
                  >
                    <td className="py-4 px-6 font-mono font-bold text-slate-400 group-hover:text-slate-100">{alert.id}</td>
                    <td className="py-4 px-6 text-slate-400 font-mono">
                      {new Date(alert.detectedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                      })}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">{alert.sourceIP}</td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-200">{alert.attackType}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">
                      {alert.targetEndpoint}
                    </td>
                    <td className="py-4 px-6 select-none">
                      <SeverityBadge label={alert.severity} />
                    </td>
                    <td className="py-4 px-6 select-none">
                      <StatusBadge label={alert.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/security/alerts/${alert.id}`);
                        }}
                        className="px-3 py-1.5 bg-[#090d16] hover:bg-slate-900 border border-slate-850 rounded-lg text-slate-300 hover:text-slate-100 transition inline-flex items-center gap-1 text-[11px] font-semibold"
                      >
                        <Eye className="h-3 w-3 text-indigo-400" /> Triage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
          <div className="p-4 border-t border-slate-900 bg-[#090d16]/30 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400 uppercase">
              Total logs: <span className="text-slate-200 font-bold">{data.total}</span> | Showing page {page} of {data.pages}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 border border-slate-900 bg-slate-950 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-100 disabled:opacity-40 transition"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handlePageChange(Math.min(data.pages, page + 1))}
                disabled={page === data.pages}
                className="p-2 border border-slate-900 bg-slate-950 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-100 disabled:opacity-40 transition"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
