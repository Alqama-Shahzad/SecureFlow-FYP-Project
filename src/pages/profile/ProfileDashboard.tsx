import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Briefcase, 
  Activity, 
  ShieldCheck, 
  Bell, 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  Calendar, 
  Globe, 
  Sliders, 
  ArrowUpRight, 
  CheckCircle, 
  Database, 
  Edit3, 
  Lock, 
  Smartphone, 
  Cpu, 
  Heart,
  ChevronRight,
  Sparkles,
  RefreshCw,
  FolderOpen,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { useProfile } from "../../hooks/useProfileSettings";

type ActiveTab = "overview" | "projects" | "activity" | "security" | "notifications";

export default function ProfileDashboard() {
  const { data: profile, isLoading, error, refetch, isRefetching } = useProfile();
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-8 animate-fade-in text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-slate-950 rounded-full animate-pulse border border-slate-900" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-1/4 bg-slate-950 rounded animate-pulse border border-slate-900/40" />
            <div className="h-3 w-1/3 bg-slate-950 rounded animate-pulse border border-slate-900/40" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-950/40 rounded-xl border border-slate-900 animate-pulse" />
          <div className="h-32 bg-slate-950/40 rounded-xl border border-slate-900 animate-pulse" />
          <div className="h-32 bg-slate-950/40 rounded-xl border border-slate-900 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 max-w-md mx-auto mt-16 border border-slate-900 bg-[#090d16] rounded-2xl text-center space-y-4">
        <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-100">Profile Synchronization Offline</h3>
        <p className="text-xs text-slate-400">Unable to retrieve certified user profile token: {(error as Error)?.message}</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-indigo-950 hover:bg-indigo-900/40 border border-indigo-500/20 text-indigo-300 text-xs rounded-xl font-semibold mx-auto block transition">
          Retry Signature Sync
        </button>
      </div>
    );
  }

  // Helper styling for statuses
  const getStatusBadge = (status: string) => {
    if (status === "Active") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono font-medium rounded-full border bg-emerald-950/40 border-emerald-500/20 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Active Service
        </span>
      );
    }
    if (status === "Suspended") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono font-medium rounded-full border bg-red-950/40 border-red-500/20 text-red-400 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          Access Suspended
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono font-medium rounded-full border bg-slate-950 border-slate-900 text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        {status}
      </span>
    );
  };

  const getRoleBadgeColor = (role: string) => {
    if (role === "Admin") return "bg-rose-950/30 text-rose-400 border border-rose-900/30";
    if (role === "Project Manager") return "bg-amber-950/30 text-amber-400 border border-amber-900/30";
    return "bg-emerald-950/30 text-emerald-400 border border-emerald-900/30";
  };

  const formatIsoDate = (isoString?: string) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in text-slate-300">
      
      {/* 1. Profile Header Row */}
      <div className="border border-slate-900 bg-[#090d16]/30 backdrop-blur-md rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-950/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-5 z-10 w-full md:w-auto">
          {/* Avatar frame */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full blur opacity-15" />
            <img 
              src={profile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
              alt={profile.fullName} 
              className="relative h-20 w-20 rounded-full border-2 border-slate-900 object-cover bg-slate-950"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-100 leading-tight">
                {profile.fullName}
              </h1>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded ${getRoleBadgeColor(profile.role)}`}>
                {profile.role}
              </span>
              {getStatusBadge(profile.status)}
            </div>

            <p className="text-xs text-slate-400 font-medium">
              {profile.position} <span className="text-slate-600">•</span> {profile.department}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Last Login: <span className="text-slate-350">{formatIsoDate(profile.lastLogin)}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Member Since: <span className="text-slate-350">{formatIsoDate(profile.createdDate).split(" at")[0]}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 z-10 w-full sm:w-auto self-stretch md:self-auto shrink-0">
          <Link 
            to="/profile/edit"
            className="flex-1 sm:flex-none text-center px-4 py-2 border border-slate-900 hover:border-slate-800 bg-[#080c14] hover:bg-slate-950 text-slate-200 rounded-lg text-xs font-semibold font-sans transition flex items-center justify-center gap-1.5"
          >
            <Edit3 className="h-3.5 w-3.5 text-indigo-400" /> Edit Profile
          </Link>
          <button 
            onClick={() => refetch()}
            disabled={isRefetching}
            className="p-2 border border-slate-900 hover:border-slate-800 bg-slate-950 rounded-lg transition text-slate-450 hover:text-slate-250 flex items-center justify-center"
            title="Force telemetry sync"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 2. Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border border-slate-900 bg-[#06080e]/40 p-4 rounded-2xl space-y-1.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block mb-3 px-2">Navigation Panels</span>
            
            {(["overview", "projects", "activity", "security", "notifications"] as ActiveTab[]).map((tab) => {
              const icons = {
                overview: User,
                projects: FolderOpen,
                activity: Activity,
                security: ShieldCheck,
                notifications: Bell
              };
              const TabIcon = icons[tab];
              
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium font-sans flex items-center justify-between transition ${
                    activeTab === tab 
                      ? "bg-indigo-950/40 text-indigo-400 border border-indigo-500/10 font-bold" 
                      : "text-slate-450 hover:text-slate-250 hover:bg-[#090d16]/30 border border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <TabIcon className={`h-4 w-4 ${activeTab === tab ? "text-indigo-400" : "text-slate-500"}`} />
                    <span className="capitalize">{tab}</span>
                  </span>
                  <ChevronRight className={`h-3 w-3 text-slate-550 transition transform ${activeTab === tab ? "translate-x-0.5 text-indigo-400" : "opacity-0 group-hover:opacity-100"}`} />
                </button>
              );
            })}
          </div>

          {/* Quick Actions Card */}
          <div className="border border-slate-910 bg-[#08050e]/30 p-4.5 rounded-2xl space-y-4">
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-indigo-400" /> Administrative Routines
            </span>
            
            <p className="text-xs text-slate-450 leading-relaxed">
              Verify security tokens, update high-assurance credentials, and modify session thresholds.
            </p>

            <div className="space-y-2 pt-1 font-sans text-xs">
              <Link 
                to="/profile/change-password"
                className="w-full flex items-center justify-between p-2.5 border border-slate-900 bg-slate-950/40 rounded-xl hover:border-slate-800 transition text-slate-300 hover:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  Credentials Rotate
                </span>
                <ArrowUpRight className="h-3 w-3 text-slate-500" />
              </Link>

              <Link 
                to="/settings/security"
                className="w-full flex items-center justify-between p-2.5 border border-slate-900 bg-slate-950/40 rounded-xl hover:border-slate-800 transition text-slate-300 hover:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Privilege Matrix Settings
                </span>
                <ArrowUpRight className="h-3 w-3 text-slate-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* Selected View Compartment */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* A. OVERVIEW VIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border border-slate-900 bg-[#090d16]/20 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-slate-200 font-sans text-sm flex items-center gap-1.5">
                  <User className="h-4 w-4 text-indigo-400" /> Core Bio Summary
                </h3>
                <p className="text-xs text-slate-350 leading-relaxed max-w-xl">
                  {profile.bio || "No custom bio compiled. Contact administrator to authorize master bio description notes."}
                </p>
              </div>

              <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6">
                <h3 className="font-bold text-slate-200 font-sans text-sm mb-5 flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-emerald-400" /> Administrative Profile Coordinates
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                  <div className="space-y-1.5">
                    <span className="block text-[10px] text-slate-500 uppercase">Primary Email Address</span>
                    <span className="flex items-center gap-2 text-slate-200 font-semibold bg-[#03060c] p-2.5 rounded-lg border border-slate-900/60 font-mono">
                      <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" /> {profile.email}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="block text-[10px] text-slate-500 uppercase">Telephone (SIP Terminal)</span>
                    <span className="flex items-center gap-2 text-slate-200 font-semibold bg-[#03060c] p-2.5 rounded-lg border border-slate-900/60">
                      <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" /> {profile.phoneNumber || "N/A"}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="block text-[10px] text-slate-500 uppercase">Federal Location (DC Region)</span>
                    <span className="flex items-center gap-2 text-slate-200 font-semibold bg-[#03060c] p-2.5 rounded-lg border border-slate-900/60">
                      <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" /> {profile.location}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="block text-[10px] text-slate-500 uppercase">System Timezone</span>
                    <span className="flex items-center gap-2 text-slate-200 font-semibold bg-[#03060c] p-2.5 rounded-lg border border-slate-900/60">
                      <Globe className="h-3.5 w-3.5 text-slate-500 shrink-0" /> {profile.timezone}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="block text-[10px] text-slate-500 uppercase">Authorized Employee ID</span>
                    <span className="text-slate-100 font-bold bg-[#040811] p-2.5 rounded-lg border border-slate-900 flex items-center gap-2">
                      <Database className="h-3.5 w-3.5 text-indigo-400" /> {profile.employeeId}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="block text-[10px] text-slate-500 uppercase">Department Cluster</span>
                    <span className="text-slate-150 font-bold bg-[#040811] p-2.5 rounded-lg border border-slate-900 flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> {profile.department}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* B. PROJECTS VIEW */}
          {activeTab === "projects" && (
            <div className="space-y-6 animate-fade-in text-sans">
              <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                    <FolderOpen className="h-4.5 w-4.5 text-indigo-400" /> Assigned Projects ({profile.projects?.length || 0})
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">Live SLA status</span>
                </div>

                {!profile.projects || profile.projects.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-slate-900 rounded-xl text-xs text-slate-550">
                    No active regulatory projects assigned to this token operator.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile.projects.map((proj) => (
                      <div key={proj.id} className="border border-slate-900 bg-slate-950/45 p-4 rounded-xl space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide leading-tight">{proj.name}</h4>
                            <span className="text-[10px] font-mono text-slate-500 block mt-1">Role: <span className="text-indigo-400">{proj.role}</span></span>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5 rounded">
                            {proj.progress}% Done
                          </span>
                        </div>

                        {/* Progress slider bar */}
                        <div className="w-full bg-[#05080e] rounded-full h-1.5">
                          <div 
                            className="bg-indigo-550 h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tasks Checklist */}
              <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" /> Active Task Inventory ({profile.tasks?.length || 0})
                  </h3>
                </div>

                {!profile.tasks || profile.tasks.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-slate-900 rounded-xl text-xs text-slate-550">
                    Task inventory buffer is empty.
                  </div>
                ) : (
                  <div className="space-y-3 font-sans text-xs">
                    {profile.tasks.map((task) => (
                      <div key={task.id} className="border border-slate-900 bg-[#040810]/45 p-3 rounded-xl flex justify-between items-center gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-550 mr-2">[{task.id}]</span>
                          <span className="text-slate-200 uppercase font-bold text-[11px] font-semibold">{task.title}</span>
                          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 pt-0.5">
                            <span>Due: {task.dueDate}</span>
                            <span>•</span>
                            <span className={task.priority === "Critical" ? "text-red-400 font-bold" : task.priority === "High" ? "text-orange-400" : "text-slate-400"}>
                              Priority: {task.priority}
                            </span>
                          </div>
                        </div>

                        <span className="px-2.5 py-0.5 font-mono text-[10px] rounded-full border bg-slate-950 border-slate-900 text-slate-400">
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* C. ACTIVITY VIEW */}
          {activeTab === "activity" && (
            <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6 animate-fade-in text-sans">
              <h3 className="font-bold text-slate-200 text-sm mb-6 flex items-center gap-1.5">
                <Activity className="h-4.5 w-4.5 text-indigo-400" /> Audit Log Activity Timeline
              </h3>

              {!profile.activities || profile.activities.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-900 rounded-xl text-xs text-slate-550">
                  Timeline activity streams are currently empty.
                </div>
              ) : (
                <div className="relative border-l-2 border-slate-900 ml-3.5 pl-6 space-y-6 font-sans">
                  {profile.activities.map((act) => {
                    const getBulletColor = (status: string, type: string) => {
                      if (status === "alert" || type === "security") return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
                      if (status === "warning") return "bg-orange-400";
                      return "bg-indigo-400";
                    };

                    return (
                      <div key={act.id} className="relative space-y-1.5">
                        {/* Timeline point */}
                        <span className={`absolute -left-9.5 top-1.5 w-3 h-3 rounded-full ${getBulletColor(act.status, act.type)}`} />

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <span className="text-xs uppercase font-extrabold text-slate-205 leading-tight">{act.action}</span>
                          <span className="text-[10px] font-mono text-slate-500">{formatIsoDate(act.timestamp)}</span>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] font-mono text-slate-550">
                          <span>Route Node: <span className="text-slate-400">{act.type}</span></span>
                          <span>SIP Device: <span className="text-slate-400">{act.device}</span></span>
                          <span>IP Origin: <span className="text-slate-405 font-semibold">{act.ipAddress}</span></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* D. SECURITY VIEW (Sessions & Devices) */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-fade-in font-sans">
              
              <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6">
                <h3 className="font-bold text-slate-200 text-sm mb-4 flex items-center gap-1.5">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" /> Active Session Telemetry
                </h3>
                
                <p className="text-xs text-slate-450 leading-relaxed mb-5">
                  Any unrecognized device identifier session below can be immediately expired and force-signed out using token revocation schemas in settings.
                </p>

                <div className="space-y-3 text-xs">
                  <div className="border border-emerald-500/10 bg-emerald-950/15 p-4 rounded-xl flex justify-between items-center gap-4">
                    <div className="space-y-1">
                      <span className="font-extrabold text-slate-150 uppercase text-[11px] flex items-center gap-1.5">
                        <Cpu className="h-3.5 w-3.5 text-emerald-400" /> MacOS Workstation - Chrome Enterprise (Current)
                      </span>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500">
                        <span>Terminal IP: 10.0.4.150</span>
                        <span>•</span>
                        <span>Region: New York, USA</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 animate-pulse">
                      Active
                    </span>
                  </div>

                  <div className="border border-slate-905 bg-slate-950/30 p-4 rounded-xl flex justify-between items-center gap-4">
                    <div className="space-y-1">
                      <span className="font-extrabold text-slate-200 uppercase text-[11px] flex items-center gap-1.5">
                        <Smartphone className="h-3.5 w-3.5 text-indigo-400" /> iPad Pro - Enterprise MDM Safari
                      </span>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500">
                        <span>Terminal IP: 172.16.50.8</span>
                        <span>•</span>
                        <span>Last Checked: 2 hours ago</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono text-[9px] text-slate-500 border border-slate-900 uppercase">
                      Offline
                    </span>
                  </div>
                </div>
              </div>

              {/* Password state and Recommendations */}
              <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6">
                <h3 className="font-bold text-slate-200 text-sm mb-4">Historical Credentials Integrity</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900">
                    <span className="text-[10px] font-mono text-slate-550 block uppercase">LAST CREDENTIAL CHANGE</span>
                    <span className="text-slate-100 font-bold font-mono text-xs block mt-1">2026-03-10T14:22:00Z</span>
                    <p className="text-[10.5px] text-slate-450 mt-1">Minimum 90-day password strict rotation enforcement cycle is active.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900">
                    <span className="text-[10px] font-mono text-slate-550 block uppercase">MUTUAL AUTHS STATUS</span>
                    <span className="text-emerald-400 font-bold font-sans text-xs block mt-1">2FA/MFA Enforced</span>
                    <p className="text-[10.5px] text-slate-450 mt-1">Duo/YubiKey physical hardware key verification validated for DC nodes.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* E. NOTIFICATIONS PREVIEW */}
          {activeTab === "notifications" && (
            <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6 animate-fade-in font-sans">
              <h3 className="font-bold text-slate-200 text-sm mb-5 flex items-center gap-1.5">
                <Bell className="h-4.5 w-4.5 text-indigo-400" /> Notifications Feed Statistics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
                <div className="border border-slate-900 bg-slate-950/40 p-4 rounded-xl">
                  <span className="text-2xl font-extrabold text-indigo-400 block">4</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Unread alerts buffer</span>
                </div>
                <div className="border border-slate-900 bg-slate-950/40 p-4 rounded-xl">
                  <span className="text-2xl font-extrabold text-emerald-400 block">30</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Silenced in last 48h</span>
                </div>
                <div className="border border-slate-900 bg-slate-950/40 p-4 rounded-xl">
                  <span className="text-2xl font-extrabold text-rose-500 block">1</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Critical SRE fault logged</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-start border-b border-sidebar-border-muted pb-3">
                  <div>
                    <span className="font-bold text-slate-200 block uppercase text-[11px] leading-snug">Email alerts state</span>
                    <p className="text-slate-500 text-[10.5px]">Master copies transmitted to standard authorized inbox vectors.</p>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-[9px] uppercase text-emerald-400 bg-emerald-950/10 border border-emerald-900/30">
                    Enforced
                  </span>
                </div>

                <div className="flex justify-between items-start pt-2">
                  <div>
                    <span className="font-bold text-slate-200 block uppercase text-[11px] leading-snug">SMS PagerDuty alarms</span>
                    <p className="text-slate-500 text-[10.5px]">Immediate dispatch on target-101 server degradation faults.</p>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-[9px] uppercase text-slate-500 border border-slate-900">
                    Disabled
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
