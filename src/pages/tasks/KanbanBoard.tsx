import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  DndContext, 
  DragEndEvent, 
  useSensor, 
  useSensors, 
  PointerSensor, 
  KeyboardSensor 
} from "@dnd-kit/core";
import { 
  Plus, 
  Search, 
  FilterX, 
  RefreshCw, 
  KanbanSquare, 
  Layout, 
  SlidersHorizontal 
} from "lucide-react";
import { useTasks, useProjects } from "../../hooks/use-projects-tasks";
import { KanbanColumn } from "../../components/tasks/KanbanColumn";
import { Task, TaskStatus } from "../../types/project-task";

export default function KanbanBoard() {
  const navigate = useNavigate();
  const { tasks, isLoading, isError, updateTask, refetch } = useTasks();
  const { projects } = useProjects();

  // Search & Filters variables
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [labelFilter, setLabelFilter] = useState("All");

  // Get unique assignees
  const uniqueAssignees = useMemo(() => {
    const list = tasks.map((t) => t.assigneeName).filter(Boolean);
    return Array.from(new Set(list)) as string[];
  }, [tasks]);

  // Get unique labels
  const uniqueLabels = useMemo(() => {
    const list = tasks.flatMap((t) => t.labels).filter(Boolean);
    return Array.from(new Set(list)) as string[];
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    // Search query
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.assigneeName && t.assigneeName.toLowerCase().includes(q))
      );
    }

    // Projects Multi-filter
    if (projectFilter !== "All") {
      list = list.filter((t) => t.projectId === projectFilter);
    }

    // Priority filter
    if (priorityFilter !== "All") {
      list = list.filter((t) => t.priority === priorityFilter);
    }

    // Assignee filter
    if (assigneeFilter !== "All") {
      list = list.filter((t) => t.assigneeName === assigneeFilter);
    }

    // Label filter
    if (labelFilter !== "All") {
      list = list.filter((t) => t.labels.includes(labelFilter));
    }

    return list;
  }, [tasks, searchTerm, projectFilter, priorityFilter, assigneeFilter, labelFilter]);

  // Map into columns
  const todoTasks = useMemo(() => filteredTasks.filter((t) => t.status === "Todo"), [filteredTasks]);
  const progressTasks = useMemo(() => filteredTasks.filter((t) => t.status === "In Progress"), [filteredTasks]);
  const reviewTasks = useMemo(() => filteredTasks.filter((t) => t.status === "Review"), [filteredTasks]);
  const doneTasks = useMemo(() => filteredTasks.filter((t) => t.status === "Done"), [filteredTasks]);

  // Set up dnd-kit pointer sensors with activation constraint for smooth clicks/scrolling
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px drag required to activate drag, preventing accidental click triggers!
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Triggering on DragEnd
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    // Find the original task to see if status shifted
    const targetTask = tasks.find((t) => t.id === taskId);
    if (targetTask && targetTask.status !== newStatus) {
      try {
        await updateTask({
          id: taskId,
          fields: { status: newStatus }
        });
      } catch (err) {
        console.error("Task update mutation crashed on drag-drop:", err);
      }
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setProjectFilter("All");
    setPriorityFilter("All");
    setAssigneeFilter("All");
    setLabelFilter("All");
  };

  return (
    <div className="space-y-6">
      {/* Upper Navigation Title row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-2 uppercase tracking-wider">
            <KanbanSquare className="text-[#3b82f6]" />
            TASK KANBAN PIPELINES
          </h1>
          <p className="text-xs text-slate-405 mt-1 uppercase font-mono tracking-widest">
            Drag and drop action records across security operations columns
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-705 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Force refresh logs"
          >
            <RefreshCw size={14} />
          </button>

          <button
            onClick={() => navigate("/tasks/create")}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-505 text-white text-[10px] font-black uppercase font-mono tracking-widest flex items-center gap-1.5 shadow-lg shadow-indigo-950/40 transition-all cursor-pointer"
          >
            <Plus size={14} />
            DECLARE ACTION TASK
          </button>
        </div>
      </div>

      {/* Filter and search options Panel */}
      <div className="bg-[#090e1a]/85 border border-slate-900 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Search by UUID, title, description, developer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#03060c] border border-slate-900 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-505 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-sans tracking-wide transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Header filters label */}
            <span className="text-[10px] font-mono font-bold text-slate-505 uppercase tracking-wider flex items-center gap-1">
              <SlidersHorizontal size={13} />
              FILTERS RAIL
            </span>

            {/* Clear filters buttons */}
            {(searchTerm || projectFilter !== "All" || priorityFilter !== "All" || assigneeFilter !== "All" || labelFilter !== "All") && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              >
                <FilterX size={12} />
                FLUSH FILTERS
              </button>
            )}
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#03060c]/40 p-3.5 rounded-xl border border-slate-900/40">
          {/* Project selection */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono text-slate-505 uppercase font-black tracking-wider">Subsystem Project</label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full bg-[#03060c] border border-slate-900 rounded-lg p-1.5 text-[11px] text-slate-355 font-mono focus:outline-none"
            >
              <option value="All">ALL SUBSYSTEMS</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Priority selection */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono text-slate-550 uppercase font-black tracking-wider">Priority Code</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-[#03060c] border border-slate-900 rounded-lg p-1.5 text-[11px] text-slate-350 font-mono focus:outline-none"
            >
              <option value="All">ALL PRIORITIES</option>
              <option value="Low">LOW PRIORITY</option>
              <option value="Medium">MEDIUM PRIORITY</option>
              <option value="High">HIGH PRIORITY</option>
              <option value="Critical">CRITICAL SECOP</option>
            </select>
          </div>

          {/* Developer selection */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono text-slate-550 uppercase font-black tracking-wider">Allocated Engineer</label>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full bg-[#03060c] border border-slate-905 rounded-lg p-1.5 text-[11px] text-slate-350 font-mono focus:outline-none"
            >
              <option value="All">ALL PERSONNEL</option>
              {uniqueAssignees.map((name) => (
                <option key={name} value={name}>
                  {name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Label selector */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono text-slate-550 uppercase font-black tracking-wider">Functional Tags</label>
            <select
              value={labelFilter}
              onChange={(e) => setLabelFilter(e.target.value)}
              className="w-full bg-[#03060c] border border-slate-905 rounded-lg p-1.5 text-[11px] text-slate-350 font-mono focus:outline-none"
            >
              <option value="All">ALL TAGS</option>
              {uniqueLabels.map((lbl) => (
                <option key={lbl} value={lbl}>
                  {lbl.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Kanban DndContext Board container */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-2" />
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Compiling active tactical board...</p>
        </div>
      ) : isError ? (
        <div className="py-12 border border-rose-500/20 bg-rose-950/20 rounded-2xl text-center text-rose-300 font-mono">
          CRITICAL ERROR RETRIEVING TASK REGISTRY METRICS.
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4.5 select-none">
            <KanbanColumn id="Todo" title="Backlog Queue" tasks={todoTasks} />
            <KanbanColumn id="In Progress" title="Active Handshake" tasks={progressTasks} />
            <KanbanColumn id="Review" title="Audit Review" tasks={reviewTasks} />
            <KanbanColumn id="Done" title="Finished Operations" tasks={doneTasks} />
          </div>
        </DndContext>
      )}
    </div>
  );
}

// Loader icon
function Loader2({ className }: { className?: string }) {
  return <RefreshCw className={className} />;
}
