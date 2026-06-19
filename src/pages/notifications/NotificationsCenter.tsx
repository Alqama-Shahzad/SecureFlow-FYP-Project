import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Bell, 
  Check, 
  Trash2, 
  RefreshCw, 
  AlertTriangle,
  HelpCircle,
  Filter,
  X,
  MailOpen,
  ArrowRight,
  ShieldCheck,
  AlertOctagon,
  Clock,
  Layers,
  Terminal
} from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import { CategoryBadge } from "../../components/security-shared/Badge";
import { TableSkeleton } from "../../components/security-shared/SecuritySkeletons";

export default function NotificationsCenter() {
  const navigate = useNavigate();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const { 
    data: list, 
    isLoading, 
    error, 
    refetch, 
    isRefetching, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications({
    category: selectedCategory,
    priority: selectedPriority,
    status: selectedStatus
  });

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedPriority("");
    setSelectedStatus("");
  };

  const getPriorityBadge = (priority: string) => {
    const norm = priority.toLowerCase();
    if (norm === "critical") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded bg-red-950/40 border border-red-500/20 text-red-400 font-bold animate-pulse">
          <AlertOctagon className="h-3 w-3 shrink-0" /> {priority}
        </span>
      );
    }
    if (norm === "high") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded bg-orange-950/40 border border-orange-500/20 text-orange-400">
          <AlertTriangle className="h-3 w-3 shrink-0" /> {priority}
        </span>
      );
    }
    if (norm === "medium") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded bg-amber-950/45 border border-amber-500/20 text-amber-400">
          {priority}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded bg-slate-950 border border-slate-900 text-slate-400">
        {priority}
      </span>
    );
  };

  const handleMarkOne = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markAsRead(id);
    } catch (err) {
      console.error("Mark read failed", err);
    }
  };

  const handleDeleteOne = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
    } catch (err) {
      console.error("Deletion failed", err);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error("Mark all read failed", err);
    }
  };

  const formatDistance = (isoString: string) => {
    const elapsedMs = Date.now() - new Date(isoString).getTime();
    const min = Math.floor(elapsedMs / 1000 / 60);
    if (min < 1) return "Just now";
    if (min < 60) return `${min}m ago`;
    const hours = Math.floor(min / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(isoString).toLocaleDateString([], { month: "short", day: "2-digit" });
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-900">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2.5">
            <Bell className="h-7 w-7 text-indigo-400" />
            Alerts Dispatch Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time alerts, cryptographic warnings, WAF edge block interventions, and team updates</p>
        </div>

        <div className="flex items-center gap-2.5 mt-2 sm:mt-0">
          <button 
            onClick={handleMarkAll}
            disabled={list?.filter(n => n.status === "Unread").length === 0}
            className="px-4 py-2 border border-slate-900 bg-slate-950 hover:bg-slate-900 text-slate-350 hover:text-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-40"
          >
            <MailOpen className="h-3.5 w-3.5" /> Mark All Read
          </button>
          
          <button 
            onClick={() => refetch()}
            disabled={isRefetching}
            className="p-2 border border-slate-900 bg-slate-950 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-200 transition"
            title="Force Query Dispatch"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 2. Advanced Multi-Filter controls */}
      <div className="bg-[#090d16]/40 border border-slate-905 p-5 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-400">
          <Filter className="h-3.5 w-3.5 text-indigo-400" />
          <span>Dispatch Segmenting Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#05080e] border border-slate-900 text-slate-300 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-slate-800"
            >
              <option value="">All Categories</option>
              <option value="Security">Security Only</option>
              <option value="Project">Project Updates</option>
              <option value="System">System SRE logs</option>
              <option value="Task">Task Allocations</option>
            </select>
          </div>

          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full bg-[#05080e] border border-slate-900 text-slate-300 rounded-lg p-2 text-xs outline-none"
            >
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#05080e] border border-slate-900 text-slate-300 rounded-lg p-2 text-xs outline-none"
            >
              <option value="">All Statuses</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleResetFilters}
              className="w-full px-4 py-2 border border-slate-900 bg-slate-950 hover:bg-slate-900 text-slate-450 hover:text-slate-200 rounded-lg text-xs font-semibold font-sans transition flex items-center justify-center gap-1.5"
            >
              <X className="h-3.5 w-3.5" /> Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* 3. Messaging Logs Table */}
      {isLoading ? (
        <TableSkeleton rows={4} cols={4} />
      ) : error || !list ? (
        <div className="border border-red-500/20 bg-red-950/5 rounded-2xl p-8 text-center space-y-4">
          <AlertTriangle className="h-10 w-10 text-red-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">Dispatch Offline</h3>
          <p className="text-xs text-slate-400">Telemetry connection broken: {(error as Error)?.message}</p>
        </div>
      ) : list.length === 0 ? (
        <div className="border border-slate-900 bg-[#080b13]/25 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
          <HelpCircle className="h-10 w-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">All Nodes are Clear</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Your criteria did not highlight any active alert logs. No perimeter incursions reported in this envelope.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((n) => (
            <div 
              key={n.id}
              onClick={() => n.actionUrl && navigate(n.actionUrl)}
              className={`border rounded-2xl p-5 hover:border-slate-805 transition duration-150 relative overflow-hidden group cursor-pointer ${
                n.status === "Unread" 
                  ? n.priority === "Critical"
                    ? "bg-red-950/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.03)]"
                    : "bg-[#090d16]/45 border-[#121c2f] shadow-lg shadow-[#020509]/40"
                  : "bg-[#070b12]/15 border-slate-950 opacity-60"
              }`}
            >
              {/* Optional unread pill margin accent */}
              {n.status === "Unread" && (
                <span className={`absolute left-0 top-0 bottom-0 w-1 ${
                  n.priority === "Critical" ? "bg-red-500" : n.priority === "High" ? "bg-orange-500" : "bg-indigo-550"
                }`} />
              )}

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Meta block headings */}
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <CategoryBadge label={n.category} />
                    {getPriorityBadge(n.priority)}
                    <span className="w-1 h-1 rounded-full bg-slate-900" />
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatDistance(n.timestamp)}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-150 text-sm font-sans tracking-tight leading-snug group-hover:text-slate-100 transition">
                    {n.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                    {n.description}
                  </p>

                  {/* Operational dispatch redirect triggers */}
                  {n.actionUrl && (
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 text-xs text-indigo-400 group-hover:text-indigo-350 font-semibold group-hover:underline">
                        {n.actionText || "Mitigate intrusion Logs"} <ArrowRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition" />
                      </span>
                    </div>
                  )}
                </div>

                {/* Individual Mark Actions */}
                <div className="flex items-center gap-2 shrink-0 md:self-center">
                  {n.status === "Unread" && (
                    <button
                      onClick={(e) => handleMarkOne(n.id, e)}
                      className="p-2 border border-slate-900 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-lg transition"
                      title="Silence Alert"
                    >
                      <Check className="h-4 w-4 text-emerald-400" />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDeleteOne(n.id, e)}
                    className="p-2 border border-slate-900 hover:border-slate-800 bg-slate-910 hover:bg-red-950/25 text-slate-505 hover:text-red-400 rounded-lg transition"
                    title="Dismiss permanently"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
