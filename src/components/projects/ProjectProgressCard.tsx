import React from "react";
import { 
  FolderGit2, 
  PlayCircle, 
  CheckCircle2, 
  AlertOctagon, 
  Timer, 
  ShieldAlert 
} from "lucide-react";
import { ProjectSummary } from "../../types/project-task";

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  borderClass: string;
  bgGrad: string;
  iconTextClass: string;
  description: string;
}

export function ProjectProgressCard({ summary }: { summary: ProjectSummary }) {
  const cards: SummaryCardProps[] = [
    {
      label: "Institutional Portfolios",
      value: summary.total,
      icon: <FolderGit2 size={16} />,
      borderClass: "border-indigo-500/10 hover:border-indigo-500/20",
      bgGrad: "bg-indigo-950/5",
      iconTextClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/15",
      description: "Total systems cataloged",
    },
    {
      label: "Active Pipelines",
      value: summary.active,
      icon: <PlayCircle size={16} />,
      borderClass: "border-blue-500/10 hover:border-blue-500/25",
      bgGrad: "bg-blue-950/5",
      iconTextClass: "text-blue-400 bg-blue-500/10 border-blue-500/15",
      description: "In-flight operations",
    },
    {
      label: "Settled / Finalized",
      value: summary.completed,
      icon: <CheckCircle2 size={16} />,
      borderClass: "border-emerald-500/10 hover:border-emerald-500/25",
      bgGrad: "bg-emerald-950/5",
      iconTextClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/15",
      description: "100% compliance met",
    },
    {
      label: "Overdue / Stalled",
      value: summary.delayed,
      icon: <AlertOctagon size={16} />,
      borderClass: "border-rose-500/15 hover:border-rose-500/30",
      bgGrad: "bg-rose-950/5",
      iconTextClass: "text-rose-400 bg-rose-500/10 border-rose-500/15 animate-pulse",
      description: "Urgent core attention",
    },
    {
      label: "High Compliance Risk",
      value: summary.critical,
      icon: <ShieldAlert size={16} />,
      borderClass: "border-amber-500/10 hover:border-amber-500/25",
      bgGrad: "bg-amber-950/5",
      iconTextClass: "text-amber-400 bg-amber-500/10 border-amber-500/15",
      description: "Mitigations active",
    },
    {
      label: "Upcoming Milestones",
      value: summary.upcomingDeadlines,
      icon: <Timer size={16} />,
      borderClass: "border-slate-800 hover:border-slate-700",
      bgGrad: "bg-slate-900/10",
      iconTextClass: "text-slate-400 bg-slate-900/30 border-slate-800",
      description: "Deadlines < 10 days",
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`${card.bgGrad} border ${card.borderClass} rounded-2xl p-4 flex flex-col justify-between shadow-sm backdrop-blur-md transition-all group`}
        >
          <div className="flex justify-between items-start gap-2">
            <span className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-400">
              {card.label}
            </span>
            <span className={`p-1.5 rounded-lg border ${card.iconTextClass}`}>
              {card.icon}
            </span>
          </div>

          <div className="mt-4">
            <h4 className="text-2xl font-black text-white leading-none font-mono">
              {String(card.value).padStart(2, "0")}
            </h4>
            <p className="text-[9px] font-mono text-slate-500 uppercase mt-1 leading-tight">
              {card.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
