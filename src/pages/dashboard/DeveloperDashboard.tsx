import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../services/dashboard.service";
import { 
  StatsCard, 
  DashboardCard, 
  ChartCard, 
  ActivityFeed, 
  TaskSummary,
  SkeletonKPI,
  SkeletonChart,
  EmptyState,
  ErrorComponent
} from "../../components/dashboard/ReusableComponents";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { ShieldCheck, CheckSquare, MessageSquare, Plus, Clock, FileCheck, Check, Send, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DeveloperDashboard() {
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  // States to hold local interactive tasks so they can tick items off live!
  const [localTasks, setLocalTasks] = useState<any[]>([
    { id: "task-lh-1", title: "Enforce JWT signing algorithm HS512 with rotation hook", projectCode: "SGR", assignedTo: "Kaelen Mercer", priority: "critical", status: "in-progress", dueDate: "2026-06-20T17:00:00Z", commentsCount: 4, completed: false },
    { id: "task-lh-2", title: "Remediate open CVE-2025-4921 active check in dependencies", projectCode: "CBP", assignedTo: "Kaelen Mercer", priority: "high", status: "in-progress", dueDate: "2026-06-19T12:00:00Z", commentsCount: 2, completed: false },
    { id: "task-lh-3", title: "Verify container build memory allocations inside Dockerfile", projectCode: "CBP", assignedTo: "Kaelen Mercer", priority: "medium", status: "in-review", dueDate: "2026-06-22T12:00:00Z", commentsCount: 1, completed: true },
    { id: "task-lh-4", title: "Sanitize SQL parameters across ledger history reporting handlers", projectCode: "CALV", assignedTo: "Kaelen Mercer", priority: "high", status: "done", dueDate: "2026-06-25T12:00:00Z", commentsCount: 0, completed: true }
  ]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["developerDashboard"],
    queryFn: dashboardService.getDeveloperDashboard,
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
    return <ErrorComponent message="Error loading Developer sandbox console." onRetry={() => refetch()} />;
  }

  // Live recalculate KPIs based on interactive toggles
  const activeCount = localTasks.filter(t => !t.completed).length;
  const completedCount = localTasks.filter(t => t.completed).length + 18; // offset from history
  const reviewCount = localTasks.filter(t => t.status === "in-review").length;

  const handleToggleTask = (taskId: string) => {
    setLocalTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        setSuccessToast(nextState ? `Task marked COMPLETED. Emitted security signature check.` : `Task reverted to IN-PROGRESS. Code coverage invalidated.`);
        setTimeout(() => setSuccessToast(null), 4000);
        return {
          ...t,
          completed: nextState,
          status: nextState ? "done" : "in-progress"
        };
      }
      return t;
    }));
  };

  const handlePostComment = (e: React.FormEvent, parentTaskTitle: string) => {
    e.preventDefault();
    if (!commentText) return;

    const newComment = {
      id: "com-interactive-" + Date.now(),
      taskId: "task-lh-1",
      taskTitle: parentTaskTitle,
      author: "You (Lead Developer)",
      content: commentText,
      timestamp: new Date().toISOString()
    };

    setCommentsList(prev => [newComment, ...prev]);
    setCommentText("");
    setSuccessToast("Injected cryptographic comment on target task thread.");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const allComments = [...commentsList, ...data.recentComments];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#090d16] border border-blue-500/30 px-5 py-4 rounded-xl flex items-center gap-3 shadow-[0_12px_44px_rgba(59,130,246,0.25)] animate-fade-in text-xs font-mono">
          <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-505/20 flex items-center justify-center text-blue-400 font-extrabold shrink-0">
            <Check size={11} strokeWidth={3} />
          </div>
          <span className="text-slate-200">{successToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-blue-400 font-mono uppercase tracking-wider">
            <ShieldCheck size={13} />
            <span>DEVELOPER SANDBOX CONSOLE</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            Developer Gate Workspace
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Validate package security vulnerabilities, resolve tickets, and approve codebase changes.
          </p>
        </div>

        {/* Board picker */}
        <div className="flex gap-2">
          <button 
            onClick={() => setIsTaskModalOpen(true)} 
            className="px-4 py-2 text-xs font-extrabold font-mono uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 shadow transition-all"
          >
            <CheckSquare size={14} /> Open Task Board
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatsCard label="My Assigned Tasks" value={activeCount} iconName="myTasks" change={`${activeCount} backlog`} changeType="neutral" />
        <StatsCard label="Completed Gates" value={completedCount} iconName="completedTasks" change="+1 ticked off" changeType="positive" />
        <StatsCard label="Pending Code Reviews" value={reviewCount} iconName="pendingReviews" change="1 review pending" changeType="neutral" />
        <StatsCard label="Nearing Due Dates" value={data.kpis.upcomingDeadlines} iconName="upcomingDeadlines" change="2 crucial gates" changeType="negative" />
      </div>

      {/* Today's Tasks Interactive Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Today's Tasks list with Checkbox triggers (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest font-mono">Assigned Compliance Backlog</h3>
            <p className="text-xs text-slate-400 mt-0.5">Check off completed items to simulate automated security verification and trigger CI signatures.</p>
          </div>

          <div className="space-y-3">
            {localTasks.map((task) => (
              <div 
                key={task.id} 
                className={cn(
                  "p-4 bg-[#0a0f1d] border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all flex items-start justify-between gap-4 relative overflow-hidden group",
                  task.completed ? "opacity-70 border-emerald-500/10" : ""
                )}
              >
                {/* Status colored side highlight */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1",
                  task.priority === "critical" ? "bg-rose-500" : task.priority === "high" ? "bg-amber-500" : "bg-blue-500"
                )} />

                <div className="flex gap-3 items-start pl-1 flex-1 min-w-0">
                  <button 
                    onClick={() => handleToggleTask(task.id)}
                    className={cn(
                      "w-5 h-5 rounded-md border text-slate-950 flex items-center justify-center transition-all shrink-0 mt-0.5",
                      task.completed 
                        ? "bg-emerald-500 border-emerald-500 text-slate-950" 
                        : "bg-slate-950 border-slate-800 hover:border-blue-500 text-transparent"
                    )}
                  >
                    <Check size={14} strokeWidth={4} className={task.completed ? "text-slate-950" : "text-transparent"} />
                  </button>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-extrabold font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-400">
                        {task.projectCode}
                      </span>
                      <span className={cn(
                        "text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded border tracking-wider",
                        task.priority === "critical" ? "text-rose-400 bg-rose-500/5 border-rose-500/20" : "text-amber-400 bg-amber-500/5 border-amber-500/20"
                      )}>
                        {task.priority}
                      </span>
                      {task.completed && (
                        <span className="text-[9px] font-extrabold font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          CI_SIGN_OK
                        </span>
                      )}
                    </div>

                    <h4 className={cn(
                      "text-xs font-semibold leading-relaxed text-slate-200 group-hover:text-blue-400 transition-colors truncate",
                      task.completed ? "line-through text-slate-500" : ""
                    )}>
                      {task.title}
                    </h4>

                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                      <span>Due: {new Date(task.dueDate).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                      <span>•</span>
                      <span>Target Node: Boundary Firewall</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-slate-500 bg-slate-950 border border-slate-900 px-2 py-0.5 rounded font-mono">
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feeds (4 cols) */}
        <div className="lg:col-span-4">
          <DashboardCard title="My Pipeline Activity" description="Recent compiler pushes and branch triggers">
            <ActivityFeed items={data.activityFeed} />
          </DashboardCard>
        </div>

      </div>

      {/* Productivity and comments bottom sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Productivity lines (8 cols) */}
        <div className="lg:col-span-8">
          <ChartCard 
            title="Weekly Code Verification Logs" 
            description="Number of commits passed through SonarQube scan vs manual peer reviewers completed"
            extendedHeader={
              <div className="flex items-center gap-4 text-[10px] font-bold font-mono">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-1.5 h-1.5 bg-blue-500 inline-block" /> COMMIT VERIFICATIONS
                </span>
                <span className="flex items-center gap-1.5 text-[#10b981]">
                  <span className="w-1.5 h-1.5 bg-[#10b981] inline-block" /> PR APPROVED
                </span>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyProductivity} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="day" stroke="#475569" fontSize={9} fontStyle="mono" />
                <YAxis stroke="#475569" fontSize={9} fontStyle="mono" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0d1323", borderColor: "#1e293b", borderRadius: "12px", fontSize: "11px", color: "#e2e8f0" }}
                  itemStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="completed" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="reviewed" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Recent comments & issues list with adding comments triggers! (4 cols) */}
        <div className="lg:col-span-4">
          <DashboardCard title="Code Review Discussions" description="Comments on unresolved dependency warnings">
            <div className="space-y-4">
              
              {/* Form to append mock comments */}
              <form onSubmit={(e) => handlePostComment(e, localTasks[0].title)} className="relative">
                <input 
                  type="text" 
                  value={commentText} 
                  onChange={e => setCommentText(e.target.value)} 
                  placeholder="Post secure ledger comment..." 
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-xs text-slate-200 p-2.5 pr-10 rounded-lg outline-none" 
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-slate-900 text-blue-400">
                  <Send size={12} />
                </button>
              </form>

              <div className="space-y-3.5 max-h-[200px] overflow-y-auto divide-y divide-slate-850/50">
                {allComments.map((comment) => (
                  <div key={comment.id} className="pt-3 first:pt-0">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-slate-200">{comment.author}</span>
                      <span className="font-mono text-[9px] text-slate-500">
                        {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono font-bold text-blue-400 bg-blue-950 border border-blue-500/10 px-1 rounded block mt-0.5 truncate w-max max-w-full">
                      On to: {comment.taskTitle}
                    </span>
                    <p className="text-[11px] text-slate-400 leading-snug mt-1.5">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>
        </div>

      </div>

      {/* Task Board Modal Shortcut */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsTaskModalOpen(false)} />
          <div className="bg-[#0c1223] border border-slate-800 rounded-2xl w-full max-w-4xl shadow-[0_24px_50px_rgba(0,0,0,0.7)] flex flex-col h-[80vh] md:h-[580px] relative z-50">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Cryptographic Gate Kanban Board
              </h4>
              <button 
                onClick={() => setIsTaskModalOpen(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900"
              >
                Close Board
              </button>
            </div>

            {/* Board Column layout */}
            <div className="flex-1 p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto md:overflow-x-auto min-h-0 bg-[#060a13]/50">
              
              {/* Backlog */}
              <div className="flex flex-col space-y-3.5 h-full rounded-xl bg-slate-950/40 border border-slate-900 p-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-900">
                  <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">BACKLOG</span>
                  <span className="text-[9px] font-bold font-mono text-slate-500">1</span>
                </div>
                <div className="space-y-2 overflow-y-auto">
                  <div className="p-3 bg-[#0d1323] border border-slate-850 rounded-lg space-y-2">
                    <span className="text-[8px] font-bold text-slate-400 font-mono px-1 py-0.5 rounded bg-slate-900 border border-slate-800">SGR</span>
                    <h5 className="text-[11px] font-bold text-slate-200">Review encryption rotation intervals for SWIFT cache</h5>
                  </div>
                </div>
              </div>

              {/* In Progress */}
              <div className="flex flex-col space-y-3.5 h-full rounded-xl bg-slate-950/40 border border-slate-900 p-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-900">
                  <span className="text-[10px] font-bold text-blue-400 font-mono uppercase tracking-widest">IN PROGRESS</span>
                  <span className="text-[9px] font-bold font-mono text-blue-400">{activeCount}</span>
                </div>
                <div className="space-y-2 overflow-y-auto">
                  {localTasks.filter(t => !t.completed).map(task => (
                    <div key={task.id} className="p-3 bg-[#0d1323] border border-indigo-500/10 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-bold text-blue-400 font-mono px-1 py-0.5 rounded bg-slate-900 border border-slate-800">{task.projectCode}</span>
                        <span className="text-[8px] font-bold text-rose-500 uppercase tracking-widest font-mono">DUE SOON</span>
                      </div>
                      <h5 className="text-[11px] font-semibold text-slate-200">{task.title}</h5>
                      <button 
                        onClick={() => {
                          handleToggleTask(task.id);
                        }} 
                        className="text-[9px] font-bold uppercase font-mono bg-blue-500/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 px-2 py-1 rounded w-full text-center"
                      >
                        Pass Security scan
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Done */}
              <div className="flex flex-col space-y-3.5 h-full rounded-xl bg-slate-950/40 border border-slate-900 p-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-900">
                  <span className="text-[10px] font-bold text-emerald-400 font-mono uppercase tracking-widest">VERIFIED DONE</span>
                  <span className="text-[9px] font-bold font-mono text-emerald-400">{completedCount - 18}</span>
                </div>
                <div className="space-y-2 overflow-y-auto">
                  {localTasks.filter(t => t.completed).map(task => (
                    <div key={task.id} className="p-3 bg-slate-950/60 border border-slate-900 rounded-lg space-y-2 opacity-70">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-bold text-emerald-400 font-mono px-1 py-0.5 rounded bg-slate-900 border border-slate-800">{task.projectCode}</span>
                        <span className="text-[8px] font-extrabold text-emerald-400 uppercase tracking-widest font-mono">VERIFIED</span>
                      </div>
                      <h5 className="text-[11px] font-medium text-slate-400 line-through">{task.title}</h5>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 border-t border-slate-800 bg-[#070b13]/50 flex justify-end">
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-lg shadow-sm font-mono uppercase tracking-wider"
              >
                Return to Workspace
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
