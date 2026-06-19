import React from "react";
import { 
  Users, 
  Key, 
  Trash2, 
  Edit3, 
  Copy, 
  ShieldCheck, 
  AlertTriangle,
  Lock
} from "lucide-react";
import { RoleDTO } from "../../types/user-role";
import { cn } from "@/lib/utils";

interface RoleCardProps {
  key?: string;
  role: RoleDTO;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onConfigureMatrix: (roleName: string) => void;
}

export default function RoleCard({
  role,
  onEdit,
  onDuplicate,
  onDelete,
  onConfigureMatrix
}: RoleCardProps) {
  // Determine gradient color scheme based on role color string
  const getColorScheme = (color: string) => {
    switch (color) {
      case "rose":
        return {
          border: "border-rose-500/20 hover:border-rose-500/40",
          glow: "from-rose-500/5 to-transparent",
          text: "text-rose-400",
          badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
          progress: "bg-rose-500"
        };
      case "amber":
        return {
          border: "border-amber-500/20 hover:border-amber-500/40",
          glow: "from-amber-500/5 to-transparent",
          text: "text-amber-400",
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          progress: "bg-amber-500"
        };
      case "emerald":
        return {
          border: "border-emerald-500/20 hover:border-emerald-500/40",
          glow: "from-emerald-500/5 to-transparent",
          text: "text-emerald-400",
          badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          progress: "bg-emerald-500"
        };
      default:
        return {
          border: "border-indigo-500/20 hover:border-indigo-500/40",
          glow: "from-indigo-500/5 to-transparent",
          text: "text-indigo-400",
          badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
          progress: "bg-indigo-500"
        };
    }
  };

  const scheme = getColorScheme(role.color);
  const isDefaultSystemRole = ["admin", "project manager", "developer"].includes(role.name.toLowerCase());

  return (
    <div className={cn(
      "bg-[#090e1a]/80 backdrop-blur-md border rounded-2xl p-5 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between relative overflow-hidden transition-all duration-300 group hover:-translate-y-0.5",
      scheme.border
    )}>
      {/* Visual background atmospheric glow */}
      <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none opacity-40 transition-opacity duration-300 group-hover:opacity-60", scheme.glow)} />

      {/* Top Identity Block */}
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className={cn(
            "text-[9px] font-extrabold font-mono uppercase tracking-widest px-2.5 py-1 rounded-md border",
            scheme.badge
          )}>
            {role.accessLevel}
          </span>

          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onDuplicate(role.id)}
              className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-[#03060c] text-slate-400 hover:text-white transition-all hover:scale-105"
              title="Duplicate RBAC Role node"
            >
              <Copy size={12} />
            </button>
            <button
              onClick={() => onEdit(role.id)}
              className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-[#03060c] text-slate-400 hover:text-white transition-all hover:scale-105"
              title="Mutate Role Parameters"
            >
              <Edit3 size={12} />
            </button>
            {isDefaultSystemRole ? (
              <span 
                className="p-1.5 rounded-lg border border-slate-900 bg-slate-950/80 text-slate-650 cursor-not-allowed" 
                title="System Protected Profile (Cannot Shred)"
              >
                <Lock size={12} className="text-slate-600" />
              </span>
            ) : (
              <button
                onClick={() => {
                  if (confirm(`CRITICAL IDENTITY ACTIONS: Permanently shred customized RBAC role "${role.name}"? This will move existing users to the 'Developer' fallback role.`)) {
                    onDelete(role.id);
                  }
                }}
                className="p-1.5 rounded-lg border border-rose-950/40 hover:border-rose-900 bg-[#03060c] text-rose-450 hover:text-rose-400 transition-all hover:scale-105"
                title="Shred Custom Role Matrix"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            {role.name}
            {isDefaultSystemRole && (
              <span className="text-[8px] font-mono font-bold uppercase p-0.5 px-1 bg-indigo-950/50 border border-indigo-500/15 text-indigo-400 rounded">
                SYSTEM
              </span>
            )}
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-2 min-h-[50px]">
            {role.description}
          </p>
        </div>
      </div>

      {/* Metrics Block */}
      <div className="mt-6 pt-5 border-t border-slate-900/60 grid grid-cols-2 gap-4 relative">
        <div className="p-3 bg-[#03060c]/60 border border-slate-900 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-slate-900 border border-slate-800/60 rounded-lg text-slate-400">
            <Users size={14} />
          </div>
          <div>
            <div className="text-15 font-black text-white font-mono">{role.usersCount}</div>
            <div className="text-[8px] text-slate-500 font-mono uppercase font-bold mt-0.5">Assigned Nodes</div>
          </div>
        </div>

        <div className="p-3 bg-[#03060c]/60 border border-slate-900 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-slate-900 border border-slate-800/60 rounded-lg text-slate-400">
            <Key size={14} />
          </div>
          <div>
            <div className="text-15 font-black text-white font-mono">{role.permissionsCount}</div>
            <div className="text-[8px] text-slate-500 font-mono uppercase font-bold mt-0.5">Active Gates</div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-5 relative">
        <button
          onClick={() => onConfigureMatrix(role.name)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-950 border border-slate-850 hover:border-slate-800 text-[10px] font-mono text-slate-300 font-bold hover:text-white transition-all uppercase tracking-wide group-hover:border-indigo-500/25"
        >
          <ShieldCheck size={13} className={cn("transition-transform group-hover:scale-110", scheme.text)} />
          Configure RBAC Access Matrix
        </button>
      </div>
    </div>
  );
}
