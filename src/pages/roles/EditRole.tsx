import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  RefreshCw,
  BadgeAlert,
  Lock
} from "lucide-react";
import { SecureFlowApiService } from "../../services/user-role.service";
import { RoleDTO } from "../../types/user-role";
import { cn } from "@/lib/utils";

// Grouped Permission Definitions matching system structure
const SYSTEM_PERMISSION_GROUPS = [
  {
    module: "dashboard",
    title: "Dashboard & Home Modules",
    items: [
      { key: "dashboard.read", label: "Read KPIs & Command Data" },
      { key: "dashboard.write", label: "Edit Dashboard Layout Frames" }
    ]
  },
  {
    module: "projects",
    title: "Ledger Projects Management",
    items: [
      { key: "projects.read", label: "Read Projects & Metrics" },
      { key: "projects.write", label: "Create Ledger Project Files" },
      { key: "projects.update", label: "Modify Parameters & Sync Files" },
      { key: "projects.delete", label: "Purge & Erase Ledger Projects" }
    ]
  },
  {
    module: "tasks",
    title: "Tasks & Cryptographic Gates",
    items: [
      { key: "tasks.read", label: "View Active Targets & Tasks" },
      { key: "tasks.write", label: "Provision New Task Files" },
      { key: "tasks.update", label: "Update Completed Status / Review" },
      { key: "tasks.delete", label: "Shred Active Tasks" },
      { key: "tasks.assign", label: "Assign Developers & PM Nodes" }
    ]
  },
  {
    module: "users",
    title: "Identity & Access Directory (IAM)",
    items: [
      { key: "users.read", label: "View User Credentials Index" },
      { key: "users.write", label: "Provision & Setup User Certificates" },
      { key: "users.update", label: "Mutate Profiles, Alignments" },
      { key: "users.delete", label: "Destructive Purge / Erase Profiles" },
      { key: "users.manage", label: "Direct Suspend/Restore Controls" }
    ]
  },
  {
    module: "roles",
    title: "Roles Customization Rules (RBAC)",
    items: [
      { key: "roles.read", label: "View Active Roles Matrix" },
      { key: "roles.write", label: "Establish Custom Privilege Profiles" },
      { key: "roles.update", label: "Mutate Active Permissions Map" },
      { key: "roles.delete", label: "Remove Customs Roles Index" }
    ]
  }
];

export default function EditRole() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("indigo");
  const [accessLevel, setAccessLevel] = useState<RoleDTO["accessLevel"]>("Reviewer / Read Only");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoleAndFill = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const r = await SecureFlowApiService.getRoleById(id);
        if (r) {
          setName(r.name);
          setDescription(r.description);
          setColor(r.color);
          setAccessLevel(r.accessLevel);
          setSelectedPermissions(r.permissions || []);
        } else {
          setError(`Specified RBAC Role profile with UID "${id}" is non-existent within directory.`);
        }
      } catch (err: any) {
        setError(err?.message || "Failure prefilling role metrics.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoleAndFill();
  }, [id]);

  const handleTogglePermission = (key: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleSelectAll = () => {
    const allKeys = SYSTEM_PERMISSION_GROUPS.flatMap((g) => g.items.map((i) => i.key));
    setSelectedPermissions(allKeys);
  };

  const handleClearAll = () => {
    setSelectedPermissions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || isSaving) return;

    if (!name.trim() || !description.trim()) {
      setError("Please outline a Role Title and purpose description.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await SecureFlowApiService.updateRole(id, {
        name,
        description,
        color,
        accessLevel,
        permissions: selectedPermissions,
        permissionsCount: selectedPermissions.length
      });
      navigate("/roles");
    } catch (err: any) {
      setError(err?.message || "Failed to commit role adjustments.");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
        <span className="text-xs text-slate-500 font-mono animate-pulse uppercase tracking-widest">Compiling Role Criteria...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <button
          onClick={() => navigate("/roles")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#03060c] border border-slate-900 rounded-lg text-slate-400 hover:text-white text-xs font-mono transition-colors"
        >
          <ArrowLeft size={13} />
          ROLES HOME
        </button>
        <div className="bg-rose-500/10 border border-rose-500/25 p-6 rounded-2xl text-center space-y-3">
          <BadgeAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Role Node Exception</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  const isDefaultSystemRole = ["admin", "project manager", "developer"].includes(name.toLowerCase());

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Back to roster list */}
      <div>
        <button
          onClick={() => navigate("/roles")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#03060c] border border-slate-900 rounded-lg text-slate-400 hover:text-white text-xs font-mono transition-colors"
        >
          <ArrowLeft size={13} />
          ROLES HOME
        </button>
      </div>

      {/* Header Panel */}
      <div>
        <h1 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
          Mutate RBAC Role
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Adjust allocated active gates and descriptive metadata boundaries. Changes apply to assigned directory operators instantly.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/15 border border-rose-500/20 rounded-xl p-4 text-xs font-mono text-rose-400 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            <strong>MUTATION FAULT:</strong> {error}
          </span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Core Metadata Frame */}
        <div className="bg-[#090e1a]/80 backdrop-blur-md border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main info block: Left cols */}
          <div className="md:col-span-8 space-y-4">
            <h3 className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-[#2563eb] border-b border-slate-900/60 pb-1.5">
              1. Metadata Parameters Mod
            </h3>

            {/* Name */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
                Role Title {isDefaultSystemRole && "(SYSTEM PROTECTED NAME)"}
              </label>
              <input
                type="text"
                required
                disabled={isDefaultSystemRole}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#03060c] border border-slate-800 text-slate-150 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans font-bold disabled:opacity-45 disabled:cursor-not-allowed"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
                Boundaries & Operational Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-[#03060c] border border-slate-800 text-slate-200 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans leading-relaxed"
              />
            </div>
          </div>

          {/* Access level & Decorator: Right cols */}
          <div className="md:col-span-4 space-y-5 bg-[#03060c]/40 border border-slate-900/80 rounded-2xl p-4">
            <h3 className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-indigo-400 border-b border-slate-900/60 pb-1.5">
              Control Center
            </h3>

            {/* Access Category */}
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                System Clearance Category
              </label>
              <div className="relative">
                <select
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value as RoleDTO["accessLevel"])}
                  className="w-full bg-[#03060c] border border-slate-850 text-slate-150 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans font-semibold appearance-none"
                >
                  <option value="Reviewer / Read Only">Reviewer / Read Only</option>
                  <option value="Write & Manage">Write & Manage</option>
                  <option value="Full Control">Full Control</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-slate-500">▼</span>
              </div>
            </div>

            {/* Accent Theme Select */}
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Profile Color Flag
              </label>
              <div className="flex items-center gap-2.5 flex-wrap">
                {["indigo", "emerald", "amber", "rose"].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setColor(col)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-all relative",
                      col === "indigo" ? "bg-indigo-500" : col === "emerald" ? "bg-emerald-500" : col === "amber" ? "bg-amber-500" : "bg-rose-500",
                      color === col ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    {color === col && (
                      <Check size={11} className="text-white absolute inset-0 m-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Access Rights Checklist: Permissions Select */}
        <div className="bg-[#090e1a]/80 backdrop-blur-md border border-slate-905 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-3 gap-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <ShieldCheck size={14} />
              <h3 className="text-[10px] font-extrabold uppercase font-mono tracking-widest">
                2. Allocated Access Gates
              </h3>
            </div>

            {/* Bulk handlers */}
            <div className="flex items-center gap-2 font-mono text-[9px]">
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-2.5 py-1 rounded bg-[#03060c] border border-slate-850 hover:border-slate-850 hover:text-white transition-all text-slate-400 font-bold"
              >
                SELECT ALL INTERFACES
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-2.5 py-1 rounded bg-[#03060c] border border-slate-850 hover:border-slate-850 hover:text-white transition-all text-slate-400 font-bold"
              >
                CLEAR ALL
              </button>
            </div>
          </div>

          {/* Group lists */}
          <div className="space-y-6">
            {SYSTEM_PERMISSION_GROUPS.map((group) => (
              <div key={group.module} className="bg-[#03060c]/20 border border-slate-950 rounded-2xl p-4 space-y-3">
                <h4 className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-slate-500 pb-1.5 border-b border-slate-900/40">
                  {group.title}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {group.items.map((perm) => (
                    <label 
                      key={perm.key} 
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-xl border border-slate-950 hover:border-slate-900 bg-slate-950/20 hover:bg-slate-950/45 transition-all cursor-pointer font-sans text-xs select-none",
                        selectedPermissions.includes(perm.key) && "bg-indigo-950/5 border-indigo-500/10 hover:bg-indigo-950/10"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm.key)}
                        onChange={() => handleTogglePermission(perm.key)}
                        className="rounded bg-slate-950 border-slate-850 text-indigo-600 focus:ring-0 focus:ring-offset-0 mt-0.5 cursor-pointer shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-250 leading-tight">{perm.label}</div>
                        <div className="text-[10px] font-mono text-slate-500 mt-1 uppercase">SCOPE_KEY: {perm.key}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Discard & Save bottom panel */}
        <div className="flex items-center justify-end gap-3 bg-[#090e1a]/85 border border-slate-900 rounded-2xl p-4 shadow-md backdrop-blur-md">
          <button
            type="button"
            onClick={() => navigate("/roles")}
            className="px-4 py-2 rounded-xl border border-slate-850 bg-slate-900/40 hover:bg-slate-900 text-xs font-mono text-slate-400 hover:text-white transition-all"
          >
            DISCARD CHANGES
          </button>
          
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-black shadow-lg shadow-indigo-600/15 disabled:opacity-50 transition-all font-black"
          >
            <Save size={13} />
            {isSaving ? "MUTATING SECURITY MATRIX..." : "COMMIT CHANGES"}
          </button>
        </div>

      </form>

    </div>
  );
}
