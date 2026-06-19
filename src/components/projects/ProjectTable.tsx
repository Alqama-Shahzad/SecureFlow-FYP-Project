import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Eye, 
  Trash2, 
  Edit3, 
  ShieldAlert, 
  DollarSign, 
  Building 
} from "lucide-react";
import { Project } from "../../types/project-task";
import { StatusBadge, PriorityBadge } from "../shared/CommonParts";
import { cn } from "@/lib/utils";

interface ProjectTableProps {
  projects: Project[];
  onDelete: (id: string) => void;
}

export function ProjectTable({ projects, onDelete }: ProjectTableProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-slate-900 bg-[#03060c] font-mono text-[10px] text-slate-400 tracking-wider font-extrabold uppercase">
              <th className="py-4 pl-6 px-4">Project Workspace / ID</th>
              <th className="py-4 px-4">Manager / Office</th>
              <th className="py-4 px-4">Team capacity</th>
              <th className="py-4 px-4">Priority Level</th>
              <th className="py-4 px-4">Compliance Status</th>
              <th className="py-4 px-4 text-center">Progress Completion</th>
              <th className="py-4 px-4">Due Target</th>
              <th className="py-4 pr-6 pl-4 text-right">Controller Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 font-sans text-xs">
            {projects.map((project) => {
              const formattedBudget = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0
              }).format(project.budget);

              return (
                <tr key={project.id} className="hover:bg-[#070b12]/50 transition-colors group">
                  {/* Name and ID */}
                  <td className="py-4 pl-6 px-4">
                    <div className="font-extrabold text-slate-100 group-hover:text-[#3b82f6] transition-colors flex items-center gap-1.5 uppercase tracking-tight">
                      <span>{project.name}</span>
                      <span className="text-[8px] font-mono p-0.5 px-1 bg-indigo-950/40 border border-indigo-500/15 text-indigo-400 rounded">
                        {project.key}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">UUID: {project.id}</div>
                  </td>

                  {/* Manager and department */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-200">{project.projectManager}</div>
                    <div className="text-[9px] text-[#2563eb] font-mono mt-0.5 flex items-center gap-0.5 uppercase">
                      <Building size={9} />
                      {project.department}
                    </div>
                  </td>

                  {/* Team Members */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {project.teamMembers.map((member) => (
                          <img
                            key={member.id}
                            src={member.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                            alt={member.fullName}
                            className="inline-block h-5.5 w-5.5 rounded-full ring-2 ring-[#02050b] object-cover"
                            title={`${member.fullName}`}
                            referrerPolicy="no-referrer"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">
                        {project.teamMembers.length} nodes
                      </span>
                    </div>
                  </td>

                  {/* Priority level */}
                  <td className="py-4 px-4">
                    <PriorityBadge priority={project.priority} />
                  </td>

                  {/* Compliance Status badge */}
                  <td className="py-4 px-4">
                    <StatusBadge status={project.status} />
                  </td>

                  {/* Progress completion bar */}
                  <td className="py-4 px-4 align-middle">
                    <div className="flex items-center justify-center gap-2.5 max-w-[140px] mx-auto">
                      <div className="flex-1 bg-[#03060c] border border-slate-900 rounded-full h-2 p-[1px]">
                        <div 
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-300 shrink-0">
                        {project.progress}%
                      </span>
                    </div>
                  </td>

                  {/* Deadline target */}
                  <td className="py-4 px-4 text-slate-400 font-mono font-bold">
                    {project.deadline}
                  </td>

                  {/* Controller Actions */}
                  <td className="py-4 pr-6 pl-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="p-1 px-2 border border-slate-850 hover:border-indigo-500/10 bg-slate-900/40 text-[10px] font-mono font-black text-slate-400 hover:text-white rounded-lg transition-all"
                        title="Open interactive project suite"
                      >
                        EXPLORE
                      </button>

                      <button
                        onClick={() => navigate(`/projects/${project.id}/edit`)}
                        className="p-1.5 rounded-lg border border-slate-900 hover:border-slate-850 bg-slate-950 text-slate-500 hover:text-slate-200 transition-all cursor-pointer"
                        title="Edit parameters"
                      >
                        <Edit3 size={11} />
                      </button>

                      <button
                        onClick={() => onDelete(project.id)}
                        className="p-1.5 rounded-lg border border-slate-900 hover:border-rose-950 hover:bg-rose-950/20 hover:text-rose-400 text-slate-650 transition-all cursor-pointer"
                        title="Purge node"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
