import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building, 
  Calendar, 
  Eye, 
  ShieldAlert, 
  Users, 
  Trash2, 
  Edit3, 
  ExternalLink,
  DollarSign
} from "lucide-react";
import { Project } from "../../types/project-task";
import { StatusBadge, PriorityBadge, ProgressBar } from "../shared/CommonParts";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string, e: React.MouseEvent) => void;
  key?: string;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const navigate = useNavigate();

  const formattedBudget = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(project.budget);

  return (
    <div 
      className="bg-[#090e1a]/85 border border-slate-900 hover:border-slate-850 rounded-2xl p-5 shadow-lg backdrop-blur-md transition-all group flex flex-col justify-between hover:shadow-indigo-950/15"
      style={{ contentVisibility: "auto" }}
    >
      <div className="space-y-4">
        {/* Header line: Tags and visibility */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-900 pb-3">
          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-slate-500">
            <span>KEY: {project.key}</span>
            <span>•</span>
            <span className={cn(
              "px-1.5 py-0.5 rounded-md border text-[8px] font-bold",
              project.visibility === "Private" ? "bg-rose-950/20 text-rose-400 border-rose-500/15" :
              project.visibility === "Internal" ? "bg-indigo-950/20 text-indigo-400 border-indigo-500/15" :
              "bg-emerald-950/20 text-emerald-400 border-emerald-500/15"
            )}>
              {project.visibility}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <StatusBadge status={project.status} />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 
            onClick={() => navigate(`/projects/${project.id}`)}
            className="text-sm font-extrabold text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors cursor-pointer flex items-center justify-between gap-2"
          >
            <span className="truncate">{project.name}</span>
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 shrink-0" />
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 h-8 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Meta Stats Row */}
        <div className="grid grid-cols-2 gap-3 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900/60 font-mono text-[10px]">
          <div className="space-y-1">
            <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-widest">BUDGET ALLOCATION</span>
            <div className="text-slate-205 flex items-center gap-0.5 font-bold text-white">
              <DollarSign size={10} className="text-emerald-500" />
              <span>{formattedBudget}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-widest">DEPARTMENTAL COORD</span>
            <div className="text-slate-300 font-bold truncate flex items-center gap-1 text-slate-300">
              <Building size={10} className="text-indigo-400" />
              <span className="truncate">{project.department}</span>
            </div>
          </div>
        </div>

        {/* Members Avatars & High Risk indicators */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Risk Level:</span>
            <span className={cn(
              "px-1.5 py-0.5 rounded font-mono text-[8px] font-bold border tracking-wider",
              project.riskLevel === "Critical" ? "text-rose-455 bg-rose-950/20 border-rose-500/10" :
              project.riskLevel === "High" ? "text-amber-455 bg-amber-950/20 border-amber-500/10" :
              project.riskLevel === "Medium" ? "text-sky-455 bg-sky-950/20 border-sky-500/10" :
              "text-slate-455 bg-slate-950/20 border-slate-900"
            )}>
              {project.riskLevel}
            </span>
          </div>

          <div className="flex -space-x-1.5 overflow-hidden">
            {project.teamMembers.slice(0, 3).map((member) => (
              <img
                key={member.id}
                src={member.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt={member.fullName}
                className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-[#02050b] object-cover"
                title={`${member.fullName} - ${member.role}`}
                referrerPolicy="no-referrer"
              />
            ))}
            {project.teamMembers.length > 3 && (
              <div className="inline-flex items-center justify-center h-6.5 w-6.5 rounded-full bg-slate-900 border-2 border-[#02050b] text-[8px] font-mono font-bold text-slate-400">
                +{project.teamMembers.length - 3}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar Component */}
        <div className="pt-2 border-t border-slate-900/45">
          <ProgressBar value={project.progress} showText />
        </div>
      </div>

      {/* Primary Actions Bottom Row */}
      <div className="flex items-center justify-between border-t border-slate-900/60 pt-3.5 mt-5 gap-1.5">
        <span className="text-[9px] text-slate-500 font-mono inline-flex items-center gap-1 shrink-0">
          <Calendar size={11} className="text-indigo-400" />
          <span>BY {project.deadline}</span>
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/projects/${project.id}`)}
            className="p-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-900 hover:border-indigo-500/10 hover:text-white text-slate-400 transition-all font-mono text-[9px] font-bold uppercase inline-flex items-center gap-1 cursor-pointer"
            title="Inspect deep project parameters"
          >
            <Eye size={10} />
            WORKSPACE
          </button>

          <button
            onClick={() => navigate(`/projects/${project.id}/edit`)}
            className="p-1.5 rounded-lg border border-slate-900 hover:border-slate-800 bg-slate-950 text-slate-500 hover:text-white transition-all cursor-pointer"
            title="Edit coordinates"
          >
            <Edit3 size={11} />
          </button>

          <button
            onClick={(e) => onDelete(project.id, e)}
            className="p-1.5 rounded-lg border border-slate-900 hover:border-rose-950 hover:bg-rose-950/20 hover:text-rose-450 text-slate-600 transition-all cursor-pointer"
            title="Purge portfolio node"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
