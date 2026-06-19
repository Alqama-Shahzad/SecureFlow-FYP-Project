import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Grid, 
  List, 
  RefreshCw, 
  AlertTriangle,
  Fingerprint,
  SlidersHorizontal,
  LayoutGrid
} from "lucide-react";
import { SecureFlowApiService } from "../../services/user-role.service";
import { RoleDTO } from "../../types/user-role";
import RoleCard from "../../components/roles/RoleCard";
import { cn } from "@/lib/utils";

export default function RolesList() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters state
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchRoles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SecureFlowApiService.getRoles();
      setRoles(data);
    } catch (err: any) {
      setError(err?.message || "Failed to compile privilege role rosters.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Filter roles list
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch = 
        search === "" ||
        role.name.toLowerCase().includes(search.toLowerCase()) ||
        role.description.toLowerCase().includes(search.toLowerCase()) ||
        role.accessLevel.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [roles, search]);

  // Action methods
  const handleEdit = (id: string) => {
    navigate(`/roles/${id}/edit`);
  };

  const handleDuplicate = async (id: string) => {
    try {
      const copied = await SecureFlowApiService.duplicateRole(id);
      if (copied) {
        await fetchRoles(); // reload list
      }
    } catch (err: any) {
      alert(`Role duplication failure: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await SecureFlowApiService.deleteRole(id);
      if (success) {
        await fetchRoles(); // reload list
      }
    } catch (err: any) {
      alert(`Role deletion abort: ${err.message}`);
    }
  };

  const handleConfigureMatrix = (roleName: string) => {
    // Navigate to Permission Matrix with target role preselected
    navigate(`/permissions?role=${encodeURIComponent(roleName)}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#2563eb]/10 text-indigo-400 border border-indigo-500/15">
              <ShieldCheck size={16} />
            </span>
            <div className="text-[10px] font-extrabold uppercase tracking-widest font-mono text-indigo-400">
              Role-Based Access Control Console (RBAC)
            </div>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-1 font-sans">
            Roles & System Permissions
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Establish, clone, and configure customized security profiles to match institutional compliance frameworks.
          </p>
        </div>

        {/* Create button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate("/permissions")}
            className="px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-xs font-mono text-slate-400 hover:text-white transition-all cursor-pointer font-bold"
          >
            ENTERPRISE ACCESS MATRIX
          </button>
          
          <button
            onClick={() => navigate("/roles/create")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-black shadow-lg shadow-indigo-600/15 hover:shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <Plus size={14} />
            CREATE CUSTOM ROLE
          </button>
        </div>
      </div>

      {/* Segmented controls: Search and View switches */}
      <div className="bg-[#090e1a]/80 border border-slate-900 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md backdrop-blur-md">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search role registries, scopes, descriptive terms..."
            className="w-full bg-[#03060c] border border-slate-800 text-slate-100 placeholder-slate-600 rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
          />
        </div>

        {/* View Switches */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <span className="text-[9px] font-bold text-slate-500 font-mono uppercase mr-1">View Index:</span>
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-lg border transition-all",
              viewMode === "grid" ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-950 border-slate-900 text-slate-400 hover:text-white"
            )}
          >
            <LayoutGrid size={13} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-lg border transition-all",
              viewMode === "list" ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-950 border-slate-900 text-slate-400 hover:text-white"
            )}
            title="List style layout (Traditional dashboard)"
          >
            <List size={13} />
          </button>
        </div>
      </div>

      {/* Error layout */}
      {error && (
        <div className="bg-rose-500/15 border border-rose-500/20 rounded-xl p-4 text-xs font-mono text-rose-400 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <div className="flex-1">
            <strong>LEDGER SYNCHRONIZATION ERROR:</strong> {error}
          </div>
          <button 
            onClick={fetchRoles}
            className="p-1 px-2 border border-rose-500/20 text-rose-350 hover:text-white rounded-lg hover:bg-rose-500/10 transition-all font-bold"
          >
            RESYNC
          </button>
        </div>
      )}

      {/* Loading cards skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-[#090e1a]/40 border border-slate-850 rounded-2xl animate-pulse p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-4 bg-slate-805 rounded w-24" />
                <div className="h-6 bg-slate-805 rounded w-48" />
                <div className="h-10 bg-slate-805 rounded w-full" />
              </div>
              <div className="h-10 bg-slate-805 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredRoles.length === 0 ? (
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-12 text-center shadow-xl backdrop-blur-md">
          <Fingerprint className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">No Matching Security Profiles</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 font-sans">
            Formulate a custom system role or alter search queries in the header filter container.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        // Grid cards layout representation
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRoles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onConfigureMatrix={handleConfigureMatrix}
            />
          ))}
        </div>
      ) : (
        // List style layout representation
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/20 font-mono text-[10px] text-slate-400 tracking-wider font-bold uppercase">
                  <th className="py-4 pl-6 px-4">Role Title</th>
                  <th className="py-4 px-4">Clearance Access Level</th>
                  <th className="py-4 px-4">Description Overview</th>
                  <th className="py-4 px-4">Mapped Users</th>
                  <th className="py-4 px-4">Active Gates</th>
                  <th className="py-4 pr-6 pl-4 text-right">Controller Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 font-sans text-xs">
                {filteredRoles.map((role) => {
                  const isDefaultSystemRole = ["admin", "project manager", "developer"].includes(role.name.toLowerCase());
                  return (
                    <tr key={role.id} className="hover:bg-[#070b12]/50 transition-colors group">
                      
                      <td className="py-4 pl-6 px-4">
                        <div className="font-bold text-slate-100 group-hover:text-white flex items-center gap-2">
                          {role.name}
                          {isDefaultSystemRole && (
                            <span className="text-[7px] font-mono p-0.5 px-1 bg-indigo-950/50 border border-indigo-500/10 text-indigo-400 rounded">
                              SYSTEM
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">UID: {role.id}</div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] uppercase font-bold font-mono border tracking-wider bg-slate-900 text-slate-300 border-slate-800">
                          {role.accessLevel}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-400 font-sans max-w-[280px] truncate" title={role.description}>
                        {role.description}
                      </td>

                      <td className="py-4 px-4 text-slate-300 font-mono font-bold">{role.usersCount} units</td>
                      
                      <td className="py-4 px-4 text-slate-300 font-mono font-bold">{role.permissionsCount} gates</td>

                      <td className="py-4 pr-6 pl-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleConfigureMatrix(role.name)}
                            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-850 hover:border-slate-800 text-[10px] font-mono font-bold text-slate-300 transition-all uppercase"
                          >
                            Access Matrix
                          </button>
                          
                          <button
                            onClick={() => handleDuplicate(role.id)}
                            className="p-1 px-1.5 rounded bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white transition-all text-[11px]"
                            title="Duplicate node"
                          >
                            Copy
                          </button>

                          <button
                            onClick={() => handleEdit(role.id)}
                            className="p-1 px-1.5 rounded bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white transition-all text-[11px]"
                            title="Edit coordinates"
                          >
                            Edit
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
