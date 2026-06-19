import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Copy, Check, ShieldAlert, Loader2, PlayCircle, Fingerprint, RefreshCw } from "lucide-react";
import { AuditLog, SeverityType } from "../../types/audit-log";
import { SeverityBadge, HashStatusBadge } from "./Badges";

interface AuditTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  total: number;
  page: number;
  setPage: (val: number) => void;
  limit: number;
  onVerifyBlock: (id: string) => Promise<any>;
  verifyingBlockId: string | null;
}

export function AuditTable({
  logs,
  isLoading,
  total,
  page,
  setPage,
  limit,
  onVerifyBlock,
  verifyingBlockId
}: AuditTableProps) {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = (page - 1) * limit;
  const paginatedLogs = logs.slice(startIndex, startIndex + limit);

  const formatTimestamp = (iso: string) => {
    const d = new Date(iso);
    return d.toISOString().replace("T", " ").substring(0, 19) + " UTC";
  };

  return (
    <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl overflow-hidden shadow-sm backdrop-blur-sm flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-950 bg-slate-950/40 text-[9px] font-mono font-extrabold tracking-widest text-slate-500 uppercase">
              <th className="py-4 px-5 font-mono">BLOCK POINTER</th>
              <th className="py-4 px-4 font-mono">TIMESTAMP (UTC)</th>
              <th className="py-4 px-4 font-mono">OPERATOR SECTOR</th>
              <th className="py-4 px-4 font-mono">SYSTEM ACTIVITY ACTION</th>
              <th className="py-4 px-4 font-mono">MODULE / RESOURCE</th>
              <th className="py-4 px-3 font-mono">SEVERITY</th>
              <th className="py-4 px-4 font-mono text-center">HASH SEAL</th>
              <th className="py-4 px-5 font-mono text-right">SYSTEM CONTROLS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-950/40 divide-dashed font-mono">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-5"><div className="h-4 w-16 bg-slate-800 rounded"></div></td>
                  <td className="py-4 px-4"><div className="h-4 w-32 bg-slate-800 rounded"></div></td>
                  <td className="py-4 px-4"><div className="h-4 w-28 bg-slate-800 rounded"></div></td>
                  <td className="py-4 px-4"><div className="h-4 w-48 bg-slate-800 rounded"></div></td>
                  <td className="py-4 px-4"><div className="h-4 w-36 bg-slate-800 rounded"></div></td>
                  <td className="py-4 px-3"><div className="h-4 w-12 bg-slate-800 rounded"></div></td>
                  <td className="py-4 px-4 text-center"><div className="h-4 w-24 mx-auto bg-slate-800 rounded"></div></td>
                  <td className="py-4 px-5 text-right"><div className="h-8 w-20 ml-auto bg-slate-800 rounded-xl"></div></td>
                </tr>
              ))
            ) : paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 px-5 text-center">
                  <div className="max-w-md mx-auto py-8">
                    <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-xs text-white uppercase font-black tracking-wider">Zero Matching Security Logs</h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      No events matched the filter metrics currently selected. Reconfigure active query parameters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log) => {
                const isItemVerifying = verifyingBlockId === log.id;
                
                return (
                  <tr 
                    key={log.id} 
                    className="hover:bg-slate-950/20 group/row transition-all text-xs text-slate-300"
                  >
                    {/* Block index */}
                    <td className="py-3.5 px-5 select-none shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Fingerprint size={12} className="text-slate-500 group-hover/row:text-indigo-400 transition-colors" />
                        <span className="font-extrabold text-slate-400 font-mono text-[11px]">
                          B#{log.blockNumber.toString().padStart(3, "0")}
                        </span>
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {formatTimestamp(log.timestamp)}
                    </td>

                    {/* User and IP */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="text-white font-bold max-w-[150px] truncate" title={log.user}>
                          {log.user.split("@")[0]}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          IP: {log.ipAddress}
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <div className="text-white tracking-tight break-all max-w-[200px]" title={log.action}>
                        {log.action}
                      </div>
                    </td>

                    {/* Module and Resource */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="text-indigo-300 font-extrabold text-[10px] uppercase font-mono tracking-wider">
                          {log.module}
                        </span>
                        <span className="text-[10px] text-slate-400 max-w-[120px] truncate font-medium mt-0.5" title={log.resource}>
                          {log.resource}
                        </span>
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="py-3.5 px-3">
                      <SeverityBadge severity={log.severity} />
                    </td>

                    {/* Hash Status badge */}
                    <td className="py-3.5 px-4 text-center">
                      <HashStatusBadge status={log.verificationStatus} />
                    </td>

                    {/* System controls */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Copy ID */}
                        <button
                          onClick={(e) => handleCopyId(log.id, e)}
                          className="p-1 px-1.5 rounded-lg border border-slate-950 hover:border-slate-850 bg-slate-950/20 text-slate-500 hover:text-white transition-all cursor-pointer"
                          title="Copy block unique GUID"
                        >
                          {copiedId === log.id ? (
                            <Check size={11} className="text-emerald-400" />
                          ) : (
                            <Copy size={11} />
                          )}
                        </button>

                        {/* Verify Block */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onVerifyBlock(log.id);
                          }}
                          disabled={isItemVerifying}
                          className={`p-1 px-2.5 rounded-lg border border-slate-950 hover:border-slate-850 text-[10px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer ${
                            log.verificationStatus === "Tampered" 
                              ? "bg-rose-950/20 border-rose-900/35 hover:bg-rose-900/10 text-rose-300"
                              : "bg-slate-950/40 hover:bg-[#0d1527] text-slate-400 hover:text-white"
                          }`}
                          title="Direct integrity validation audit on block content"
                        >
                          {isItemVerifying ? (
                            <Loader2 size={11} className="animate-spin text-indigo-400" />
                          ) : (
                            <RefreshCw size={10} />
                          )}
                          CHECK
                        </button>

                        {/* View Details */}
                        <button
                          onClick={() => navigate(`/audit-logs/${log.id}`)}
                          className="p-1 px-2.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/15 hover:border-indigo-500 text-indigo-400 hover:text-white text-[10px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer"
                          title="Open forensically complete timeline"
                        >
                          <Eye size={11} />
                          VIEW
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {!isLoading && total > 0 && (
        <div className="bg-[#090e1a]/95 border-t border-slate-950/50 py-3.5 px-5 flex flex-col sm:flex-row items-center justify-between gap-4 select-none font-mono text-[11px] font-bold">
          <div className="text-slate-500 font-mono">
            SHOWING <span className="text-white font-extrabold">{startIndex + 1}</span> - <span className="text-white font-extrabold">{Math.min(startIndex + limit, total)}</span> OF <span className="text-white font-extrabold">{total}</span> SECURED BLOCKS
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1.5 rounded-xl border border-slate-900 text-xs font-mono font-bold transition-all ${
                page === 1 
                  ? "opacity-40 cursor-not-allowed bg-slate-950/10 text-slate-600" 
                  : "bg-slate-950/40 hover:bg-slate-900 text-slate-300 hover:text-white cursor-pointer"
              }`}
            >
              PREVIOUS BLOCK
            </button>
            <div className="text-slate-400 text-xs font-mono px-2">
              PAGE <span className="text-white font-black">{page}</span> OF <span className="text-slate-500">{totalPages}</span>
            </div>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-1.5 rounded-xl border border-slate-900 text-xs font-mono font-bold transition-all ${
                page === totalPages 
                  ? "opacity-40 cursor-not-allowed bg-slate-950/10 text-slate-600" 
                  : "bg-slate-950/40 hover:bg-slate-900 text-slate-300 hover:text-white cursor-pointer"
              }`}
            >
              NEXT BLOCK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
