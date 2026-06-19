import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  Search, 
  Save, 
  RotateCcw, 
  HelpCircle, 
  ArrowLeft,
  Check, 
  AlertCircle,
  HelpCircleIcon,
  Maximize2,
  Minimize2,
  Cpu,
  RefreshCw,
  FolderLock
} from "lucide-react";
import { SecureFlowApiService } from "../../services/user-role.service";
import { PermissionMatrixRow, UserRole } from "../../types/user-role";
import { cn } from "@/lib/utils";

const ALL_COLUMNS = [
  { key: "read" as const, label: "Read", desc: "View indices & stats panels" },
  { key: "write" as const, label: "Write", desc: "Initiate & provision data" },
  { key: "update" as const, label: "Update", desc: "Mutate existing properties" },
  { key: "delete" as const, label: "Delete", desc: "Destructive discard & shred" },
  { key: "approve" as const, label: "Approve", desc: "Approve compliance gates" },
  { key: "export" as const, label: "Export", desc: "Download master audit dump" },
  { key: "assign" as const, label: "Assign", desc: "Link operators to nodes" },
  { key: "manage" as const, label: "Manage", desc: "Complete administrative control" }
];

export default function PermissionMatrix() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active role tab pre-filled from searchParams or defaulted to Admin
  const activeRoleTab = (searchParams.get("role") || "Admin") as UserRole;

  const [searchQuery, setSearchQuery] = useState("");
  const [matrixRows, setMatrixRows] = useState<PermissionMatrixRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick info tooltip card state in columns
  const [hoveredHeader, setHoveredHeader] = useState<string | null>(null);

  const fetchMatrix = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SecureFlowApiService.getPermissionMatrixForRole(activeRoleTab);
      setMatrixRows(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load permissions matrix index.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, [activeRoleTab]);

  // Tab switch handler
  const handleTabChange = (role: UserRole) => {
    setSearchParams({ role });
    setSaveSuccess(false);
  };

  // Toggle single cell
  const handleToggleCell = (module: string, permissionKey: keyof PermissionMatrixRow["permissions"]) => {
    setSaveSuccess(false);
    setMatrixRows((prev) =>
      prev.map((row) => {
        if (row.module === module) {
          return {
            ...row,
            permissions: {
              ...row.permissions,
              [permissionKey]: !row.permissions[permissionKey]
            }
          };
        }
        return row;
      })
    );
  };

  // Toggle entire row select/deselect
  const handleToggleRow = (module: string, allChecked: boolean) => {
    setSaveSuccess(false);
    setMatrixRows((prev) =>
      prev.map((row) => {
        if (row.module === module) {
          return {
            ...row,
            permissions: {
              read: !allChecked,
              write: !allChecked,
              update: !allChecked,
              delete: !allChecked,
              approve: !allChecked,
              export: !allChecked,
              assign: !allChecked,
              manage: !allChecked
            }
          };
        }
        return row;
      })
    );
  };

  // Toggle entire column select/deselect
  const handleToggleColumn = (colKey: keyof PermissionMatrixRow["permissions"], allChecked: boolean) => {
    setSaveSuccess(false);
    setMatrixRows((prev) =>
      prev.map((row) => ({
        ...row,
        permissions: {
          ...row.permissions,
          [colKey]: !allChecked
        }
      }))
    );
  };

  // Filter matrix rows based on search
  const filteredRows = useMemo(() => {
    return matrixRows.filter(
      (row) =>
        row.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.module.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [matrixRows, searchQuery]);

  // Handle Save
  const handleSaveChanges = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await SecureFlowApiService.savePermissionMatrixForRole(activeRoleTab, matrixRows);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setError(err?.message || "Failure saving current permission configurations.");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset Permissions
  const handleReset = async () => {
    if (confirm(`ADMIN ALIGNMENT RECOVERY: This will revert "${activeRoleTab}" permissions matrix back to catalog defaults. Continue?`)) {
      await fetchMatrix();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Back link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/roles")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#03060c] border border-slate-900 rounded-lg text-slate-400 hover:text-white text-xs font-mono transition-colors"
        >
          <ArrowLeft size={13} />
          ROLES DIRECTORY
        </button>
      </div>

      {/* Header Info */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#2563eb]/10 text-indigo-400 border border-indigo-500/15">
            <Cpu size={16} />
          </span>
          <div className="text-[10px] font-extrabold uppercase tracking-widest font-mono text-indigo-400">
            Enterprise Privilege Controls
          </div>
        </div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-1 font-sans">
          RBAC Access Matrix Board
        </h1>
        <p className="text-xs text-slate-400 font-sans mt-1">
          Perform high-security, column-and-row privilege configurations mapping specific user groups. Sticky table design with advanced filtering capabilities.
        </p>
      </div>

      {/* Tabs list of Roles */}
      <div className="flex border-b border-slate-900 font-mono text-[10px] tracking-wider font-extrabold uppercase overflow-x-auto select-none gap-4">
        {(["Admin", "Project Manager", "Developer"] as UserRole[]).map((role) => (
          <button
            key={role}
            onClick={() => handleTabChange(role)}
            className={cn(
              "pb-3.5 px-2.5 border-b-2 hover:text-white transition-all whitespace-nowrap",
              activeRoleTab === role ? "border-indigo-500 text-white" : "border-transparent text-slate-500"
            )}
          >
            {role} Matrix
          </button>
        ))}
      </div>

      {/* Status Indicators / Errors */}
      {error && (
        <div className="bg-rose-500/15 border border-rose-500/20 rounded-xl p-4 text-xs font-mono text-rose-400 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <div className="flex-1">
            <strong>SAVE FAULT SEQUENCE LOGGED:</strong> {error}
          </div>
          <button 
            onClick={fetchMatrix}
            className="p-1 px-2 border border-rose-500/20 text-rose-350 hover:text-white rounded-lg hover:bg-rose-500/10 transition-all font-bold"
          >
            REFRESH
          </button>
        </div>
      )}

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-xs font-mono text-emerald-400 flex items-center gap-2.5 animate-bounce">
          <Check className="w-4 h-4 shrink-0" />
          <span>
            <strong>MATRIX ALIGNMENTS COMMITTED SUCCESSFULLY.</strong> System directories synced!
          </span>
        </div>
      )}

      {/* Table search & matrix controllers panel */}
      <div className="bg-[#090e1a]/80 border border-slate-900 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md backdrop-blur-md">
        
        {/* Search row filter */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search module matrix rows..."
            className="w-full bg-[#03060c] border border-slate-800 text-slate-100 placeholder-slate-650 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
          />
        </div>

        {/* Matrix Quick Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-2 border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg text-xs font-mono transition-all"
            title="Reset active row checkboxes to saved catalog files"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET MATRIX
          </button>

          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-mono font-black rounded-lg transition-all shadow shadow-indigo-600/10 hover:shadow-indigo-500/25 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? "SYNCING GATES..." : "SAVE MATRIX CHANGES"}
          </button>
        </div>
      </div>

      {/* Screen Width Horizontal scroll warning */}
      <div className="block lg:hidden bg-indigo-950/20 border border-indigo-500/10 rounded-xl p-3 text-[10px] font-mono text-indigo-300">
        📌 Horizontal scroll and pinch-zoom enabled. Swiping enables configuration of all read-write columns.
      </div>

      {/* MATRIX EXECUTIVE DISPLAY GRID */}
      {isLoading ? (
        <div className="bg-[#090e1a]/40 border border-slate-900 rounded-2xl p-12 text-center animate-pulse space-y-4">
          <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
          <span className="text-xs text-slate-500 font-mono uppercase tracking-widest block">Building privilege board grid...</span>
        </div>
      ) : (
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              
              {/* Sticky Header Row */}
              <thead className="bg-[#04060b] border-b border-slate-900 select-none">
                <tr className="font-mono text-[10px] text-slate-400 tracking-wider font-extrabold uppercase">
                  
                  {/* Left Column Label */}
                  <th className="py-4.5 px-6 w-[200px] sticky left-0 bg-[#04060b] z-10 border-r border-[#090e1a]">
                    Module Security Bounds
                  </th>

                  {/* Dynamic checklist column headers */}
                  {ALL_COLUMNS.map((col) => {
                    const isAllChecked = filteredRows.length > 0 && filteredRows.every((r) => r.permissions[col.key]);
                    return (
                      <th 
                        key={col.key} 
                        className="py-4 px-4 text-center group cursor-pointer relative"
                        onClick={() => handleToggleColumn(col.key, isAllChecked)}
                      >
                        <div className="flex flex-col items-center gap-1 hover:text-white transition-colors">
                          <span>{col.label}</span>
                          <span className="text-[7px] text-slate-500 lowercase tracking-widest font-normal group-hover:text-indigo-400">
                            {isAllChecked ? "clear all" : "check all"}
                          </span>
                        </div>

                        {/* Tooltip hint on hover */}
                        <div className="hidden group-hover:block absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-slate-950 border border-slate-850 p-2 rounded-lg text-[8px] tracking-normal uppercase text-slate-300 w-36 text-center z-50">
                          {col.desc}
                        </div>
                      </th>
                    );
                  })}

                  {/* End Column Row Toggle Column */}
                  <th className="py-4 px-4.5 text-right w-14">
                    Row Selection
                  </th>
                </tr>
              </thead>

              {/* Matrix checkboxes cells */}
              <tbody className="divide-y divide-slate-900">
                {filteredRows.map((row) => {
                  const rowPermissions = Object.values(row.permissions);
                  const isAllCheckedOnRow = rowPermissions.length > 0 && rowPermissions.every(Boolean);

                  return (
                    <tr 
                      key={row.module} 
                      className="hover:bg-[#070b12]/30 transition-colors group text-xs text-slate-300 font-sans"
                    >
                      
                      {/* Column 1: Sticky Module Indicator */}
                      <td className="py-3.5 px-6 sticky left-0 bg-[#090e1a] z-10 font-bold border-r border-[#090e1a] group-hover:bg-[#0c1424] transition-colors">
                        <div className="text-slate-200 group-hover:text-white transition-colors font-mono">{row.displayName}</div>
                        <div className="text-[9px] text-[#2563eb] font-mono mt-0.5 lowercase">sys.{row.module}</div>
                      </td>

                      {/* Cells for read, write, etc */}
                      {ALL_COLUMNS.map((col) => {
                        const cellValue = row.permissions[col.key];
                        return (
                          <td 
                            key={col.key} 
                            className="py-3 px-4 text-center align-middle"
                          >
                            <label className="inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-slate-900/60 cursor-pointer transition-colors relative">
                              <input
                                type="checkbox"
                                checked={cellValue}
                                onChange={() => handleToggleCell(row.module, col.key)}
                                className={cn(
                                  "rounded w-4.5 h-4.5 cursor-pointer bg-[#03060c] border-[#1e293b] text-indigo-600 focus:ring-0 focus:ring-offset-0 transition-all",
                                  cellValue ? "border-indigo-500 bg-indigo-500/10 text-indigo-400" : "hover:border-slate-700"
                                )}
                              />
                            </label>
                          </td>
                        );
                      })}

                      {/* Column 3: Row Select Toggle Action */}
                      <td className="py-3.5 px-4.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleRow(row.module, isAllCheckedOnRow)}
                          className={cn(
                            "px-2 py-1 rounded inline-flex items-center gap-1 font-mono text-[9px] font-bold tracking-wide uppercase border transition-all hover:scale-105",
                            isAllCheckedOnRow 
                              ? "bg-indigo-950/40 text-indigo-400 border-indigo-500/15" 
                              : "bg-[#03060c] text-slate-400 border-slate-850 hover:border-slate-800 hover:text-white"
                          )}
                        >
                          {isAllCheckedOnRow ? "NONE" : "ALL"}
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        </div>
      )}

      {/* Bottom informational guidelines block */}
      <div className="bg-[#090e1a]/80 border border-slate-900 p-5 rounded-2xl shadow-md backdrop-blur-md flex gap-4.5">
        <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 rounded-xl leading-none h-fit">
          <FolderLock className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider font-mono text-[10px]">Understanding the Enterprise RBAC Rules</h4>
          <p className="text-slate-400 leading-relaxed font-sans text-xs">
            Assigned roles determine standard dashboard layout and feature accessibility. System guards protect default system admins from locked profiles to ensure constant system uptime. For dynamic granular access, edit individual parameters and save matrices above.
          </p>
        </div>
      </div>

    </div>
  );
}
