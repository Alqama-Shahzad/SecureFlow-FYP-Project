import React, { useState } from "react";
import { Search, X, Download, ListFilter, RefreshCw, ChevronDown, FileJson, FileSpreadsheet, Calendar } from "lucide-react";
import { SeverityType, HashStatus } from "../../types/audit-log";

interface AuditFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  userFilter: string;
  setUserFilter: (val: string) => void;
  moduleFilter: string;
  setModuleFilter: (val: string) => void;
  severityFilter: SeverityType | "";
  setSeverityFilter: (val: SeverityType | "") => void;
  statusFilter: HashStatus | "";
  setStatusFilter: (val: HashStatus | "") => void;
  sortOrder: "newest" | "oldest";
  setSortOrder: (val: "newest" | "oldest") => void;
  
  // Available lists for options
  usersList: string[];
  modulesList: string[];
  
  onRefresh: () => void;
  onExport: (format: "csv" | "json") => void;
  isRefreshing?: boolean;
}

export function AuditFilters({
  search,
  setSearch,
  userFilter,
  setUserFilter,
  moduleFilter,
  setModuleFilter,
  severityFilter,
  setSeverityFilter,
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder,
  usersList,
  modulesList,
  onRefresh,
  onExport,
  isRefreshing = false
}: AuditFiltersProps) {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const hasActiveFilters = 
    search !== "" || 
    userFilter !== "" || 
    moduleFilter !== "" || 
    severityFilter !== "" || 
    statusFilter !== "";

  const handleResetFilters = () => {
    setSearch("");
    setUserFilter("");
    setModuleFilter("");
    setSeverityFilter("");
    setStatusFilter("");
  };

  return (
    <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-sm backdrop-blur-sm">
      
      {/* Top Search Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search Bar Component */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
            <Search size={15} />
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-900 focus:border-slate-850 hover:border-slate-850 outline-none bg-slate-950/60 hover:bg-slate-950/80 focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/20 text-xs font-mono text-white placeholder:text-slate-500 transition-all"
            placeholder="Search hash chains, operator emails, audit action strings, modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sorting, Reset & Export */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Sorting */}
          <select
            value={sortOrder}
            onChange={(e: any) => setSortOrder(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-900 bg-slate-950/60 hover:bg-slate-950 text-xs font-mono font-bold text-slate-400 focus:border-slate-800 focus:outline-none cursor-pointer transition-all"
          >
            <option value="newest">NEWEST FIRST</option>
            <option value="oldest">OLDEST FIRST</option>
          </select>

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl border border-slate-900 hover:border-slate-850 bg-slate-950/40 hover:bg-slate-950/80 text-slate-400 hover:text-white transition-all cursor-pointer shadow-sm group"
            title="Refresh Ledger Synchronizer"
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={`group-hover:rotate-180 transition-all duration-500 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-rose-900/40 hover:border-rose-900/60 bg-rose-950/20 hover:bg-rose-950/45 text-rose-400 hover:text-rose-300 text-xs font-mono font-bold cursor-pointer transition-all"
            >
              <X size={12} />
              CLEAR FILTERS
            </button>
          )}

          {/* Export Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              onBlur={() => setTimeout(() => setIsExportMenuOpen(false), 200)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-900 hover:border-slate-800 bg-slate-950/50 hover:bg-slate-950 text-xs font-mono text-slate-400 hover:text-white transition-all cursor-pointer font-bold shadow-sm"
            >
              <Download size={13} />
              EXPORT LOGS
              <ChevronDown size={11} className={`transition-all duration-200 ${isExportMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-900 bg-[#090e1a] shadow-xl z-20 overflow-hidden font-mono text-[11px] font-bold p-1 animate-fadeIn">
                <button
                  onClick={() => onExport("csv")}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-indigo-600/10 hover:border-slate-850 border border-transparent transition-all text-left cursor-pointer"
                >
                  <FileSpreadsheet size={13} className="text-emerald-500" />
                  EXPORT WORKBOOK (CSV)
                </button>
                <button
                  onClick={() => onExport("json")}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-indigo-600/10 hover:border-slate-850 border border-transparent transition-all text-left cursor-pointer"
                >
                  <FileJson size={13} className="text-indigo-400" />
                  RECONSTRUCTION DATA (JSON)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1 border-t border-slate-950/30">
        
        {/* User filter */}
        <div className="space-y-1">
          <label className="text-[9px] text-slate-500 font-extrabold uppercase font-mono tracking-widest block">SECCOM OPERATOR</label>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-950 hover:border-slate-905 bg-slate-950/40 rounded-xl text-xs font-mono text-slate-300 focus:outline-none cursor-pointer transition-all"
          >
            <option value="">ALL SECURITY USERS</option>
            {usersList.map((user) => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>

        {/* Module filter */}
        <div className="space-y-1">
          <label className="text-[9px] text-slate-500 font-extrabold uppercase font-mono tracking-widest block">SUB-LEDGER SYSTEM</label>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-950 hover:border-slate-905 bg-slate-950/40 rounded-xl text-xs font-mono text-slate-300 focus:outline-none cursor-pointer transition-all"
          >
            <option value="">ALL SUB-MODULES</option>
            {modulesList.map((mod) => (
              <option key={mod} value={mod}>{mod}</option>
            ))}
          </select>
        </div>

        {/* Severity filter */}
        <div className="space-y-1">
          <label className="text-[9px] text-slate-500 font-extrabold uppercase font-mono tracking-widest block">EVENT SEVERITY</label>
          <select
            value={severityFilter}
            onChange={(e: any) => setSeverityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-950 hover:border-slate-905 bg-slate-950/40 rounded-xl text-xs font-mono text-slate-300 focus:outline-none cursor-pointer transition-all"
          >
            <option value="">ALL THREAT SEVERITIES</option>
            <option value="Low">LOW SEVERITY</option>
            <option value="Medium">MEDIUM SEVERITY</option>
            <option value="High">HIGH SEVERITY</option>
            <option value="Critical">CRITICAL THREATS</option>
          </select>
        </div>

        {/* Verification Status filter */}
        <div className="space-y-1">
          <label className="text-[9px] text-slate-500 font-extrabold uppercase font-mono tracking-widest block">HAIN INTEGRITY SEAL</label>
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-950 hover:border-slate-905 bg-slate-950/40 rounded-xl text-xs font-mono text-slate-300 focus:outline-none cursor-pointer transition-all"
          >
            <option value="">ALL SEAL CONDITIONS</option>
            <option value="Verified">VERIFIED & LINKED</option>
            <option value="Pending">PENDING AUDIT</option>
            <option value="Tampered">INTEGRITY FAILURE</option>
          </select>
        </div>

      </div>
    </div>
  );
}
