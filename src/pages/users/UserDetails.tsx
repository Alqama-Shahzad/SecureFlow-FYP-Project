import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Edit2, 
  UserX, 
  UserCheck, 
  Trash2, 
  Lock, 
  Activity, 
  ShieldAlert, 
  Layers, 
  CheckSquare, 
  Fingerprint, 
  Key, 
  Bell, 
  RefreshCw,
  Building,
  Mail,
  Phone,
  Server,
  Terminal,
  Clock,
  BadgeAlert
} from "lucide-react";
import { SecureFlowApiService } from "../../services/user-role.service";
import { UserDTO, UserStatus } from "../../types/user-role";
import { cn } from "@/lib/utils";

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "activity" | "permissions" | "security">("profile");

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!id) return;
      const data = await SecureFlowApiService.getUserById(id);
      if (data) {
        setUser(data);
      } else {
        setError(`Access node corresponding to UID "${id}" is non-existent within the directory.`);
      }
    } catch (err: any) {
      setError(err?.message || "Failure synchronizing ledger registry node metadata.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  // Action helpers
  const handleToggleStatus = async () => {
    if (!user) return;
    const nextStatus: UserStatus = user.status === "Suspended" ? "Active" : "Suspended";
    try {
      const updated = await SecureFlowApiService.updateUser(user.id, { status: nextStatus });
      setUser(updated);
    } catch (err: any) {
      alert(`Critical state shift failed: ${err.message}`);
    }
  };

  const handleResetPassword = () => {
    alert(`CRYPTO SYSTEM DESPATCH: Reset link and temporal authentication key dispatched to directory standard mail server vector for "${user?.fullName}".`);
  };

  const handleEdit = () => {
    if (user) navigate(`/users/${user.id}/edit`);
  };

  const handleDelete = async () => {
    if (!user) return;
    if (confirm(`ADMIN SHRED PROTOCOL: Are you 100% sure you want to permanently erase registration index "${user.fullName}"? This is non-reversible.`)) {
      try {
        await SecureFlowApiService.deleteUser(user.id);
        navigate("/users");
      } catch (err: any) {
        alert(`Destructive purge execution aborted: ${err.message}`);
      }
    }
  };

  // Format Helper
  const formatDateTime = (isoString?: string) => {
    if (!isoString) return "NEVER INITIATED";
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }) + " UTC";
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center space-y-4">
        <LoaderSpinner />
        <span className="text-xs text-slate-500 font-mono animate-pulse uppercase tracking-widest">Retrieving Credential State Modules...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <button
          onClick={() => navigate("/users")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#03060c] border border-slate-900 rounded-lg text-slate-400 hover:text-white text-xs font-mono transition-colors"
        >
          <ArrowLeft size={13} />
          DIRECTORY HOME
        </button>
        <div className="bg-rose-500/10 border border-rose-500/25 p-6 rounded-2xl text-center space-y-3">
          <BadgeAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Ledger Node Exception</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">{error || "The specified identity metadata could not be fetched."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Return to directory link */}
      <div>
        <button
          onClick={() => navigate("/users")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#03060c]/80 border border-slate-900/60 rounded-lg text-slate-400 hover:text-white text-xs font-mono transition-colors"
        >
          <ArrowLeft size={13} />
          DIRECTORY ROSTER
        </button>
      </div>

      {/* Main Grid: Left Block Profile Info / Right Block Dynamic Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: PRIMARY PROFILE CARD & CONTROLS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md relative overflow-hidden text-center">
            
            {/* Ambient subtle backglow depending on status */}
            <div className={cn(
              "absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20",
              user.status === "Active" ? "bg-emerald-500/40" : user.status === "Suspended" ? "bg-rose-500/40" : "bg-slate-500/40"
            )} />

            {/* Profile Avatar */}
            <div className="relative inline-block mx-auto">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                alt={user.fullName}
                referrerPolicy="no-referrer"
                className={cn(
                  "w-24 h-24 rounded-full object-cover border-2 shadow-2xl mx-auto",
                  user.status === "Active" ? "border-emerald-500/25" : user.status === "Suspended" ? "border-rose-500/25" : "border-slate-800"
                )}
              />
              <span className={cn(
                "absolute bottom-1 right-2 inline-block w-4 h-4 rounded-full border-2 border-[#090e1a]",
                user.status === "Active" ? "bg-emerald-500" : user.status === "Inactive" ? "bg-slate-400" : "bg-rose-500"
              )} />
            </div>

            {/* Name/UId */}
            <div className="mt-4">
              <h2 className="text-lg font-black text-white tracking-wide">{user.fullName}</h2>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">MATRIX IDENTIFIER Index: {user.id}</div>
            </div>

            {/* Role & Department pills */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded text-[9px] uppercase font-bold font-mono border tracking-wider",
                user.role === "Admin" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : user.role === "Project Manager" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              )}>
                {user.role}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] uppercase font-semibold font-mono bg-[#03060c] border border-slate-850 text-slate-400">
                {user.status}
              </span>
            </div>

            {/* Department Label */}
            <div className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs text-slate-300 font-sans border border-slate-900 bg-slate-950/40 px-3.5 py-1.5 rounded-xl w-full">
              <Building size={13} className="text-slate-500" />
              <span className="truncate">{user.department}</span>
            </div>

            {/* Quick Stats list */}
            <div className="mt-6 pt-5 border-t border-slate-900/60 divide-y divide-slate-900/40 text-left space-y-3.5 font-sans text-xs text-slate-400">
              <div className="flex items-center justify-between pb-3.5">
                <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Mail size={12} /> Email Entry
                </span>
                <span className="text-slate-300 font-mono truncate max-w-[180px]">{user.email.toLowerCase()}</span>
              </div>
              
              <div className="flex items-center justify-between pt-1 pb-3.5">
                <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Phone size={12} /> Contact Comm
                </span>
                <span className="text-slate-300 font-mono">{user.phoneNumber || "NONE SPECIFIED"}</span>
              </div>

              <div className="flex items-center justify-between pt-1 pb-3.5">
                <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Clock size={12} /> Log Index
                </span>
                <span className="text-slate-300 font-mono text-[10px]">{formatDateTime(user.lastLogin)}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Lock size={12} /> Provisioned At
                </span>
                <span className="text-slate-300 font-mono text-[10px]">{formatDateTime(user.createdDate).slice(0, 11)}</span>
              </div>
            </div>

          </div>

          {/* QUICK CONTROLLER ACTIONS PANEL */}
          <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-3">
            <h4 className="text-[9px] font-extrabold uppercase font-mono tracking-widest text-indigo-400 pb-1.5">
              Identity Control Protocol
            </h4>

            <button
              onClick={handleEdit}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-650/80 border border-indigo-500/20 text-xs font-mono text-white font-black transition-all shadow-md shadow-indigo-600/10"
            >
              <Edit2 size={13} />
              EDIT USER COORDINATES
            </button>

            <button
              onClick={handleToggleStatus}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all border text-xs font-mono font-bold",
                user.status === "Suspended" 
                  ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20" 
                  : "bg-rose-500/15 hover:bg-rose-500/25 text-rose-500 border-rose-500/20"
              )}
            >
              {user.status === "Suspended" ? (
                <>
                  <UserCheck size={13} />
                  REVOKE ACCOUNT SUSPENSION
                </>
              ) : (
                <>
                  <UserX size={13} />
                  SUSPEND ACCESS NODE
                </>
              )}
            </button>

            <button
              onClick={handleResetPassword}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#03060c] border border-slate-900 hover:border-slate-800 text-xs font-mono text-slate-400 hover:text-white transition-all"
            >
              <Terminal size={13} />
              DISPATCH PASSKEY RESET
            </button>

            <div className="h-[1px] bg-slate-900/60 my-2" />

            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-rose-950/40 bg-rose-950/20 text-xs font-mono text-rose-400 hover:bg-rose-950/40 hover:text-rose-200 transition-all font-semibold"
            >
              <Trash2 size={13} />
              PERMANENT PURGE METADATA
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: DETAILED ANALYSIS & LOGS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-900 font-mono text-[10px] tracking-wide font-extrabold uppercase overflow-x-auto select-none gap-4">
            <button
              onClick={() => setActiveTab("profile")}
              className={cn(
                "pb-3 px-2 border-b-2 hover:text-white transition-all",
                activeTab === "profile" ? "border-indigo-500 text-white" : "border-transparent text-slate-500"
              )}
            >
              Profile Overview
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={cn(
                "pb-3 px-2 border-b-2 hover:text-white transition-all",
                activeTab === "activity" ? "border-indigo-500 text-white" : "border-transparent text-slate-500"
              )}
            >
              Security Audit Timeline
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={cn(
                "pb-3 px-2 border-b-2 hover:text-white transition-all",
                activeTab === "security" ? "border-indigo-500 text-white" : "border-transparent text-slate-500"
              )}
            >
              WAF / Threat Incidents ({user.securityEvents?.length || 0})
            </button>
          </div>

          {/* TAB 1: PROFILE OVERVIEW */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-fade-in text-xs font-sans">
              
              {/* Projects Grid Section */}
              <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Layers size={14} />
                  <h3 className="text-[10px] font-extrabold uppercase font-mono tracking-widest leading-none">
                    Assigned Ledger Projects
                  </h3>
                </div>

                {!user.projects || user.projects.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-slate-900 rounded-xl bg-slate-950/20 text-slate-500 text-xs">
                    No directory sync channels attached to critical projects.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.projects.map((proj) => (
                      <div key={proj.id} className="p-4 bg-[#03060c]/60 border border-slate-900/80 rounded-xl space-y-3 relative overflow-hidden group hover:border-[#3b82f6]/20 transition-all">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[9px] font-mono text-slate-500 uppercase block">Project Module</span>
                            <h4 className="font-bold text-white text-xs mt-0.5 group-hover:text-indigo-400 transition-colors uppercase truncate max-w-[140px]">{proj.name}</h4>
                          </div>
                          <span className="bg-indigo-950/40 border border-indigo-500/10 text-[9px] px-2 py-0.5 rounded font-mono text-indigo-400 font-bold uppercase shadow">
                            {proj.role}
                          </span>
                        </div>

                        {/* Progress slider bar representation */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between items-center text-[9px] font-bold font-mono text-slate-500">
                            <span>COMPLIANCE INDEX:</span>
                            <span className="text-white text-[10px]">{proj.progress}%</span>
                          </div>
                          <div className="h-1 bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${proj.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tasks Checklist Grid */}
              <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-indigo-400">
                  <CheckSquare size={14} />
                  <h3 className="text-[10px] font-extrabold uppercase font-mono tracking-widest leading-none">
                    Active Assigned Compliance Targets
                  </h3>
                </div>

                {!user.tasks || user.tasks.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-slate-900 rounded-xl bg-slate-950/20 text-slate-500 text-xs">
                    No pending cryptographic audit targets assigned to this operator.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-900/60 font-sans text-xs">
                    {user.tasks.map((tsk) => (
                      <div key={tsk.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className={cn(
                              "text-[8px] font-bold font-mono uppercase tracking-wider px-1.5 rounded border leading-none py-0.5",
                              tsk.priority === "Critical" ? "bg-rose-500/15 text-rose-550 border-rose-500/20" : tsk.priority === "High" ? "bg-amber-500/15 text-amber-500 border-amber-500/15" : "bg-emerald-500/15 text-emerald-400 border-emerald-500/15"
                            )}>
                              {tsk.priority}
                            </span>
                            <span className="text-slate-200 font-bold tracking-wide uppercase text-[11px]">{tsk.title}</span>
                          </div>
                          <div className="text-[9px] text-slate-500 font-mono">ID: {tsk.id} • DUE: {tsk.dueDate}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border",
                            tsk.status === "In_Progress" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/15" : tsk.status === "Review" ? "bg-amber-500/10 text-amber-500 border-amber-500/15" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/15"
                          )}>
                            {tsk.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: AUDIT ACTIVITY LOGS */}
          {activeTab === "activity" && (
            <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 animate-fade-in font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2 text-indigo-400">
                <Fingerprint size={14} />
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest leading-none">
                  SecOps Cryptographic Operation Logs
                </h3>
              </div>

              {!user.activities || user.activities.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs font-mono">
                  No activity sequences recorded inside the current active ledger slot.
                </div>
              ) : (
                <div className="relative font-mono text-xs pl-4 border-l border-slate-900 space-y-6 pt-1">
                  {user.activities.map((act) => (
                    <div key={act.id} className="relative space-y-1.5">
                      
                      {/* Circle Bullet icon indicating log severity */}
                      <span className={cn(
                        "absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border border-slate-900",
                        act.status === "success" ? "bg-emerald-500" : act.status === "warning" ? "bg-amber-500 font-bold animate-pulse" : "bg-rose-500 animate-ping"
                      )} />

                      <div className="text-[10px] text-slate-500 flex items-center justify-between gap-4">
                        <span>TIMESTAMP SECURE_ISO: {formatDateTime(act.timestamp)}</span>
                        <span className="hidden sm:inline bg-slate-950 border border-slate-900 px-2 py-0.5 rounded text-[8px] tracking-widest font-extrabold uppercase">
                          COMPLY CODE: {act.type}
                        </span>
                      </div>

                      <p className="text-slate-100 font-bold uppercase tracking-wide text-[11px] leading-relaxed">
                        {act.action}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] text-[#2563eb] font-bold">
                        <span>DEVICE: {act.device}</span>
                        <span className="text-slate-500">•</span>
                        <span>NODE_IPV4: {act.ipAddress}</span>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SECURITY / THREAT EVENTS */}
          {activeTab === "security" && (
            <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 animate-fade-in font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldAlert size={14} className="animate-pulse" />
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest leading-none">
                  Threat Mitigation & Intrusions Dispatch
                </h3>
              </div>

              {!user.securityEvents || user.securityEvents.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-900 rounded-xl bg-slate-950/20 text-slate-500 text-xs">
                  Zero active threats or intrusion indicators flag for this identity block.
                </div>
              ) : (
                <div className="space-y-4">
                  {user.securityEvents.map((evt) => (
                    <div key={evt.id} className="p-4 bg-rose-950/5 border border-rose-500/10 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="bg-rose-500/10 text-rose-500 px-2.5 py-0.5 rounded border border-rose-500/20 text-[9px] font-bold uppercase tracking-widest font-mono">
                          SEVERITY: {evt.severity}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">TIME: {formatDateTime(evt.timestamp)}</span>
                      </div>

                      <h4 className="font-extrabold uppercase text-xs text-slate-200 font-mono tracking-wide">
                        {evt.event}
                      </h4>

                      <p className="text-[11px] text-slate-400 leading-normal font-sans">
                        {evt.details}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

function LoaderSpinner() {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
    </div>
  );
}
