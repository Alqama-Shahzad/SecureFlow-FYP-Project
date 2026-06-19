import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../services/dashboard.service";
import { 
  StatsCard, 
  DashboardCard, 
  ChartCard, 
  Timeline, 
  ProjectSummary, 
  TaskSummary, 
  HealthIndicator, 
  QuickActionCard,
  SkeletonKPI,
  SkeletonChart,
  EmptyState,
  ErrorComponent
} from "../../components/dashboard/ReusableComponents";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { ShieldCheck, Plus, Users, Bell, AlertTriangle, Play, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminDashboard() {
  const [interactiveProjects, setInteractiveProjects] = useState<any[]>([]);
  const [interactiveUsers, setInteractiveUsers] = useState<any[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Active triggers for action forms
  const [activeForm, setActiveForm] = useState<"project" | "user" | "alerts" | null>(null);
  
  // Form input states
  const [newProjName, setNewProjName] = useState("");
  const [newProjCode, setNewProjCode] = useState("");
  const [newProjLead, setNewProjLead] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"Admin" | "Project Manager" | "Developer">("Developer");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: dashboardService.getAdminDashboard,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonKPI key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <SkeletonChart />
            <div className="h-44 bg-slate-900/50 rounded-xl animate-pulse" />
          </div>
          <div className="lg:col-span-4 h-[450px] bg-slate-900/50 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorComponent message="Error contacting remote system metrics controller." onRetry={() => refetch()} />;
  }

  // Combine static mock data with dynamically added ones for full realism
  const currentProjects = [...interactiveProjects, ...data.allProjects];
  const totalProjectsCount = data.kpis.totalProjects + interactiveProjects.length;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName || !newProjCode) return;

    const newProj = {
      id: "interactive-proj-" + Date.now(),
      name: newProjName,
      code: newProjCode.toUpperCase(),
      progress: 0,
      status: "active" as const,
      securityCompliance: 100.0,
      lead: newProjLead || "Kaelen Mercer",
      tasksCount: { total: 0, active: 0, completed: 0 },
      lastUpdated: new Date().toISOString()
    };

    setInteractiveProjects(prev => [newProj, ...prev]);
    setSuccessToast(`Project ${newProj.code} committed to SDLC register with 100% compliance credentials.`);
    setActiveForm(null);
    setNewProjName("");
    setNewProjCode("");
    setNewProjLead("");

    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail) return;

    const newUser = {
      email: newUserEmail,
      role: newUserRole,
      id: "interactive-usr-" + Date.now()
    };

    setInteractiveUsers(prev => [newUser, ...prev]);
    setSuccessToast(`Auth Credentials created for ${newUser.email} under policy ${newUser.role}.`);
    setActiveForm(null);
    setNewUserEmail("");

    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#090d16] border border-emerald-500/30 px-5 py-4 rounded-xl flex items-center gap-3 shadow-[0_12px_44px_rgba(16,185,129,0.25)] animate-fade-in text-xs font-mono">
          <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-extrabold shrink-0">
            <Check size={11} strokeWidth={3} />
          </div>
          <span className="text-slate-200">{successToast}</span>
        </div>
      )}

      {/* Hero Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-400 font-mono uppercase tracking-wider">
            <ShieldCheck size={13} />
            <span>SYSTEM COMMAND PORTAL</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            SecureFlow Administrative Hub
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time infrastructure health, security logs, and role provisioning console.
          </p>
        </div>

        {/* Sync telemetry */}
        <div className="flex items-center gap-2 text-xs bg-[#0b0f1a] border border-slate-800/80 px-3 py-1.5 rounded-lg text-slate-400 font-mono whitespace-nowrap">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-1" />
          <span>Sync Status: ACTIVE // ISO-27001</span>
        </div>
      </div>

      {/* KPI stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
        <StatsCard label="Total Users" value={84 + interactiveUsers.length} iconName="totalUsers" change="+2 addition" changeType="positive" />
        <StatsCard label="Total Projects" value={totalProjectsCount} iconName="totalProjects" change="+1 created" changeType="positive" />
        <StatsCard label="Active Tasks" value={data.kpis.activeTasks} iconName="activeTasks" change="18 active" changeType="neutral" />
        <StatsCard label="Security Score" value={`${data.kpis.securityComplianceScore}%`} iconName="securityScore" change="+0.4% boost" changeType="positive" />
        <StatsCard label="IDS Alerts" value={data.kpis.idsAlertsCount} iconName="idsAlerts" change="WAF protected" changeType="positive" />
        <StatsCard label="System Uptime" value={data.kpis.systemUptime} iconName="systemUptime" change="SLAs Met" changeType="positive" />
      </div>

      {/* Quick Action Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <QuickActionCard title="Register New Project" description="Commit a new high-trust banking project parameters" icon="createProject" onClick={() => setActiveForm(activeForm === "project" ? null : "project")} />
        <QuickActionCard title="Register New User" description="Issue crypto login details for a staff developer" icon="createUser" onClick={() => setActiveForm(activeForm === "user" ? null : "user")} />
        <QuickActionCard title="Trigger Penetration Scan" description="Dispatch automated OWASP check on CBP endpoint" icon="assignTask" onClick={() => setActiveForm(activeForm === "alerts" ? null : "alerts")} />
      </div>

      {/* Reactive Dialog forms for Action simulation */}
      {activeForm && (
        <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-6 shadow-2xl animate-fade-in relative overflow-hidden">
          {/* subtle background glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />

          {activeForm === "project" ? (
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Create High-Trust Project Profile</h3>
                <p className="text-xs text-slate-400 mt-1">This registers a compliance profile inside the ledger sync vault.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Project Name</label>
                  <input required value={newProjName} onChange={e => setNewProjName(e.target.value)} type="text" placeholder="Corporate Cash Account" className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-200 p-2 rounded-lg outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Project Code (ticker)</label>
                  <input required value={newProjCode} onChange={e => setNewProjCode(e.target.value)} type="text" placeholder="CCA" className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-200 p-2 rounded-lg outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Lead PM</label>
                  <input value={newProjLead} onChange={e => setNewProjLead(e.target.value)} type="text" placeholder="Sarah Jenkins" className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-200 p-2 rounded-lg outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setActiveForm(null)} className="px-4 py-1.5 text-xs text-slate-400 hover:text-white uppercase font-mono font-bold tracking-wider">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-500 font-mono font-bold uppercase tracking-wider rounded-lg">Commit Project</button>
              </div>
            </form>
          ) : activeForm === "user" ? (
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Issue Secure Session User</h3>
                <p className="text-xs text-slate-400 mt-1">This simulates role-based authorization token emission.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">User Email</label>
                  <input required value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} type="email" placeholder="senior_engineer@secureflow.app" className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-200 p-2 rounded-lg outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Assigned Role Profile</label>
                  <select value={newUserRole} onChange={e => setNewUserRole(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-200 p-2 rounded-lg outline-none">
                    <option value="Admin">Admin (Full System Credentials)</option>
                    <option value="Project Manager">Project Manager (Metric & Team Assignment)</option>
                    <option value="Developer">Developer (Daily Task logs)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setActiveForm(null)} className="px-4 py-1.5 text-xs text-slate-400 hover:text-white uppercase font-mono font-bold tracking-wider">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-500 font-mono font-bold uppercase tracking-wider rounded-lg">Deploy Credentials</button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Automated Vulnerability Scanner Dispatch</h3>
                <p className="text-xs text-slate-400 mt-1 font-semibold text-emerald-400">Triggering Snort WAF engine and SonarQube hook...</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-lg space-y-2 text-xs font-mono">
                <p className="text-slate-400">&gt; npx secureflow-scanner --target https://cbp-api.banking.infra</p>
                <p className="text-slate-500">&gt; Loaded policy: OWASP-TOP10-STRICT</p>
                <p className="text-indigo-400">&gt; [OK] CORS constraints mapped, TLS ciphers fully aligned.</p>
                <p className="text-emerald-400">&gt; [OK] NO HIGHS OR CRITICALS IDENTIFIED INSIDE PORTAL HANDLER CONSTRAINTS.</p>
              </div>
              <div className="flex justify-end">
                <button onClick={() => {
                  setSuccessToast("Penetration scan verified: 0 critical vulnerabilities found.");
                  setActiveForm(null);
                  setTimeout(() => setSuccessToast(null), 4000);
                }} className="px-4 py-1.5 text-xs text-white bg-emerald-600 hover:bg-emerald-500 font-mono font-bold uppercase tracking-wider rounded-lg">Acknowledge</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Charts & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Threat Trends Area Chart (8 cols) */}
        <div className="lg:col-span-8">
          <ChartCard 
            title="SaaS Firewall Threat Telemetry Trends" 
            description="Captured scanning hooks vs. blocked payload attempts in real-time"
            extendedHeader={
              <div className="flex items-center gap-4 text-[10px] font-bold font-mono">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> BLOCKS
                </span>
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> SCAN HOOKS
                </span>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.threatTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBlocks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="time" stroke="#475569" fontSize={10} fontStyle="mono" />
                <YAxis stroke="#475569" fontSize={10} fontStyle="mono" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0d1323", borderColor: "#1e293b", borderRadius: "12px", fontSize: "11px", color: "#e2e8f0" }}
                  itemStyle={{ color: "#e2e8f0" }}
                />
                <Area type="monotone" dataKey="blockCount" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorBlocks)" />
                <Area type="monotone" dataKey="scanCount" stroke="#6366f1" strokeWidth={1.5} fillOpacity={1} fill="url(#colorScans)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* System Health Status Indicator Right (4 cols) */}
        <div className="lg:col-span-4 flex flex-col h-full justify-between">
          <DashboardCard title="Banking Host Status" description="Core microservices sandbox live checks">
            <HealthIndicator services={data.systemHealth} />
            
            <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono block">Threat Prevention State:</span>
              <div className="p-3 bg-[#0a0e1a] rounded-xl border border-slate-800/60 flex items-center justify-between">
                <span className="text-xs text-slate-300">WAF Rule Level</span>
                <span className="text-xs text-indigo-400 font-mono font-bold uppercase">STRICT COG</span>
              </div>
              <div className="p-3 bg-[#0a0e1a] rounded-xl border border-slate-800/60 flex items-center justify-between">
                <span className="text-xs text-slate-300">IDS DB Signature</span>
                <span className="text-xs text-emerald-400 font-mono font-bold uppercase">V142_OK</span>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Projects and Security Alerts lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active compliance projects (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider font-mono">SDLC Compliance Registries</h3>
              <p className="text-xs text-slate-400 mt-0.5">High audit trust security profiles active in SecureFlow databases.</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {currentProjects.slice(0, 4).map((project) => (
              <ProjectSummary key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Active Penetration Threats Warning logs (4 cols) */}
        <div className="lg:col-span-4">
          <DashboardCard title="Active Mitigated Threats" description="Logged IDS alarms requiring investigation">
            <div className="space-y-4">
              {data.recentSecurityAlerts.map((alert) => (
                <div key={alert.id} className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-start gap-3">
                  <div className={cn(
                    "p-1.5 rounded bg-rose-900/10 border border-rose-500/20 text-rose-400 shrink-0 mt-0.5",
                    alert.severity === "critical" ? "bg-rose-500/10 border-rose-500 text-rose-400 animate-pulse" : ""
                  )}>
                    <AlertTriangle size={12} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[9px] font-extrabold uppercase font-mono px-1.5 py-0.5 rounded border tracking-wider",
                        alert.severity === "critical" 
                          ? "text-rose-400 bg-rose-500/5 border-rose-500/20" 
                          : "text-amber-400 bg-amber-500/5 border-amber-500/20"
                      )}>
                        {alert.severity}
                      </span>
                      <span className="text-[9px] text-indigo-400 font-mono font-semibold">{alert.source}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{alert.message}</p>
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest font-mono mt-1 block">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

      </div>

      {/* Audit Logs bottom timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Audit Logs (8 cols) */}
        <div className="lg:col-span-8">
          <DashboardCard title="Enterprise Security Ledger" description="Immutable audit actions signed off by verified key managers">
            <Timeline 
              items={data.recentAuditLogs.map((log) => ({
                timestamp: log.timestamp,
                title: `${log.action} // ${log.role}`,
                description: `Executed on boundary node [IP: ${log.ipAddress}] targeting interface resource: ${log.resource}. Signed payload check ok.`,
                status: log.status,
                extraNode: (
                  <span className={cn(
                    "text-[8px] font-bold font-mono px-1 bg-slate-900 border px-2 py-0.5 rounded uppercase tracking-widest",
                    log.status === "success" ? "text-emerald-400 border-emerald-500/10" : "text-rose-400 border-rose-500/10"
                  )}>
                    Signature Status: {log.status}
                  </span>
                )
              }))}
            />
          </DashboardCard>
        </div>

        {/* User Active charts (4 cols) */}
        <div className="lg:col-span-4">
          <ChartCard title="Authorized Staff Activity" description="Active concurrent sessions over days of week">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.userActivityTrends} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="date" stroke="#475569" fontSize={10} fontStyle="mono" />
                <YAxis stroke="#475569" fontSize={10} fontStyle="mono" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0d1323", borderColor: "#1e293b", borderRadius: "12px", fontSize: "11px", color: "#e2e8f0" }}
                  itemStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="activeCount" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {data.userActivityTrends.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? "#6366f1" : "#1d4ed8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

      </div>

    </div>
  );
}
