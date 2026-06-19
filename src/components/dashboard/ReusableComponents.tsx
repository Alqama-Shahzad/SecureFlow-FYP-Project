import React from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  Users, 
  Layers, 
  CheckSquare, 
  Shield, 
  AlertTriangle, 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  ChevronRight, 
  ExternalLink,
  Plus,
  Play,
  FileCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

// 1. Generic DashboardCard (Glassmorphism layout)
interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  extra?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function DashboardCard({
  title,
  description,
  extra,
  children,
  className,
  ...props
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "bg-[#090d16]/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.4)] p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:border-indigo-500/30",
        className
      )}
      {...props}
    >
      {/* Corner glow decorative glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
      
      {(title || extra) && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/60 z-10">
          <div>
            {title && <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight uppercase">{title}</h3>}
            {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
          </div>
          {extra}
        </div>
      )}
      <div className="flex-1 flex flex-col z-10 w-full">{children}</div>
    </div>
  );
}

// Helper to resolve dynamic icons
const iconMap: Record<string, React.ComponentType<any>> = {
  totalUsers: Users,
  totalProjects: Layers,
  activeTasks: CheckSquare,
  securityScore: Shield,
  idsAlerts: AlertTriangle,
  systemUptime: Activity,
  assignedProjects: Layers,
  teamMembers: Users,
  upcomingDeadlines: AlertTriangle,
  myTasks: CheckSquare,
  completedTasks: FileCheck,
  pendingReviews: Shield
};

// 2. StatsCard
interface StatsCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  iconName: string;
  className?: string;
}

export function StatsCard({
  label,
  value,
  change,
  changeType = "neutral",
  iconName,
  className,
}: StatsCardProps) {
  const Icon = iconMap[iconName] || Shield;

  const getBadgeColors = () => {
    if (changeType === "positive") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (changeType === "negative") return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    return "bg-slate-800 text-slate-400 border-slate-700/60";
  };

  const getArrow = () => {
    if (changeType === "positive") return <ArrowUpRight size={12} className="inline mr-0.5" />;
    if (changeType === "negative") return <ArrowDownRight size={12} className="inline mr-0.5" />;
    return <Minus size={12} className="inline mr-0.5" />;
  };

  return (
    <div
      className={cn(
        "bg-[#090d16]/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.3)] relative overflow-hidden transition-all duration-300 hover:border-slate-700 group",
        className
      )}
    >
      {/* Glow highlight */}
      <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
          {label}
        </span>
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/60 text-slate-300 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all">
          <Icon size={16} />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <div className="text-3xl font-extrabold tracking-tight text-white font-sans">
          {value}
        </div>
        
        {change && (
          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border font-mono flex items-center", getBadgeColors())}>
            {getArrow()}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

// 3. ChartCard (Specific optimization for holding responsive Recharts charts inside)
interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  extendedHeader?: React.ReactNode;
}

export function ChartCard({ title, description, children, extendedHeader }: ChartCardProps) {
  return (
    <DashboardCard title={title} description={description} extra={extendedHeader}>
      <div className="h-[280px] w-full min-w-0 mt-2">
        {children}
      </div>
    </DashboardCard>
  );
}

// 4. ActivityFeed
interface ActivityItem {
  id: string;
  userEmail: string;
  avatarText: string;
  description: string;
  timestamp: string;
}

export function ActivityFeed({ items, limit = 5 }: { items?: ActivityItem[]; limit?: number }) {
  if (!items || items.length === 0) {
    return <EmptyState label="No recent activities reported." />;
  }

  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (_) {
      return timeStr;
    }
  };

  return (
    <div className="space-y-4">
      {items.slice(0, limit).map((item) => (
        <div key={item.id} className="flex gap-3 items-start group">
          <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/20 flex items-center justify-center text-indigo-300 text-xs font-bold font-mono uppercase shadow-inner shrink-0 group-hover:border-indigo-400 group-hover:bg-indigo-900 transition-all">
            {item.avatarText}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              <span className="text-slate-100 font-bold hover:underline cursor-pointer">{item.userEmail}</span>{" "}
              {item.description}
            </p>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mt-1 block">
              {formatTime(item.timestamp)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// 5. Timeline (Compliance activity / audit logging)
interface TimelineItemProps {
  timestamp: string;
  title: string;
  description: string;
  status?: "success" | "failed";
  extraNode?: React.ReactNode;
}

export function Timeline({ items }: { items: TimelineItemProps[] }) {
  if (!items || items.length === 0) {
    return <EmptyState label="No system actions recorded." />;
  }

  const formatDateTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch (_) {
      return timeStr;
    }
  };

  return (
    <div className="relative pl-4 border-l border-slate-800 space-y-6">
      {items.map((item, index) => (
        <div key={index} className="relative group">
          {/* Timeline Dot */}
          <span className={cn(
            "absolute -left-[21px] top-1 flex h-2.5 w-2.5 rounded-full border-2 border-[#060913] ring-4 ring-[#060913]",
            item.status === "failed" ? "bg-rose-500 ring-rose-500/10" : "bg-emerald-500 ring-emerald-500/10"
          )} />
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                {item.title}
              </h4>
              <span className="text-[9px] font-bold text-slate-500 font-mono uppercase whitespace-nowrap">
                {formatDateTime(item.timestamp)}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              {item.description}
            </p>
            {item.extraNode && <div className="pt-1">{item.extraNode}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// 6. ProjectSummary Container
interface ProjectListItemProps {
  key?: string | number;
  project: {
    id: string;
    name: string;
    code: string;
    progress: number;
    status: string;
    securityCompliance: number;
    lead: string;
    tasksCount: { total: number; active: number; completed: number };
  };
}

export function ProjectSummary({ project }: ProjectListItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "on-hold":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "delayed":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    }
  };

  return (
    <div className="p-3.5 bg-[#0a0f1d] border border-slate-800/80 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-slate-700">
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-200 truncate">{project.name}</span>
          <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            {project.code}
          </span>
          <span className={cn("text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border", getStatusColor(project.status))}>
            {project.status}
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          Project Lead: <span className="text-slate-300 font-semibold">{project.lead}</span>
        </p>
      </div>

      <div className="flex items-center gap-6 whitespace-nowrap">
        {/* Progress percent */}
        <div className="space-y-1 w-24">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 font-mono">
            <span>PROGRESS</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden border border-slate-800/40">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        {/* Security Compliance */}
        <div className="space-y-0.5 text-right">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">SDLC GATES</span>
          <span className={cn(
            "text-xs font-bold font-mono",
            project.securityCompliance >= 98 ? "text-emerald-400" : "text-amber-400"
          )}>
            {project.securityCompliance}% Compliance
          </span>
        </div>

        {/* Action arrow button */}
        <button className="p-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600/10 hover:text-indigo-400 border border-slate-800 text-slate-400 transition-all shrink-0">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// 7. TaskSummary Card Container
interface TaskSummaryProps {
  task: {
    id: string;
    title: string;
    projectCode: string;
    assignedTo: string;
    priority: "critical" | "high" | "medium" | "low";
    status: string;
    dueDate: string;
    commentsCount: number;
  };
}

export function TaskSummary({ task }: TaskSummaryProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      case "high":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "medium":
        return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
      default:
        return "text-slate-400 bg-slate-800 border-slate-700/60";
    }
  };

  const formatDueDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch (_) {
      return dateStr;
    }
  };

  return (
    <div className="p-3 bg-[#0a0f1d] border border-slate-800/70 rounded-xl hover:border-slate-700/80 transition-all flex items-center justify-between gap-4">
      <div className="space-y-1 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[9px] font-extrabold font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-400">
            {task.projectCode}
          </span>
          <span className={cn("text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded border tracking-wider", getPriorityColor(task.priority))}>
            {task.priority}
          </span>
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{task.status}</span>
        </div>
        <h4 className="text-xs font-semibold text-slate-200 leading-snug hover:text-indigo-400 cursor-pointer transition-colors truncate">
          {task.title}
        </h4>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span>Assignee: <strong className="text-slate-300 font-medium">{task.assignedTo}</strong></span>
          <span className="font-mono bg-slate-900 px-1 rounded text-[9px] border border-slate-800">Due {formatDueDate(task.dueDate)}</span>
        </div>
      </div>
      
      {task.commentsCount > 0 && (
        <span className="text-[10px] font-bold font-mono text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded shrink-0">
          {task.commentsCount} comments
        </span>
      )}
    </div>
  );
}

// 8. HealthIndicator Component
interface HealthIndicatorProps {
  services: {
    apiGateway: "healthy" | "degraded" | "failed";
    authService: "healthy" | "degraded" | "failed";
    idsEngine: "healthy" | "degraded" | "failed";
    databasePostgre: "healthy" | "degraded" | "failed";
  };
}

export function HealthIndicator({ services }: HealthIndicatorProps) {
  const getServiceBadgeColors = (status: "healthy" | "degraded" | "failed") => {
    if (status === "healthy") return "text-emerald-400 bg-emerald-500/5 border-emerald-500/10";
    if (status === "degraded") return "text-amber-400 bg-amber-500/5 border-amber-500/10";
    return "text-rose-400 bg-rose-500/5 border-rose-500/10";
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {Object.entries(services).map(([key, val]) => (
        <div key={key} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col justify-between space-y-2">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">
            {key.replace(/([A-Z])/g, " $1")}
          </span>
          <div className="flex items-center justify-between">
            <span className={cn("text-[10px] font-extrabold uppercase font-mono px-2 py-0.5 rounded border tracking-wider", getServiceBadgeColors(val))}>
              {val}
            </span>
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "h-2 w-2 rounded-full",
                val === "healthy" ? "bg-emerald-500 animate-pulse" : val === "degraded" ? "bg-amber-500" : "bg-rose-500"
              )} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 9. QuickActionCard
interface QuickActionCardProps {
  title: string;
  description: string;
  icon: "createProject" | "createUser" | "assignTask" | "viewsAlerts" | "generateReport";
  onClick?: () => void;
}

export function QuickActionCard({ title, description, icon, onClick }: QuickActionCardProps) {
  const getIconElement = () => {
    switch (icon) {
      case "createProject":
        return <Plus size={16} className="text-indigo-400" />;
      case "createUser":
        return <Users size={16} className="text-emerald-400" />;
      case "assignTask":
        return <Play size={16} className="text-amber-400" />;
      case "generateReport":
        return <FileCheck size={16} className="text-indigo-400" />;
      default:
        return <ExternalLink size={16} className="text-slate-400" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className="p-4 bg-[#0a0f1d] hover:bg-slate-900 border border-slate-800/85 hover:border-slate-700/80 rounded-xl text-left transition-all duration-300 group flex items-start gap-3 w-full"
    >
      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 group-hover:bg-indigo-950 group-hover:border-indigo-500/20 transition-colors shrink-0">
        {getIconElement()}
      </div>
      <div className="min-w-0">
        <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors tracking-tight">
          {title}
        </h4>
        <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
          {description}
        </p>
      </div>
    </button>
  );
}

// 10. Shimmering Skeleton UI Loaders
export function SkeletonKPI() {
  return (
    <div className="bg-[#090d16]/80 border border-slate-800/80 rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.3)] animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-24 h-2 rounded bg-slate-800" />
        <div className="w-8 h-8 rounded-xl bg-slate-800" />
      </div>
      <div className="w-16 h-8 rounded bg-slate-800" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-[#090d16]/70 border border-slate-800/80 rounded-2xl p-6 h-[340px] animate-pulse space-y-6">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="w-32 h-3 rounded bg-slate-800" />
          <div className="w-48 h-2 rounded bg-slate-800" />
        </div>
        <div className="w-12 h-6 rounded bg-slate-800" />
      </div>
      <div className="w-full h-44 rounded-xl bg-slate-900/50 border border-slate-800/80" />
    </div>
  );
}

export function SkeletonFeedItem() {
  return (
    <div className="flex gap-3 items-center animate-pulse py-1">
      <div className="w-8 h-8 rounded-lg bg-slate-800 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="w-3/4 h-2.5 rounded bg-slate-800" />
        <div className="w-1/4 h-1.5 rounded bg-slate-800" />
      </div>
    </div>
  );
}

// 11. Empty State
export function EmptyState({ label = "No records matches the active viewport." }: { label?: string }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-[#0d1323]/25 rounded-2xl border border-slate-800 border-dashed">
      <div className="p-3.5 rounded-full bg-slate-950 border border-slate-800 text-slate-500">
        <Layers size={18} />
      </div>
      <p className="text-xs text-slate-400 font-medium max-w-xs leading-relaxed">{label}</p>
    </div>
  );
}

// 12. Error Component
export function ErrorComponent({ message = "Failed to synchronize ledger data telemetry.", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="p-6 text-center space-y-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl max-w-md mx-auto">
      <div className="p-3.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/15 w-max mx-auto shadow-sm">
        <AlertTriangle size={20} />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-200">Gateway Synchronize Timeout</h4>
        <p className="text-xs text-slate-400 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-xs font-semibold uppercase font-mono tracking-wider bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
        >
          Re-establish Connection
        </button>
      )}
    </div>
  );
}
