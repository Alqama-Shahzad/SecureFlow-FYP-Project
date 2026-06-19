import React from "react";
import { useNavigate } from "react-router-dom";
import { useDraggable } from "@dnd-kit/core";
import { 
  MessageSquare, 
  Paperclip, 
  Calendar, 
  User, 
  GripVertical, 
  ExternalLink 
} from "lucide-react";
import { Task } from "../../types/project-task";
import { PriorityBadge, ProgressBar } from "../shared/CommonParts";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  key?: string;
}

export function TaskCard({ task }: TaskCardProps) {
  const navigate = useNavigate();

  // Set up dnd-kit draggable hooks
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task }
  });

  // Calculate transform css parameters
  const style: React.CSSProperties = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 100 : 1,
    cursor: "grabbing"
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-[#090e1a]/95 border border-slate-900 rounded-xl p-4 shadow-sm backdrop-blur-md transition-shadow hover:shadow-indigo-950/20 group relative flex flex-col justify-between",
        isDragging && "ring-2 ring-indigo-500 border-indigo-400"
      )}
    >
      <div className="space-y-3">
        {/* Upper priority and edit rows */}
        <div className="flex items-center justify-between gap-1 border-b border-slate-900/40 pb-2">
          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-slate-500">
            <span className="text-indigo-450 font-extrabold">{task.id}</span>
            <span>•</span>
            <span className="font-bold truncate max-w-[80px]">{task.projectKey}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <PriorityBadge priority={task.priority} />
            
            {/* Grab Drag controller */}
            <div 
              {...listeners} 
              {...attributes}
              className="p-1 px-1.5 bg-slate-950 border border-slate-900 rounded hover:border-slate-800 text-slate-500 hover:text-white cursor-grab transition-all shrink-0"
              title="Drag task node"
            >
              <GripVertical size={10} />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h4
            onClick={() => navigate(`/tasks/${task.id}`)}
            className="text-xs font-extrabold text-slate-205 group-hover:text-indigo-400 cursor-pointer flex items-center justify-between gap-2 transition-colors uppercase tracking-tight"
          >
            <span className="truncate">{task.title}</span>
            <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 shrink-0" />
          </h4>
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        </div>

        {/* Tags Label row */}
        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.map((lbl) => (
              <span
                key={lbl}
                className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wide uppercase bg-indigo-950/30 border border-indigo-500/10 text-indigo-400"
              >
                {lbl}
              </span>
            ))}
          </div>
        )}

        {/* Task progress indicator */}
        {task.status !== "Todo" && (
          <div className="pt-1.5">
            <ProgressBar value={task.progress} />
          </div>
        )}
      </div>

      {/* Footer details row */}
      <div className="flex items-center justify-between border-t border-slate-900/60 pt-3 mt-4 text-[9px] font-mono text-slate-500 uppercase">
        {/* Due target */}
        <span className="inline-flex items-center gap-1">
          <Calendar size={10} className="text-indigo-455" />
          <span className={cn(
            "font-bold",
            new Date(task.dueDate) < new Date() && task.status !== "Done" && "text-rose-400 font-extrabold"
          )}>
            {task.dueDate}
          </span>
        </span>

        {/* Discussions & files stats */}
        <div className="flex items-center gap-2">
          {task.comments.length > 0 && (
            <span className="inline-flex items-center gap-0.5" title="Thread comments">
              <MessageSquare size={10} />
              <span>{task.comments.length}</span>
            </span>
          )}

          {task.attachments.length > 0 && (
            <span className="inline-flex items-center gap-0.5" title="File attachments">
              <Paperclip size={10} />
              <span>{task.attachments.length}</span>
            </span>
          )}

          {/* Assignee Avatar */}
          {task.assigneeId ? (
            <img
              src={task.assigneeAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
              alt={task.assigneeName}
              className="w-5.5 h-5.5 rounded-full object-cover ring-1 ring-indigo-500/30 ml-1.5 shrink-0"
              title={`Assigned: ${task.assigneeName}`}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="w-5.5 h-5.5 rounded-full bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-700 ml-1.5 shrink-0"
              title="Unassigned worker node"
            >
              <User size={9} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
