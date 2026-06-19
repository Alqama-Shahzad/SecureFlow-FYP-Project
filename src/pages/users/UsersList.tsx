import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  UserPlus, 
  ShieldAlert, 
  Sparkles, 
  Activity, 
  Lock, 
  Download,
  AlertTriangle,
  RefreshCw,
  Clock,
  ShieldCheck,
  Briefcase
} from "lucide-react";
import { SecureFlowApiService } from "../../services/user-role.service";
import { UserDTO, UserRole, UserStatus } from "../../types/user-role";
import UserFilters from "../../components/users/UserFilters";
import UserTable from "../../components/users/UserTable";

export default function UsersList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SecureFlowApiService.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err?.message || "Failed to sync credential database nodes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Search text mapping
      const matchesSearch = 
        search === "" ||
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.id.toLowerCase().includes(search.toLowerCase()) ||
        u.department.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "" || u.role === roleFilter;
      const matchesStatus = statusFilter === "" || u.status === statusFilter;
      const matchesDept = departmentFilter === "" || u.department === departmentFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesDept;
    });
  }, [users, search, roleFilter, statusFilter, departmentFilter]);

  // Retrieve unique departments for filter dropdown
  const uniqueDepartments = useMemo(() => {
    const depts = users.map((u) => u.department);
    return Array.from(new Set(depts)).filter(Boolean);
  }, [users]);

  // Compute Metrics for top visual grids
  const consoleMetrics = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "Active").length;
    const suspended = users.filter((u) => u.status === "Suspended").length;
    const admins = users.filter((u) => u.role === "Admin").length;
    return { total, active, suspended, admins };
  }, [users]);

  // Action Handlers
  const handleView = (id: string) => {
    navigate(`/users/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/users/${id}/edit`);
  };

  const handleToggleStatus = async (id: string, currentStatus: UserStatus) => {
    const targetStatus: UserStatus = currentStatus === "Suspended" ? "Active" : "Suspended";
    try {
      await SecureFlowApiService.updateUser(id, { status: targetStatus });
      await fetchUsers(); // Refresh
    } catch (err: any) {
      alert(`Status mutation failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await SecureFlowApiService.deleteUser(id);
      if (success) {
        await fetchUsers();
      } else {
        alert("Action aborted. Couldn't find specified credential index.");
      }
    } catch (err: any) {
      alert(`Destructive purge failed: ${err.message}`);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
    setDepartmentFilter("");
  };

  const triggerRawExcelDump = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `secureflow_directory_audit_${Date.now()}.json`);
    dlAnchor.click();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
              <Users size={16} />
            </span>
            <div className="text-[10px] font-extrabold uppercase tracking-widest font-mono text-indigo-400">
              Identity Matrix & Access Management
            </div>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-1 font-sans">
            User Workspace Directory
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Configure system access scopes, audit activity nodes, and provision or revoke authentication clearance records.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={triggerRawExcelDump}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-xs font-mono text-slate-400 hover:text-white transition-all cursor-pointer font-bold"
            title="Download detailed master audit dump as structural JSON"
          >
            <Download size={13} />
            EXPORT DIRECTORY
          </button>

          <button
            onClick={() => navigate("/users/create")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-black shadow-lg shadow-indigo-600/15 hover:shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <UserPlus size={14} />
            PROVISION ACCOUNT
          </button>
        </div>
      </div>

      {/* Mini KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Dynamic Card 1: Total Users */}
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/15">
            <Users size={16} />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white font-mono">{isLoading ? "..." : consoleMetrics.total}</div>
            <div className="text-[9px] text-slate-500 font-mono uppercase font-bold mt-0.5">Tracked Identities</div>
          </div>
        </div>

        {/* Dynamic Card 2: Active Nodes */}
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/15">
            <ShieldCheck size={16} />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white font-mono">{isLoading ? "..." : consoleMetrics.active}</div>
            <div className="text-[9px] text-slate-500 font-mono uppercase font-bold mt-0.5">Active Nodes</div>
          </div>
        </div>

        {/* Dynamic Card 3: Suspended/Revoked */}
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-rose-500/10 text-rose-450 rounded-xl border border-rose-500/15">
            <Lock size={16} />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white font-mono">{isLoading ? "..." : consoleMetrics.suspended}</div>
            <div className="text-[9px] text-slate-500 font-mono uppercase font-bold mt-0.5">Suspended Nodes</div>
          </div>
        </div>

        {/* Dynamic Card 4: Admins */}
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/15">
            <Briefcase size={16} />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white font-mono">{isLoading ? "..." : consoleMetrics.admins}</div>
            <div className="text-[9px] text-slate-500 font-mono uppercase font-bold mt-0.5">Primacy Operators</div>
          </div>
        </div>
      </div>

      {/* Filter Dashboard panel */}
      <UserFilters
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={setDepartmentFilter}
        departments={uniqueDepartments}
        onReset={handleResetFilters}
      />

      {/* User Records Listing */}
      {error && (
        <div className="bg-rose-500/15 border border-rose-500/20 rounded-xl p-4 text-xs font-mono text-rose-400 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <div className="flex-1">
            <strong>DATABASE SYNCHRONIZATION ALARM:</strong> {error}
          </div>
          <button 
            onClick={fetchUsers}
            className="p-1 px-2 border border-rose-500/20 text-rose-300 hover:text-white rounded-lg hover:bg-rose-500/10 transition-all font-bold"
          >
            RETRY SYNC
          </button>
        </div>
      )}

      <UserTable
        users={filteredUsers}
        onView={handleView}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
