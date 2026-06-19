import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Task } from "../../types/project-task";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: string; // Column ID, matching: "Todo", "In Progress", "Review", "Done"
  title: string;
  tasks: Task[];
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  // Set up droppable hooks
  const { setNodeRef, isOver } = useDroppable({
    id: id
  });

  // Calculate dynamic colors by column
  let headerDot = "bg-indigo-400 shadow-[0_0_8px_#818cf8]";
  let colBg = "bg-slate-950/20";
  let titleText = "text-slate-205";

  if (id === "In Progress") {
    headerDot = "bg-blue-400 shadow-[0_0_8px_#60a5fa]";
    titleText = "text-blue-400";
  } else if (id === "Review") {
    headerDot = "bg-amber-400 shadow-[0_0_8px_#fbbf24]";
    titleText = "text-amber-400";
  } else if (id === "Done") {
    headerDot = "bg-emerald-400 shadow-[0_0_8px_#34d399]";
    titleText = "text-emerald-400";
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col h-[650px] rounded-2xl border transition-colors duration-200 select-none",
        isOver ? "bg-indigo-950/20 border-indigo-500/20" : "bg-[#090e1a]/45 border-slate-900/60",
        colBg
      )}
    >
      {/* Column Title Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-900/40 shrink-0">
        <div className="flex items-center gap-2">
          <span className={cn("w-1.5 h-1.5 rounded-full", headerDot)} />
          <h3 className={cn("text-xs font-mono font-black uppercase tracking-widest", titleText)}>
            {title}
          </h3>
        </div>

        <span className="h-5 px-2 bg-slate-950 border border-slate-905 rounded-full text-[9px] font-mono font-bold text-slate-455 flex items-center justify-center shrink-0">
          {String(tasks.length).padStart(2, "0")} NODES
        </span>
      </div>

      {/* Droppable Task Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-900">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="h-44 border border-dashed border-slate-900/45 rounded-xl flex items-center justify-center p-4">
            <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider text-center block">
              STATE EMPTY. DRAG ENCRYPTED RECORD COORD HERE.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
