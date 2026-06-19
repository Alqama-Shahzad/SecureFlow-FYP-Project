import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../services/dashboard.service";
import { 
  StatsCard, 
  DashboardCard, 
  ChartCard, 
  ActivityFeed, 
  ProjectSummary, 
  TaskSummary,
  SkeletonKPI,
  SkeletonChart,
  EmptyState,
  ErrorComponent
} from "../../components/dashboard/ReusableComponents";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Line
} from "recharts";
import { ShieldCheck, Plus, Check, Play, FileText, Download, Calendar, Users, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PMDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Forms states
  const [taskTitle, setTaskTitle] = useState("");
  const [taskProj, setTaskProj] = useState("CBP");
  const [taskAssignee, setTaskAssignee] = useState("Kaelen Mercer");
  const [taskPriority, setTaskPriority] = useState<"critical" | "high" | "medium" | "low">("high");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["pmDashboard"],
    queryFn: dashboardService.getProjectManagerDashboard,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonKPI key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <SkeletonChart />
          </div>
          <div className="lg:col-span-4 h-[400px] bg-slate-900/50 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorComponent message="Error loading Project Manager pipeline logs." onRetry={() => refetch()} />;
  }

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    // Simulate task assignment logs
    setSuccessToast(`Secure gate task assigned to ${taskAssignee} for project ${taskProj}. Dispatch token submitted.`);
    setIsAssigningTask(false);
    setTaskTitle("");

    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      const newReport = {
        id: "rep-interactive-" + Date.now(),
        title: "SOC-2 Interactive SDLC Verification Sign-off Audit",
        generatedOn: new Date().toISOString(),
        scope: "Secured Compliance sandbox build"
      };
      setReports(prev => [newReport, ...prev]);
      setIsGeneratingReport(false);
      setSuccessToast("High-trust SOC-2 compliance report signed off and added to ledger audit vault!");
      setTimeout(() => setSuccessToast(null), 4000);
    }, 1200);
  };

  const allReports = [...reports, ...data.reportsSummary];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#090d16] border border-indigo-500/30 px-5 py-4 rounded-xl flex items-center gap-3 shadow-[0_12px_44px_rgba(99,102,241,0.25)] animate-fade-in text-xs font-mono">
          <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-extrabold shrink-0">
            <Check size={11} strokeWidth={3} />
          </div>
          <span className="text-slate-200">{successToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#10b981] font-mono uppercase tracking-wider">
            <ShieldCheck size={13} />
            <span>PROJECT & TEAM CONTROL DESK</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            PM Governance Control Desk
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Reconcile secure delivery pipelines, monitor task velocity, and emit SOC-3 compliant SDLC snapshots.
          </p>
        </div>

        {/* Action picker shortcuts */}
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAssigningTask(!isAssigningTask)} 
            className="px-4 py-2 text-xs font-extrabold font-mono uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2 shadow transition-all"
          >
            <Plus size={14} /> Assign Task
          </button>
          <button 
            onClick={handleGenerateReport} 
            disabled={isGeneratingReport}
            className="px-4 py-2 text-xs font-extrabold font-mono uppercase tracking-wider bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isGeneratingReport ? "Compiling SOC-2..." : "Compile SOC-2 Sign-off"}
          </button>
        </div>
      </div>

      {/* Task Drawer overlay form */}
      {isAssigningTask && (
        <form onSubmit={handleAssignTask} className="p-6 bg-[#0c1223] border border-slate-800 rounded-2xl shadow-xl space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Assign Secure Compliance Task</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Task Scope Heading</label>
              <input required value={taskTitle} onChange={e => setTaskTitle(e.target.value)} type="text" placeholder="Audit TLS rotation" className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2 rounded-lg outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Module Node</label>
              <select value={taskProj} onChange={e => setTaskProj(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2 rounded-lg outline-none">
                <option value="CBP">Commercial Banking Portal (CBP)</option>
                <option value="SGR">SWIFT Gateway Reconciler (SGR)</option>
                <option value="FPLE">Fedwire Payment Liquidity Engine (FPLE)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Assignee</label>
              <select value={taskAssignee} onChange={e => setTaskAssignee(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2 rounded-lg outline-none">
                <option value="Kaelen Mercer">Kaelen Mercer (Lead Developer)</option>
                <option value="Liam Henderson">Liam Henderson (Crypto Architect)</option>
                <option value="Elena Petrova">Elena Petrova (Staff Engineer)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Risk Level</label>
              <select value={taskPriority} onChange={e => setTaskPriority(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2 rounded-lg outline-none">
                <option value="critical">Critical (Remediation Required)</option>
                <option value="high">High Level</option>
                <option value="medium">Medium Level</option>
                <option value="low">Standard Check</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3.5">
            <button type="button" onClick={() => setIsAssigningTask(false)} className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Cancel</button>
            <button type="submit" className="px-4 py-1.5 text-xs font-bold font-mono uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg">Dispatch Assignment</button>
          </div>
        </form>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatsCard label="Managed Projects" value={data.kpis.assignedProjects} iconName="assignedProjects" change="3 Active Modules" changeType="neutral" />
        <StatsCard label="Team Members" value={data.kpis.teamMembers} iconName="teamMembers" change="14 Dev Nodes" changeType="positive" />
        <StatsCard label="Active Tasks" value={data.kpis.activeTasks} iconName="activeTasks" change="12 Tickets" changeType="neutral" />
        <StatsCard label="Upcoming Deadlines" value={data.kpis.upcomingDeadlines} iconName="upcomingDeadlines" change="3 Critical Paths" changeType="negative" />
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Project progress com-posed chart (8 cols) */}
        <div className="lg:col-span-8">
          <ChartCard 
            title="Active Modules Completion & Compliance Rates" 
            description="Comparison of deliverable completion percentage against cryptological gate index checks"
            extendedHeader={
              <div className="flex items-center gap-4 text-[10px] font-extrabold font-mono">
                <span className="flex items-center gap-1 text-indigo-400">
                  <span className="w-1.5 h-1.5 rounded bg-indigo-600 inline-block" /> PROGRESS
                </span>
                <span className="flex items-center gap-1 text-[#10b981]">
                  <span className="w-1.5 h-1.5 rounded bg-emerald-500 inline-block" /> COMPLIANCE GATE %
                </span>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.projectProgress} margin={{ top: 10, right: -5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="project" stroke="#475569" fontSize={9} fontStyle="mono" />
                <YAxis stroke="#475569" fontSize={9} fontStyle="mono" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0d1323", borderColor: "#1e293b", borderRadius: "12px", fontSize: "11px", color: "#e2e8f0" }}
                  itemStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="progress" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={35} />
                <Line type="monotone" dataKey="compliance" stroke="#10b981" strokeWidth={3} dot={{ stroke: "#059669", strokeWidth: 2, r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Team Activity Feed (4 cols) */}
        <div className="lg:col-span-4">
          <DashboardCard title="Team Broadcast Activity" description="Synchronous commits and audit logs list">
            <ActivityFeed items={data.activityFeed} />
          </DashboardCard>
        </div>
      </div>

      {/* Projects tracking list */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 uppercase tracking-widest font-mono">Project Delivery Streams</h3>
          <p className="text-xs text-slate-400 mt-0.5">Live monitoring of progress index, lead directors, and secure release gates.</p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {data.projectsList.map((project) => (
            <ProjectSummary key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Side-by-side performance ledger & reports */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Team Productivity Bar Matrix (8 cols) */}
        <div className="lg:col-span-8">
          <ChartCard 
            title="Team Code Velocity Matrix" 
            description="Number of securely closed tasks compared against code-review tasks queued"
            extendedHeader={
              <div className="flex items-center gap-4 text-[10px] font-bold font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 bg-[#10b981] inline-block" /> CLOSED TASKS
                </span>
                <span className="flex items-center gap-1.5 text-amber-500">
                  <span className="w-1.5 h-1.5 bg-amber-500 inline-block" /> REVIEW STANDBY
                </span>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.teamPerformance} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="name" stroke="#475569" fontSize={9} fontStyle="mono" />
                <YAxis stroke="#475569" fontSize={9} fontStyle="mono" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0d1323", borderColor: "#1e293b", borderRadius: "12px", fontSize: "11px", color: "#e2e8f0" }}
                  itemStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="completedTasks" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="reviewTasks" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Reports ledger (4 cols) */}
        <div className="lg:col-span-4">
          <DashboardCard title="Q3 Regulatory Audit Records" description="Cryptographically signed compliance PDF templates">
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto">
              {allReports.map((report) => (
                <div key={report.id} className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between gap-3 group hover:border-slate-800 transition-colors">
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-200 leading-tight group-hover:text-indigo-400 transition-colors truncate">{report.title}</h5>
                    <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider block mt-1">Generated: Q3-2026 // {report.scope}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setSuccessToast(`Initiated encrypted download handler for ${report.title}`);
                      setTimeout(() => setSuccessToast(null), 3500);
                    }}
                    className="p-2 rounded-lg bg-[#0b0f1a] hover:bg-indigo-600/10 hover:text-indigo-400 text-slate-400 border border-slate-800 transition-colors shrink-0"
                  >
                    <Download size={12} />
                  </button>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

      </div>

      {/* Deadlines Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
        
        {/* Project Completion statistics & Upcoming deadlines List */}
        <div className="lg:col-span-12">
          <DashboardCard title="Urgent Compliance Deadlines" description="Secure-point and audit schedules that are nearing expiration">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.deadlinesList.map((dl) => (
                <div key={dl.taskId} className="p-4 bg-rose-950/10 border border-rose-500/20 rounded-xl relative overflow-hidden flex flex-col justify-between space-y-3">
                  {/* Subtle alarm dot */}
                  <div className="absolute top-3 right-3 flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold font-mono text-rose-400 bg-rose-950 border border-rose-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest w-max block">
                      Target: {dl.projectCode}
                    </span>
                    <h4 className="text-xs font-bold text-slate-200 pt-1 leading-snug">
                      {dl.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-rose-500/10">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar size={11} className="text-rose-400" />
                        {new Date(dl.dueDate).toLocaleDateString([], { month: "short", day: "numeric", weekday: "short" })}
                    </span>
                    <span className="font-extrabold uppercase font-mono text-rose-400 tracking-widest text-[9px]">LOCKED GATE</span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

      </div>

    </div>
  );
}
